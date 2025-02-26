"use client";
import { useState, useEffect, useRef } from "react";
import { Map, Building2, MapPin, Landmark, Calendar } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { sanitizeHTML } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PreviewSection } from "@/components/PreviewSection";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { TravelComponent } from "@/types/chat";
import {
  PROMPT_SUGGESTIONS,
  actionButtons,
  PromptKey,
} from "@/constants/travelPrompts";
import gsap from "gsap";
import { animateIn, animateOut } from "@/lib/animations";

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setComponents] = useState<TravelComponent[]>([]);
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(
    <div className="text-center text-gray-500">
      <LoadingSkeleton />
    </div>
  );
  const [logs] = useState<string[]>([]);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  // Store the first component's key and the reward value
  const [componentKey, setComponentKey] = useState<string | null>(null);
  const [reward, setReward] = useState<number>(0);

  // Add new state for input text
  const [inputText, setInputText] = useState("");

  // Update state type declaration
  const [selectedPromptType, setSelectedPromptType] =
    useState<PromptKey | null>(null);

  // Add state to track the last user query
  const [lastUserQuery, setLastUserQuery] = useState<string>("");

  const { toast } = useToast();

  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Add ref for suggestions container
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedPromptType &&
        suggestionsContainerRef.current &&
        !suggestionsContainerRef.current.contains(event.target as Node)
      ) {
        animateOut(suggestionsContainerRef.current, () => {
          setSelectedPromptType(null);
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedPromptType]);

  useEffect(() => {
    if (selectedPromptType && suggestionsContainerRef.current) {
      animateIn(suggestionsContainerRef.current);
    }
  }, [selectedPromptType]);

  // Updated handleSendMessage uses EventSource for streaming single component objects
  const handleSendMessage = (message: string) => {
    setLastUserQuery(message); // Store the user's query
    // Clear input after sending
    setInputText("");
    // Add the user's message to the chat history.
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setIsLoading(true);
    setComponents([]);
    setPreviewContent(
      <div className="text-center text-gray-500">
        <div className="m-12">
          <LoadingSkeleton />
        </div>
      </div>
    );

    // Create an EventSource using the streaming endpoint with the query parameter.
    const url = `http://localhost:8000/travel/stream-travel-assistant?user_query=${encodeURIComponent(
      message
    )}`;
    const eventSource = new EventSource(url, {
      withCredentials: true,
    });

    // Add explicit error handler
    eventSource.addEventListener("error", (err) => {
      console.error("EventSource failed:", err);
      setIsLoading(false);
      eventSource.close();
      toast({
        title: "Connection Error",
        description: "Failed to connect to the travel assistant",
        variant: "destructive",
      });
    });

    eventSource.onopen = () => {
      console.log("EventSource connection opened.");
    };

    eventSource.onmessage = (event) => {
      try {
        if (event.data === "[DONE]") {
          setIsLoading(false);
          eventSource.close();
          return;
        }

        // Try parsing the data
        let newComponent: TravelComponent;
        try {
          newComponent = JSON.parse(event.data) as TravelComponent;
        } catch (error) {
          console.error("Failed to parse event data:", event.data, error);
          return; // Skip this message
        }

        // Proceed with updating the state
        setComponents((prev: TravelComponent[]) => {
          const updatedComponents = [...prev, newComponent];

          // Set component key if it's the first component
          if (!componentKey && updatedComponents.length > 0) {
            setComponentKey(updatedComponents[0].component_key);
          }

          setPreviewContent(
            <div className="space-y-8 flex-row justify-center">
              {updatedComponents.map(
                (component: TravelComponent, index: number) => (
                  <div
                    key={`${component.component_key}-${index}`}
                    className=" flex justify-center items-center"
                  >
                    <div
                      dangerouslySetInnerHTML={sanitizeHTML(component.html)}
                    />
                    {component.css && <style>{component.css}</style>}
                  </div>
                )
              )}
            </div>
          );
          return updatedComponents;
        });
      } catch (error: unknown) {
        console.error("Error handling SSE message:", error);
      }
    };

    // Optionally, you can close the connection when done.
  };

  // Handle submitting the reward
  const handleRewardSubmit = async () => {
    if (!componentKey) {
      toast({
        title: "No component key",
        description: "Generate a travel plan first before submitting a reward.",
        variant: "destructive",
      });
      return;
    }

    if (!lastUserQuery) {
      toast({
        title: "Missing user query",
        description: "No user query found to submit with reward.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/reward/update", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          component_key: componentKey,
          reward: reward,
          user_query: lastUserQuery, // Add the user query to the request
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server response:", errorData);
        throw new Error(
          `Failed to submit reward: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Reward submission successful:", data);

      toast({
        title: "Success",
        description: "Reward submitted successfully!",
      });
    } catch (error) {
      console.error("Reward submission error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit reward",
        variant: "destructive",
      });
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen justify-center bg-gray-50">
      {/* Chat Section */}
      <div
        className={`transition-all duration-300 ease-in-out bg-white ${
          isPreviewExpanded
            ? "hidden"
            : hasMessages
            ? "w-[32%] border-r border-gray-200"
            : "w-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {!hasMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <h1 className="text-4xl font-bold mb-4">
                Smart Travel Assistant 🌴
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                Where would you like to go?
              </p>

              {/* Fixed position container for ChatInput */}
              <div className="w-full max-w-2xl mb-5 relative z-10">
                <ChatInput
                  onSend={() => handleSendMessage(inputText)}
                  disabled={isLoading}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              {/* Updated suggestions and buttons container */}
              <div className="relative w-full max-w-2xl">
                <div className="flex flex-wrap justify-center gap-4">
                  {!selectedPromptType &&
                    actionButtons.map((button, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputText(button.label);
                          setSelectedPromptType((prev) =>
                            prev === button.promptKey
                              ? null
                              : (button.promptKey as PromptKey)
                          );
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <button.icon className="w-5 h-5 text-travel-600" />
                        <span className="text-sm">{button.label}</span>
                      </button>
                    ))}
                </div>

                {selectedPromptType && (
                  <div
                    ref={suggestionsContainerRef}
                    className="absolute top-[-3] left-0 w-[full] bg-white rounded-lg shadow-lg border border-gray-200 mt-2"
                  >
                    <div className="py-1">
                      {PROMPT_SUGGESTIONS[selectedPromptType as PromptKey]?.map(
                        (prompt, index) => {
                          // Find the corresponding button for the selected prompt type
                          const currentButton = actionButtons.find(
                            (btn) => btn.promptKey === selectedPromptType
                          );

                          return (
                            <button
                              key={index}
                              onClick={() => {
                                const fullPrompt = `${currentButton?.label} ${prompt}`;
                                handleSendMessage(fullPrompt);
                                setSelectedPromptType(null);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                            >
                              <span className="text-gray-400 text-sm">
                                {currentButton?.label}
                              </span>
                              <span className="text-gray-900 text-sm">
                                {prompt}
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-travel-900">
                  Smart Travel Assistant
                </h1>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {messages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg.text}
                    isUser={msg.isUser}
                  />
                ))}
                {isLoading && <LoadingSpinner />}
              </div>
              <ChatInput
                onSend={() => handleSendMessage(inputText)}
                disabled={isLoading}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {hasMessages && !isPreviewExpanded && (
        <div className="flex-1 p-4 animate-fade-in ">
          <PreviewSection
            content={previewContent}
            logs={logs}
            onToggleFullscreen={() => setIsPreviewExpanded(true)}
          />

          {/* Reward Range Slider and Submit Button */}
          <div className="mt-4 p-4 border rounded bg-white shadow-sm">
            <label htmlFor="reward-range" className="font-semibold mr-2">
              Reward (0 - 1.0): <span>{reward}</span>
            </label>
            <input
              id="reward-range"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={reward}
              onChange={(e) => setReward(parseFloat(e.target.value))}
              className="mx-4"
            />
            <button
              onClick={handleRewardSubmit}
              className="bg-travel-600 text-white px-4 py-2 rounded hover:bg-travel-700"
            >
              Submit Reward
            </button>
          </div>
        </div>
      )}

      {/* Expanded Preview */}
      {isPreviewExpanded && (
        <div className="w-full animate-fade-in">
          <PreviewSection
            content={previewContent}
            logs={logs}
            onToggleFullscreen={() => setIsPreviewExpanded(false)}
          />

          {/* Reward Range Slider and Submit Button for Expanded View */}
          <div className="mt-4 p-4 border rounded bg-white shadow-sm">
            <label
              htmlFor="reward-range-expanded"
              className="font-semibold mr-2"
            >
              Reward (0 - 1.0): <span>{reward}</span>
            </label>
            <input
              id="reward-range-expanded"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={reward}
              onChange={(e) => setReward(parseFloat(e.target.value))}
              className="mx-4"
            />
            <button
              onClick={handleRewardSubmit}
              className="bg-travel-600 text-white px-4 py-2 rounded hover:bg-travel-700"
            >
              Submit Reward
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
