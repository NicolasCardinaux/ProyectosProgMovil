package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

// TransactionRequest define la estructura que esperamos recibir en el body
type TransactionRequest struct {
	FromAccount string  `json:"fromAccount"`
	ToAccount   string  `json:"toAccount"`
	Amount      float64 `json:"amount"`
	Currency    string  `json:"currency"`
	UserID      string  `json:"userId"`
}

// Su única responsabilidad es recibir peticiones, validarlas y publicarlas en Kafka.
func startAPI() {
	broker := os.Getenv("KAFKA_BROKER")
	if broker == "" {
		broker = "kafka:29092"
	}

	r := mux.NewRouter()
	r.HandleFunc("/transactions", func(w http.ResponseWriter, r *http.Request) {
		var req TransactionRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid body", http.StatusBadRequest)
			return
		}

		if req.FromAccount == "" || req.ToAccount == "" || req.Amount <= 0 {
			http.Error(w, "missing or invalid fields", http.StatusBadRequest)
			return
		}


		txnId := uuid.New().String()

		payload := map[string]interface{}{
			"fromAccount": req.FromAccount,
			"toAccount":   req.ToAccount,
			"amount":      req.Amount,
			"currency":    req.Currency,
			"userId":      req.UserID,
		}

		// Creamos un evento "TransactionInitiated" con todos los datos.
		evt, err := NewEvent("TransactionInitiated", txnId, req.UserID, payload)
		if err != nil {
			http.Error(w, "failed to create event", http.StatusInternalServerError)
			return
		}

		// Publicamos el evento en nuestro topic de Kafka.
		if err := publish(broker, TopicCommands, txnId, evt); err != nil {
			http.Error(w, "failed to publish event", http.StatusInternalServerError)
			return
		}

		// Respondemos inmediatamente al cliente con un "202 Accepted".
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusAccepted)
		json.NewEncoder(w).Encode(map[string]string{"transactionId": txnId})

	}).Methods("POST")

	addr := ":3000"
	log.Printf("[API] Escuchando en %s (KAFKA=%s)\n", addr, broker)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatal(err)
	}
}