"use client";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Mic, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChatInputProps } from "@/types/chat";

export const ChatInput = ({
  onSend,
  disabled,
  placeholder = "e.g. I'm interested in planning a beach vacation in Mirissa...",
  value,
  onChange,
}: ChatInputProps) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSend(value);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 p-4 border-t border-gray-100"
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        disabled={disabled}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-gray-50"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        disabled={disabled}
      >
        <Mic className="h-4 w-4" />
      </Button>
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !value.trim()}
        className="bg-travel-600 hover:bg-travel-700 text-white"
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
};
