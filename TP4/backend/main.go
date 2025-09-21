package main

import (
	"log"
	"os"
)

func main() {
	role := os.Getenv("SERVICE_ROLE")
	if role == "" {
		log.Fatal("SERVICE_ROLE no definido. Valores: api | orchestrator | gateway")
	}

	switch role {
	case "api":
		startAPI()
	case "orchestrator":
		startOrchestrator()
	case "gateway":
		startGateway()
	default:
		log.Fatalf("SERVICE_ROLE desconocido: %s", role)
	}
}
