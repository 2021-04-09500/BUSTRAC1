
'use client';

import { Client, IMessage } from '@stomp/stompjs';

let stompClient: Client | null = null;

export const connectWebSocket = (onMessage: (msg: any) => void) => {
  stompClient = new Client({
    brokerURL: 'ws://localhost:8081/ws', 
    reconnectDelay: 5000,
    debug: (str) => console.log(`[WebSocket]: ${str}`),

    onConnect: () => {
      console.log(' Connected to WebSocket');

      // Subscribe to topics
      stompClient?.subscribe('/topic/parents', (message: IMessage) => {
        onMessage(JSON.parse(message.body));
      });

      stompClient?.subscribe('/topic/conductors', (message: IMessage) => {
        onMessage(JSON.parse(message.body));
      });

      stompClient?.subscribe('/topic/admin', (message: IMessage) => {
        onMessage(JSON.parse(message.body));
      });
    },

    onStompError: (frame) => {
      console.error('WebSocket error:', frame.headers['message']);
      console.error('Details:', frame.body);
    },
  });

  stompClient.activate(); 
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate(); 
    console.log('Disconnected from WebSocket');
  }
};

export const sendToAdmin = (message: any) => {
  if (!stompClient || !stompClient.connected) {
    console.warn(' WebSocket is not connected.');
    return;
  }

  stompClient.send('/app/send-to-admin', {}, JSON.stringify(message));
};
