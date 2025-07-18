'use client';

import { useEffect, useState } from 'react';
import { connectWebSocket, disconnectWebSocket } from '@/lib/websocketClient';

interface Message {
  senderId: string;
  content: string;
  timestamp: string;
}

const MessageFeed: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    connectWebSocket((msg: Message) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>📡 Real-time Feed</h3>
      {messages.length === 0 && <p>No incoming messages yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {messages.map((msg, index) => (
          <li key={index} style={{ marginBottom: '10px', padding: '10px', background: '#f3f3f3', borderRadius: '5px' }}>
            <strong>{msg.senderId}</strong>: {msg.content}
            <br />
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageFeed;