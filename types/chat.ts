export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
} 

export interface ChatMessageProps {
    message: string;
    isUser?: boolean;
    actions?: Array<{
      label: string;
      onClick: () => void;
    }>;
  }
export interface PreviewSectionProps {
  content: React.ReactNode;
  logs: string[];
  onToggleFullscreen: () => void;
  
  }


 