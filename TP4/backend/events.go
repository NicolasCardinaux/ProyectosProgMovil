package main

import (
	"math/rand"
	"time"
)

// EventEnvelope define la estructura estándar para todos los eventos del sistema
type EventEnvelope struct {
	TransactionID string         `json:"transactionId"`
	UserID        string         `json:"userId"`
	Type          string         `json:"type"`
	Payload       map[string]any `json:"payload"`
	Ts            int64          `json:"ts"`
	ID            string         `json:"id"`
	Version       int            `json:"version"`
	CorrelationID string         `json:"correlationId,omitempty"`
}

// NewEvent es una función "fábrica" que crea nuevos eventos de forma consistente, asegurando que todos los campos de metadatos se rellenen automáticamente.
func NewEvent(eventType, transactionID, userID string, payload map[string]any) (*EventEnvelope, error) {
	if payload == nil {
		payload = make(map[string]any)
	}
	evt := &EventEnvelope{
		TransactionID: transactionID,
		UserID:        userID,
		Type:          eventType,
		Payload:       payload,
		Ts:            time.Now().UnixMilli(),
		ID:            generateUniqueID(),
		Version:       1,
	}
	return evt, nil
}

// Las siguientes son funciones de utilidad para generar un ID único para cada evento.
func init() {
	rand.Seed(time.Now().UnixNano())
}

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func randString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func generateUniqueID() string {
	return time.Now().Format("20060102150405.000") + "-" + randString(5)
}