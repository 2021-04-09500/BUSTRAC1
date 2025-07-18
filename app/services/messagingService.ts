import { apiRequest } from './authService';

interface Message {
  id: string;
  type: string;
  content: string;
  recipientId?: string;
  recipientName?: string;
  timestamp: string;
}


export const fetchSentMessages = async (): Promise<Message[]> => {
  try {
    const messages: Message[] = await apiRequest('/messages/sent', 'get');
    return messages;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching sent messages:', err.message);
    throw new Error(err.message || 'Failed to fetch sent messages');
  }
};


export const sendBroadcastMessage = async (content: string): Promise<Message> => {
  try {
  
    const parentMessage: Message = await apiRequest('/messages/broadcast/parents', 'post', { content });

    
    const conductorMessage: Message = await apiRequest('/messages/broadcast/conductors', 'post', { content });

    
    return parentMessage;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error sending broadcast message:', err.message);
    throw new Error(err.message || 'Failed to send broadcast message to parents and conductors');
  }
};


export const sendIndividualMessage = async (recipientId: string, content: string): Promise<Message> => {
  try {
    const message: Message = await apiRequest('/messages/individual', 'post', { recipientId, content });
    return message;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error sending individual message:', err.message);
    throw new Error(err.message || 'Failed to send individual message');
  }
};