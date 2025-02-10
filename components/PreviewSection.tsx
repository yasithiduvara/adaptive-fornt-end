"use client";
import React, { useState } from "react";
import { Maximize2, Minimize2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PreviewSectionProps } from "@/types/chat";

export const PreviewSection = ({
  content,
  logs,
  onToggleFullscreen,
}: PreviewSectionProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    onToggleFullscreen();
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg transition-all duration-300 h-full">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Terminal className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Backend Logs</DialogTitle>
            </DialogHeader>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg max-h-[60vh] overflow-auto">
              {logs.map((log, index) => (
                <pre key={index} className="text-sm">
                  {log}
                </pre>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="icon" onClick={handleFullscreenToggle}>
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="h-full overflow-auto">{content}</div>
    </div>
  );
};
