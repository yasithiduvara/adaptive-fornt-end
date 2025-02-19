"use client";
import React, { forwardRef } from "react";
import { PROMPT_SUGGESTIONS } from "@/config/prompts";
import { PromptKey } from "@/types/chat";

export const PromptSuggestions = forwardRef<
  HTMLDivElement,
  {
    promptType: PromptKey | null;
    onSelect: (prompt: string) => void;
    onClose: () => void;
  }
>(({ promptType, onSelect, onClose }, ref) => {
  if (!promptType) return null;

  return (
    <div ref={ref} className="w-full max-w-2xl mt-4 animate-fade-in">
      <div className="grid grid-cols-1 gap-2 p-4 bg-gray-50 rounded-lg overflow-hidden">
        {PROMPT_SUGGESTIONS[promptType]?.map((prompt, index) => (
          <button
            key={index}
            onClick={() => {
              onSelect(prompt);
              onClose();
            }}
            className="text-left p-3 hover:bg-gray-100 rounded-md transition-all duration-300 ease-out text-sm text-gray-700 opacity-0 translate-y-2"
            style={{
              animation: `fadeInUp 0.3s ease-out ${index * 0.1}s forwards`,
            }}
          >
            <span className="font-medium">{index + 1}.</span> {prompt}
          </button>
        ))}
      </div>
    </div>
  );
});

PromptSuggestions.displayName = "PromptSuggestions";
