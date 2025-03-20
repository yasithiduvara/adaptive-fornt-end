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
  reward,
  onRewardChange,
  onRewardSubmit,
  isFullscreen,
}: PreviewSectionProps) => {
  const handleFullscreenToggle = () => {
    onToggleFullscreen();
  };

  return (
    <div className="relative bg-[#F0F8FF] rounded-lg shadow-lg transition-all duration-300 h-full">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <div className="">⭐</div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <span className=" items-center">Love This UI ? </span>
              </DialogTitle>
            </DialogHeader>
            {/* Reward Section with Clickable Emojis */}
            <div className="flex flex-col justify-center mt-4 p-4 border-t border-gray-200 bg-white">
              <div className="flex flex-col w-full">
                <div className="flex items-center mb-4">
                  <label className="font-semibold text-gray-700 whitespace-nowrap mr-3">
                    Reward Value:{" "}
                    <span className="text-travel-600 font-bold">{reward}</span>
                  </label>
                  <span className="text-2xl ml-2">
                    {reward <= 0.2
                      ? "😢"
                      : reward <= 0.4
                      ? "😐"
                      : reward <= 0.6
                      ? "🙂"
                      : reward <= 0.8
                      ? "😊"
                      : "🤩"}
                  </span>
                </div>

                <div className="flex justify-between items-center w-full mb-4">
                  {[
                    { value: 0.0, emoji: "😢" },
                    { value: 0.25, emoji: "😐" },
                    { value: 0.5, emoji: "🙂" },
                    { value: 0.75, emoji: "😊" },
                    { value: 1.0, emoji: "🤩" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => onRewardChange(item.value)}
                      className={`text-3xl p-2 rounded-full transition-all duration-200 ${
                        reward === item.value
                          ? "bg-travel-100 transform scale-125"
                          : "hover:bg-gray-100"
                      }`}
                      aria-label={`Set reward to ${item.value}`}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={onRewardSubmit}
                className="bg-travel-600 text-white mt-2 py-2.5 rounded-md hover:bg-travel-700 transition-colors duration-200 font-medium"
              >
                <div className="flex justify-center items-center">
                  <span className="mr-2">Submit Reward</span>
                  <span className="text-lg">🎯</span>
                </div>
              </button>
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
