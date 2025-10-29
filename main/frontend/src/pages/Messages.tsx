// Page: Messages
// Purpose: Messaging and chat interface page
import React, { useState, useEffect } from "react";
import ChatThread from "../components/Messages/ChatThread";
import MessageSendBox from "../components/Messages/MessageSendBox";
import type { Message } from "../types";

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch messages from API
    // For now, set empty array and loading false
    setLoading(false);
  }, []);

  const handleSendMessage = (content: string) => {
    // TODO: Send message via API
    console.log('Sending message:', content);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
  };

  return (
    <div className="page-container messages-page">
      <div className="messages-header">
        <h1>Messages</h1>
      </div>

      <div className="messages-content">
        {loading ? (
          <p>Loading messages...</p>
        ) : selectedChat ? (
          <>
            <ChatThread 
              messages={messages}
              userId={selectedChat}
              onSendMessage={handleSendMessage}
            />
            <MessageSendBox 
              onSend={handleSendMessage}
            />
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
