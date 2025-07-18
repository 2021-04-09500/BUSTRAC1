"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./messaging.module.css";

import {
  fetchConductors,
} from "@/app/services/userService";

import {
  fetchSentMessages,
  sendBroadcastMessage,
  sendIndividualMessage,
} from "@/app/services/messagingService";

import MessageFeed from "@/app/ui/dashboard/messaging/messageFeed";
import { connectWebSocket, disconnectWebSocket } from "@/lib/websocketClient";

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  type: string;
  content: string;
  recipientId?: string;
  recipientName?: string;
  timestamp: string;
}

const Messaging: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"broadcast" | "individual">("broadcast");
  const [recipient, setRecipient] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>("");

  
  useEffect(() => {
    const prefill = searchParams.get("prefill");
    if (prefill) {
      setMessage(decodeURIComponent(prefill));
    }
  }, [searchParams]);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    const loadUsers = async () => {
      try {
        const fetchedConductors = await fetchConductors();
        setUsers(fetchedConductors);
      } catch (error: unknown) {
        const err = error as Error;
        setError(err.message || "Failed to load conductors.");
      }
    };

    const loadSentMessages = async () => {
      try {
        const messages = await fetchSentMessages();
        const messagesWithNames = messages.map((msg) => ({
          ...msg,
          recipientName:
            msg.type === "individual"
              ? users.find((u) => u.id === msg.recipientId)?.name || "Unknown"
              : undefined,
        }));
        setSentMessages(messagesWithNames);
      } catch (error: unknown) {
        const err = error as Error;
        setError(err.message || "Failed to load sent messages.");
      }
    };

    loadUsers().then(loadSentMessages);
  }, []);

  
  useEffect(() => {
    connectWebSocket((msg: Message) => {
      const recipientName =
        msg.type === "individual"
          ? users.find((u) => u.id === msg.recipientId)?.name || "Unknown"
          : undefined;
      setSentMessages((prev) => [...prev, { ...msg, recipientName }]);
    });

    return () => {
      disconnectWebSocket();
    };
  }, [users]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    if (activeTab === "individual" && !recipient) {
      setError("Please select a recipient.");
      return;
    }

    try {
      let newMessage: Message;

      if (activeTab === "broadcast") {
        newMessage = await sendBroadcastMessage(message);
      } else {
        newMessage = await sendIndividualMessage(recipient, message);
        newMessage.recipientName = users.find((u) => u.id === recipient)?.name || "Unknown";
      }

      setSentMessages([...sentMessages, newMessage]);
      setMessage("");
      setRecipient("");
      setError("");
    } catch (error: unknown) {
      const err = error as Error;
      setError(err.message || "Failed to send message.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "broadcast" ? styles.active : ""}`}
          onClick={() => setActiveTab("broadcast")}
        >
          Broadcast
        </button>
        <button
          className={`${styles.tab} ${activeTab === "individual" ? styles.active : ""}`}
          onClick={() => setActiveTab("individual")}
        >
          Individual
        </button>
      </div>

      <div className={styles.messageForm}>
        {activeTab === "individual" && (
          <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
            <option value="">Select Recipient</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        )}

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button onClick={handleSendMessage}>Send Message</button>
      </div>

      <div className={styles.sentMessages}>
        <h3>Sent Messages</h3>
        {sentMessages.length === 0 ? (
          <p>No messages sent yet.</p>
        ) : (
          sentMessages.map((msg) => (
            <div key={msg.id} className={styles.messageItem}>
              <p><strong>Type:</strong> {msg.type}</p>
              {msg.type === "individual" && (
                <p><strong>Recipient:</strong> {msg.recipientName}</p>
              )}
              <p><strong>Message:</strong> {msg.content}</p>
              <p><strong>Sent At:</strong> {new Date(msg.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      <MessageFeed />
    </div>
  );
};

export default Messaging;
