"use client";
import { PromptKey } from "@/types/chat";

export const ActionButtons = ({
  buttons,
  onSelect,
}: {
  buttons: Array<{
    icon: React.ComponentType;
    label: string;
    promptKey: PromptKey;
  }>;
  onSelect: (button: {
    icon: React.ComponentType;
    label: string;
    promptKey: PromptKey;
  }) => void;
}) => (
  <div className="flex flex-wrap justify-center gap-4">
    {buttons.map((button, index) => (
      <button
        key={index}
        onClick={() => onSelect(button)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <button className="w-5 h-5 text-travel-600" />
        <span className="text-sm">{button.label}</span>
      </button>
    ))}
  </div>
);
