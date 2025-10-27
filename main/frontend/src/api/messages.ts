// API: Messages
// Purpose: Messaging API calls

import { buildPath } from '../Path.js';

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface CreateConversationRequest {
  participants: string[];
}

interface SendMessageRequest {
  content: string;
}

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
});

export class MessagesAPI {
  static async getConversations(): Promise<Conversation[]> {
    try {
      const response = await fetch(buildPath('api/conversations'), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  static async sendMessage(conversationId: string, messageData: SendMessageRequest): Promise<Message> {
    try {
      const response = await fetch(buildPath(`api/conversations/${conversationId}/messages`), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(messageData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  static async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await fetch(buildPath(`api/conversations/${conversationId}/messages`), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  static async createConversation(conversationData: CreateConversationRequest): Promise<Conversation> {
    try {
      const response = await fetch(buildPath('api/conversations'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(conversationData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }
}
