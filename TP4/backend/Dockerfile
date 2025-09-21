FROM golang:1.23-alpine AS build

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o backend_bin .

FROM alpine:3.18
WORKDIR /app
COPY --from=build /app/backend_bin .
COPY wait-for-kafka.sh .
RUN apk add --no-cache ca-certificates bash netcat-openbsd
RUN chmod +x wait-for-kafka.sh
EXPOSE 3000 8080
ENTRYPOINT ["/app/backend_bin"]