package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

// --- Definición de Topics de Kafka ---
const (
	TopicCommands = "txn.commands"
	TopicEvents   = "txn.events"
	TopicDLQ      = "txn.dlq"
)

// --- Funciones de Interacción con Kafka ---

func publish(broker, topic string, key string, evt *EventEnvelope) error {
	w := kafka.Writer{
		Addr:         kafka.TCP(broker),
		Topic:        topic,
		Balancer:     &kafka.Hash{},
		RequiredAcks: kafka.RequireOne,
	}
	defer w.Close()

	msgBytes, _ := json.Marshal(evt)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := w.WriteMessages(ctx, kafka.Message{
		Key:   []byte(key),
		Value: msgBytes,
		Time:  time.Now(),
	})

	if err != nil {
		log.Printf("[KAFKA] Error publicando en %s: %v", topic, err)
	}
	return err
}


func newReader(broker, topic, groupId string) *kafka.Reader {
	return kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{broker},
		Topic:    topic,
		GroupID:  groupId, 
		MinBytes: 1,
		MaxBytes: 10e6,
	})
}