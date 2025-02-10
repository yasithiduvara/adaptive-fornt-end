"use client";
import { useState } from "react";
import { Map, Building2, MapPin, Landmark, Calendar } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { sanitizeHTML } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PreviewSection } from "@/components/PreviewSection";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [components, setComponents] = useState<any[]>([]);
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(
    <div className="text-center text-gray-500">
      Your travel preview will appear here
    </div>
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  // Store the first component’s key and the reward value
  const [componentKey, setComponentKey] = useState<string | null>(null);
  const [reward, setReward] = useState<number>(0);

  const { toast } = useToast();

  // Updated handleSendMessage uses EventSource for streaming single component objects
  const handleSendMessage = (message: string) => {
    // Add the user's message to the chat history.
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setIsLoading(true);
    setComponents([]); // Clear previous components

    // Create an EventSource using the streaming endpoint with the query parameter.
    const url = `http://localhost:8000/stream-travel-assistant?user_query=${encodeURIComponent(
      message
    )}`;
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log("EventSource connection opened.");
    };

    eventSource.onmessage = (event) => {
      try {
        // Each SSE message is assumed to be a single component object.
        const newComponent = JSON.parse(event.data);

        // Append the new component to our state.
        setComponents((prev) => {
          const updatedComponents = [...prev, newComponent];
          // Update the preview content based on the updated components list.
          setPreviewContent(
            <div className="space-y-8 flex flex-wrap justify-center">
              {updatedComponents.map((component: any, index: number) => (
                <div
                  key={`${component.component_key}-${index}`}
                  className="flex flex-wrap justify-center bg-white p-6 rounded-lg shadow-md"
                >
                  <div
                    className="flex flex-wrap justify-center"
                    // Use sanitizeHTML to safely inject raw HTML.
                    dangerouslySetInnerHTML={sanitizeHTML(component.html)}
                  />
                  {component.css && <style>{component.css}</style>}
                </div>
              ))}
            </div>
          );
          return updatedComponents;
        });

        // Add an assistant message indicating the travel plan is ready if not already added.
        setMessages((prev) => {
          const alreadyAdded = prev.some(
            (msg) => !msg.isUser && msg.text.includes("customized travel plan")
          );
          if (!alreadyAdded) {
            return [
              ...prev,
              { text: "Here's your customized travel plan:", isUser: false },
            ];
          }
          return prev;
        });

        // Update logs with the new component info.
        setLogs((prev) => [
          ...prev,
          `Generated component: ${
            newComponent.component_key
          } (q: ${newComponent.q_value.toFixed(2)})`,
        ]);

        // Save the first component key (if not set) for reward submission.
        setComponentKey((prev) => prev || newComponent.component_key);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
      // Optionally, you might setIsLoading(false) if your backend signals the end of the stream.
    };

    eventSource.onerror = (err) => {
      console.error("EventSource error:", err);
      setIsLoading(false);
      eventSource.close();
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
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

    try {
      const response = await fetch("http://localhost:8000/reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          component_key: componentKey,
          reward: reward,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit reward");
      }

      toast({
        title: "Success",
        description: "Reward submitted successfully!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to submit reward",
        variant: "destructive",
      });
    }
  };

  const hasMessages = messages.length > 0;

  const actionButtons = [
    { icon: Map, label: "Explore places" },
    { icon: Building2, label: "Suggest Hotels" },
    { icon: MapPin, label: "Itineraries" },
    { icon: Landmark, label: "Things to Do" },
    { icon: Calendar, label: "My Bookings" },
  ];

  return (
    <div className="flex h-screen justify-center bg-gray-50">
      {/* Chat Section */}
      <div
        className={`transition-all duration-300 ease-in-out bg-white ${
          isPreviewExpanded
            ? "hidden"
            : hasMessages
            ? "w-1/3 border-r border-gray-200"
            : "w-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {!hasMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <h1 className="text-4xl font-bold mb-4">Hey There! 👋</h1>
              <p className="text-xl text-gray-600 mb-12">
                Where would you like to go?
              </p>
              <div className="w-full max-w-2xl mb-12">
                <ChatInput onSend={handleSendMessage} disabled={isLoading} />
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {actionButtons.map((button, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <button.icon className="w-5 h-5 text-travel-600" />
                    <span className="text-sm">{button.label}</span>
                  </button>
                ))}
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
              <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {hasMessages && !isPreviewExpanded && (
        <div className="flex-1 p-4 animate-fade-in">
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
