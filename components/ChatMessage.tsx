"use client";
import React, { useState } from "react";
import { ChatMessageProps } from "@/types/chat";

export const ChatMessage = ({ message, isUser, actions }: ChatMessageProps) => {
  return (
    <div
      className={`flex w-full mb-4
        ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-travel-100 flex items-center justify-center mr-2">
          <span className="text-travel-600 text-sm">✨</span>
        </div>
      )}
      <div className="flex flex-col max-w-[80%]">
        <div
          className={`rounded-2xl p-4 ${
            isUser
              ? "bg-travel-100 text-travel-900 rounded-br-none"
              : "bg-white border border-gray-200 rounded-bl-none"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
        {actions && actions.length > 0 && !isUser && (
          <div className="flex flex-wrap gap-2 mt-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="px-4 py-2 text-sm rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
