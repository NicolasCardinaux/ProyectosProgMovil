import { useState, useEffect, useRef } from 'react';


const WS_URL = 'ws://10.0.2.2:8080/ws';

export const useWebSocket = (onMessage) => {
  const [status, setStatus] = useState('Connecting...');
  const [retryCount, setRetryCount] = useState(0);
  const ws = useRef(null);

  useEffect(() => {
    const connect = () => {
      console.log('Connecting to WebSocket:', WS_URL);
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('WebSocket connected successfully');
        setStatus('Connected');
        setRetryCount(0); 

      
        const subscriptionMessage = {
          type: 'subscribe',
          userId: 'user-987',
        };

        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(subscriptionMessage));
        }
      };

      ws.current.onclose = (e) => {
        console.log('WebSocket closed:', e.code, e.reason);
        setStatus(`Disconnected. Retrying...`);
        

        const delay = Math.min(3000 * Math.pow(1.5, retryCount), 30000);
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, delay);
      };

      ws.current.onerror = (e) => {
        console.error('WebSocket Error:', e.message || 'Unknown error');
      };

      ws.current.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          onMessage(event);
        } catch (err) {
          console.error('Error parsing WS message:', err, 'Data:', e.data);
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