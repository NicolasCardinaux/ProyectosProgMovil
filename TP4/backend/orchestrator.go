package main

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"os"
	"sync" 
	"time"

	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
)


// En un sistema real, esto estaría en Redis o una base de datos.
var processedCommands = make(map[string]bool)
var processedCommandsMux sync.Mutex


func startOrchestrator() {
	broker := os.Getenv("KAFKA_BROKER")
	if broker == "" {
		broker = "kafka:29092"
	}
	group := "orchestrator-group"
	reader := newReader(broker, TopicCommands, group)
	defer reader.Close()

	log.Printf("[ORCH] Escuchando %s (group=%s)\n", TopicCommands, group)

	for {
		m, err := reader.FetchMessage(context.Background())
		if err != nil {
			log.Println("[ORCH] fetch error:", err)
			time.Sleep(1 * time.Second)
			continue
		}

		var cmd EventEnvelope
		if err := json.Unmarshal(m.Value, &cmd); err != nil {
			log.Println("[ORCH] Mensaje inválido, enviando a DLQ:", err)
			pubDLQ(broker, m.Key, m.Value)
			reader.CommitMessages(context.Background(), m)
			continue
		}


		processedCommandsMux.Lock()
		if _, processed := processedCommands[cmd.ID]; processed {
			log.Printf("[ORCH] Comando duplicado ignorado: %s (Txn: %s)\n", cmd.ID, cmd.TransactionID)
			processedCommandsMux.Unlock()
			if err := reader.CommitMessages(context.Background(), m); err != nil {
				log.Println("[ORCH] commit error (duplicado):", err)
			}
			continue 
		}

		processedCommands[cmd.ID] = true
		processedCommandsMux.Unlock()


		go processCommand(broker, cmd)

		if err := reader.CommitMessages(context.Background(), m); err != nil {
			log.Println("[ORCH] commit error:", err)
		}
	}
}

func processCommand(broker string, cmd EventEnvelope) {
	log.Printf("[ORCH] Procesando txn %s\n", cmd.TransactionID)

	initialPayload := cmd.Payload
	amount := 0.0
	if val, ok := initialPayload["amount"].(float64); ok {
		amount = val
	}

	time.Sleep(800 * time.Millisecond)
	fundsPayload := map[string]interface{}{"ok": true, "holdId": uuid.New().String()[:8], "amount": amount}
	fundsEvt, _ := NewEvent("FundsReserved", cmd.TransactionID, cmd.UserID, fundsPayload)
	_ = publish(broker, TopicEvents, cmd.TransactionID, fundsEvt)

	time.Sleep(1200 * time.Millisecond)
	risk := "LOW"
	if rand.Float32() > 0.8 {
		risk = "HIGH"
	}
	fraudPayload := map[string]interface{}{"risk": risk}
	fraudEvt, _ := NewEvent("FraudChecked", cmd.TransactionID, cmd.UserID, fraudPayload)
	_ = publish(broker, TopicEvents, cmd.TransactionID, fraudEvt)

	time.Sleep(800 * time.Millisecond)
	if risk == "LOW" {
		commPayload := map[string]interface{}{"ledgerTxId": uuid.New().String()[:12]}
		commEvt, _ := NewEvent("Committed", cmd.TransactionID, cmd.UserID, commPayload)
		_ = publish(broker, TopicEvents, cmd.TransactionID, commEvt)

		time.Sleep(400 * time.Millisecond)
		notPayload := map[string]interface{}{"channels": []string{"sms", "email"}}
		notEvt, _ := NewEvent("Notified", cmd.TransactionID, cmd.UserID, notPayload)
		_ = publish(broker, TopicEvents, cmd.TransactionID, notEvt)
	} else {
		revPayload := map[string]interface{}{"reason": "High fraud risk detected"}
		revEvt, _ := NewEvent("Reversed", cmd.TransactionID, cmd.UserID, revPayload)
		_ = publish(broker, TopicEvents, cmd.TransactionID, revEvt)
	}
}

func pubDLQ(broker string, key []byte, value []byte) {
	w := kafka.Writer{
		Addr:     kafka.TCP(broker),
		Topic:    TopicDLQ,
		Balancer: &kafka.Hash{},
	}
	defer w.Close()
	msg := kafka.Message{Key: key, Value: value, Time: time.Now()}
	_ = w.WriteMessages(context.Background(), msg)
}