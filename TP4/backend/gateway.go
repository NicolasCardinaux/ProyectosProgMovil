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


var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		log.Printf("[GATEWAY] Aceptando conexión de origen: %s", r.Header.Get("Origin"))
		return true
	},
}

var subscriptions = make(map[string][]*websocket.Conn)
var clientsMux sync.Mutex

type SubscriptionMessage struct {
	Type   string `json:"type"`
	UserID string `json:"userId"`
}

func startGateway() {
	broker := os.Getenv("KAFKA_BROKER")
	if broker == "" {
		broker = "kafka:29092"
	}
	group := "gateway-group"


	go func() {
		metricsAddr := ":9090" 
		log.Printf("[GATEWAY] Servidor de métricas escuchando en %s/metrics\n", metricsAddr)
		http.Handle("/metrics", promhttp.Handler())
		if err := http.ListenAndServe(metricsAddr, nil); err != nil {
			log.Fatalf("[GATEWAY] Error en ListenAndServe de métricas: %v", err)
		}
	}()


	http.HandleFunc("/ws", wsHandler)

	go func() {
		addr := ":8080"
		log.Printf("[GATEWAY] ws escuchando en %s\n", addr)
		if err := http.ListenAndServe(addr, nil); err != nil {
			log.Fatalf("[GATEWAY] Error en ListenAndServe: %v", err)
		}
	}()

	reader := newReader(broker, TopicEvents, group)
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
		if err := reader.CommitMessages(context.Background(), m); err != nil {
			log.Printf("[GATEWAY] commit error: %v", err)
		}
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("[GATEWAY] WebSocket connection attempt from: %s", r.RemoteAddr)
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("[GATEWAY] ws upgrade failed: %v", err)
		http.Error(w, "WebSocket upgrade failed", http.StatusBadRequest)
		return
	}
	log.Printf("[GATEWAY] WebSocket connection upgraded successfully for %s", r.RemoteAddr)
	activeConnections.Inc()

	go func() {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("[GATEWAY] Panic recuperado en wsHandler: %v", r)
			}
			log.Printf("[GATEWAY] Closing WebSocket connection from %s", r.RemoteAddr)
			activeConnections.Dec() 
			removeSubscription(conn)
			if err := conn.Close(); err != nil {
				log.Printf("[GATEWAY] error al cerrar conexión: %v", err)
			}
		}()

		for {
			_, msg, err := conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("[GATEWAY] cliente desconectado (error inesperado): %v", err)
				} else {
					log.Printf("[GATEWAY] conexión cerrada normalmente o por error: %v", err)
				}
				break
			}
			log.Printf("[GATEWAY] Mensaje recibido: %s", string(msg))

			var subMsg SubscriptionMessage
			if err := json.Unmarshal(msg, &subMsg); err == nil && subMsg.Type == "subscribe" {
				addSubscription(subMsg.UserID, conn)
				log.Printf("[GATEWAY] cliente suscrito para userId: %s", subMsg.UserID)
				if err := conn.WriteMessage(websocket.TextMessage, []byte(`{"type":"ack"}`)); err != nil {
					log.Printf("[GATEWAY] error enviando ACK: %v", err)
				}
			} else {
				log.Printf("[GATEWAY] mensaje inválido recibido: %v", err)
			}
		}
	}()
}

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
				log.Printf("[GATEWAY] cliente desuscrito para userId: %s", userId)
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
		if err := conn.WriteMessage(websocket.TextMessage, data); err != nil {
			log.Printf("[GATEWAY] write error: %v", err)
		} else {
			eventsSent.With(prometheus.Labels{"event_type": evt.Type}).Inc()
		}
	}
}