"use client";
import { ActionButtons } from "./ActionButtons";
import { PromptSuggestions } from "./PromptSuggestions";
import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";
import { PromptKey } from "@/types/chat";

export const ChatSection = ({
  messages,
  isLoading,
  onSend,
  actionButtons,
  selectedPromptType,
  suggestionsRef,
  setSelectedPromptType,
}: {
  messages: Array<{ text: string; isUser: boolean }>;
  isLoading: boolean;
  onSend: (message: string) => void;
  actionButtons: typeof import("@/config/prompts").actionButtons;
  selectedPromptType: PromptKey | null;
  suggestionsRef: React.RefObject<HTMLDivElement>;
  setSelectedPromptType: (type: PromptKey | null) => void;
}) => (
  <div
    className={`transition-all duration-300 ease-in-out bg-white ${
      messages.length > 0 ? "w-1/3 border-r border-gray-200" : "w-full"
    }`}
  >
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold mb-4">Smart Travel Assistant 🌴</h1>
          <p className="text-xl text-gray-600 mb-12">
            Where would you like to go?
          </p>

          <ActionButtons
            buttons={actionButtons}
            onSelect={(button) => {
              setSelectedPromptType(button.promptKey);
            }}
          />

          <PromptSuggestions
            ref={suggestionsRef}
            promptType={selectedPromptType}
            onSelect={onSend}
            onClose={() => setSelectedPromptType(null)}
          />
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-travel-900">
              Smart Travel Assistant
            </h1>
          </div>
          <ChatHistory messages={messages} isLoading={isLoading} />
          <ChatInput onSend={onSend} disabled={isLoading} />
        </>
      )}
    </div>
  </div>
);
