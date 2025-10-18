package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// --- Métricas de Monitoreo ---
// Estas variables definen las métricas que expondremos a Prometheus para monitorear
var (
	activeConnections = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "gateway_websocket_active_connections",
		Help: "El número actual de conexiones WebSocket activas.",
	})

	eventsSent = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "gateway_events_sent_total",
		Help: "Total de eventos enviados a los clientes vía WebSocket.",
	}, []string{"event_type"})
)

// --- Configuración y Estado del Gateway ---
// upgrader se encarga de "actualizar" una conexión HTTP estándar a una conexión WebSocket persistente.
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true 
	},
}


var subscriptions = make(map[string][]*websocket.Conn)
var clientsMux sync.Mutex


type SubscriptionMessage struct {
	Type   string `json:"type"`
	UserID string `json:"userId"`
}

// --- Lógica Principal del Servicio ---

// startGateway es el punto de entrada del servicio. Inicia el servidor de métricas,el servidor WebSocket, y comienza a consumir eventos de Kafka en un bucle infinito.
func startGateway() {
	broker := os.Getenv("KAFKA_BROKER")
	if broker == "" {
		broker = "kafka:29092"
	}


	go func() {
		metricsAddr := ":9090"
		log.Printf("[GATEWAY] Servidor de métricas escuchando en %s/metrics\n", metricsAddr)
		http.Handle("/metrics", promhttp.Handler())
		http.ListenAndServe(metricsAddr, nil)
	}()


	http.HandleFunc("/ws", wsHandler)
	go func() {
		addr := ":8080"
		log.Printf("[GATEWAY] ws escuchando en %s\n", addr)
		http.ListenAndServe(addr, nil)
	}()

	// Este es el bucle principal: lee mensajes de Kafka, los decodifica, y los retransmite.
	reader := newReader(broker, TopicEvents, "gateway-group")
	defer reader.Close()
	log.Printf("[GATEWAY] consumiendo de %s\n", TopicEvents)

	for {
		m, err := reader.FetchMessage(context.Background())
		if err != nil {
			log.Printf("[GATEWAY] fetch error (retrying): %v", err)
			time.Sleep(2 * time.Second)
			continue
		}

		var evt EventEnvelope
		if err := json.Unmarshal(m.Value, &evt); err != nil {
			log.Printf("[GATEWAY] evento inválido (commit y continuar): %v", err)
			reader.CommitMessages(context.Background(), m)
			continue
		}

		broadcastToUser(evt) 
		reader.CommitMessages(context.Background(), m)
	}
}

// wsHandler maneja cada nueva conexión de un cliente. 
func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("[GATEWAY] ws upgrade failed: %v", err)
		return
	}
	activeConnections.Inc() 

	go func() {
		defer func() {
			activeConnections.Dec() 
			removeSubscription(conn)
			conn.Close()
		}()

		for {
			_, msg, err := conn.ReadMessage()
			if err != nil {
				break 
			}

			var subMsg SubscriptionMessage
			if err := json.Unmarshal(msg, &subMsg); err == nil && subMsg.Type == "subscribe" {
				addSubscription(subMsg.UserID, conn)
				conn.WriteMessage(websocket.TextMessage, []byte(`{"type":"ack"}`)) 
			}
		}
	}()
}

// --- Funciones de Ayuda para Suscripciones ---

func addSubscription(userId string, conn *websocket.Conn) {
	clientsMux.Lock()
	defer clientsMux.Unlock()
	subscriptions[userId] = append(subscriptions[userId], conn)
}


func removeSubscription(conn *websocket.Conn) {
	clientsMux.Lock()
	defer clientsMux.Unlock()
	for userId, conns := range subscriptions {
		for i, c := range conns {
			if c == conn {
				subscriptions[userId] = append(conns[:i], conns[i+1:]...)
				if len(subscriptions[userId]) == 0 {
					delete(subscriptions, userId)
				}
				return
			}
		}
	}
}


func broadcastToUser(evt EventEnvelope) {
	clientsMux.Lock()
	defer clientsMux.Unlock()

	userConnections, ok := subscriptions[evt.UserID]
	if !ok {
		return 
	}

	data, err := json.Marshal(evt)
	if err != nil {
		log.Printf("[GATEWAY] error marshaling evento: %v", err)
		return
	}
	for _, conn := range userConnections {
		if err := conn.WriteMessage(websocket.TextMessage, data); err == nil {
			eventsSent.With(prometheus.Labels{"event_type": evt.Type}).Inc() 
		}
	}
}