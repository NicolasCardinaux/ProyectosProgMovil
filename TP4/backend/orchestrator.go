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


var processedCommands = make(map[string]bool)
var processedCommandsMux sync.Mutex

// startOrchestrator es el "cerebro" del sistema. Escucha los comandos y coordina la secuencia de pasos necesarios para completar la operación.
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
			time.Sleep(1 * time.Second)
			continue
		}

		var cmd EventEnvelope
		if err := json.Unmarshal(m.Value, &cmd); err != nil {
			pubDLQ(broker, m.Key, m.Value)
			reader.CommitMessages(context.Background(), m)
			continue
		}


		processedCommandsMux.Lock()
		if _, processed := processedCommands[cmd.ID]; processed {
			processedCommandsMux.Unlock()
			reader.CommitMessages(context.Background(), m)
			continue
		}
		processedCommands[cmd.ID] = true
		processedCommandsMux.Unlock()


		go processCommand(broker, cmd)

		reader.CommitMessages(context.Background(), m)
	}
}

// processCommand simula el flujo de una transacción paso a paso.
// Por cada paso completado (reservar fondos, chequear fraude, etc.),
// publica un nuevo evento en Kafka para notificar al resto del sistema.
func processCommand(broker string, cmd EventEnvelope) {
	log.Printf("[ORCH] Procesando txn %s\n", cmd.TransactionID)
	initialPayload := cmd.Payload
	amount, _ := initialPayload["amount"].(float64)

	// 1. Simula la reserva de fondos.
	time.Sleep(800 * time.Millisecond)
	fundsPayload := map[string]interface{}{"ok": true, "holdId": uuid.New().String()[:8], "amount": amount}
	fundsEvt, _ := NewEvent("FundsReserved", cmd.TransactionID, cmd.UserID, fundsPayload)
	_ = publish(broker, TopicEvents, cmd.TransactionID, fundsEvt)

	// 2. Simula el chequeo de fraude.
	time.Sleep(1200 * time.Millisecond)
	risk := "LOW"
	if rand.Float32() > 0.8 { // 20% de probabilidad de riesgo alto.
		risk = "HIGH"
	}
	fraudPayload := map[string]interface{}{"risk": risk}
	fraudEvt, _ := NewEvent("FraudChecked", cmd.TransactionID, cmd.UserID, fraudPayload)
	_ = publish(broker, TopicEvents, cmd.TransactionID, fraudEvt)

	// 3. Decide el siguiente paso basado en el resultado del chequeo de fraude.
	time.Sleep(800 * time.Millisecond)
	if risk == "LOW" {
		// Si el riesgo es bajo, confirma la transacción y notifica.
		commPayload := map[string]interface{}{"ledgerTxId": uuid.New().String()[:12]}
		commEvt, _ := NewEvent("Committed", cmd.TransactionID, cmd.UserID, commPayload)
		_ = publish(broker, TopicEvents, cmd.TransactionID, commEvt)

		time.Sleep(400 * time.Millisecond)
		notPayload := map[string]interface{}{"channels": []string{"sms", "email"}}
		notEvt, _ := NewEvent("Notified", cmd.TransactionID, cmd.UserID, notPayload)
		_ = publish(broker, TopicEvents, cmd.TransactionID, notEvt)
	} else {
		// Si el riesgo es alto, revierte la transacción.
		revPayload := map[string]interface{}{"reason": "High fraud risk detected"}
		revEvt, _ := NewEvent("Reversed", cmd.TransactionID, cmd.UserID, revPayload)
		_ = publish(broker, TopicEvents, cmd.TransactionID, revEvt)
	}
}

// pubDLQ envía mensajes que no se pudieron procesar a una "Dead Letter Queue"
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