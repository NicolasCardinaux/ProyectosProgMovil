#!/bin/bash
echo "Waiting for Kafka to be ready..."
attempt=0
max_attempts=10
until nc -z kafka 29092; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $max_attempts ]; then
    echo "Error: No se pudo conectar a Kafka después de $max_attempts intentos."
    exit 1
  fi
  echo "Retrying Kafka connection... (Intento $attempt/$max_attempts)"
  sleep 5
done
echo "Kafka is ready!"
exec "$@"