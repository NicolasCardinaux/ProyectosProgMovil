import { useState, useEffect, useRef } from 'react';

const WS_URL = 'ws://10.0.2.2:8080/ws';

// Este hook personalizado maneja la conexión WebSocket con nuestro servicio Gateway.
export const useWebSocket = (onMessage) => {
  const [status, setStatus] = useState('Conectando...');
  const [retryCount, setRetryCount] = useState(0);
  const ws = useRef(null);

  // `useEffect` maneja el ciclo de vida de la conexión.
  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        setStatus('Conectado'); 
        setRetryCount(0);

        const subscriptionMessage = {
          type: 'subscribe',
          userId: 'user-987',
        };
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(subscriptionMessage));
        }
      };

      ws.current.onclose = () => {
        setStatus(`Desconectado. Reintentando...`);
        const delay = Math.min(3000 * Math.pow(1.5, retryCount), 30000);
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, delay);
      };

      ws.current.onerror = (e) => {
        console.error('Error WebSocket:', e.message || 'Error desconocido');
      };

      ws.current.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          onMessage(event);
        } catch (err) {
          console.error('Error parseando mensaje WS:', err, 'Data:', e.data);
        }
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onerror = null;
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [onMessage, retryCount]);

  return status;
};
