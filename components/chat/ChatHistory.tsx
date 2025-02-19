"use client";
import { ChatMessage } from "./ChatMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const ChatHistory = ({
  messages,
  isLoading,
}: {
  messages: Array<{ text: string; isUser: boolean }>;
  isLoading: boolean;
}) => (
  <div className="flex-1 overflow-auto p-4">
    {messages.map((msg, index) => (
      <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
    ))}
    {isLoading && <LoadingSpinner />}
  </div>
);
