"use client";
import { useState, useRef } from "react";

interface TravelComponent {
  component_key: string;
  variant: string;
  html: string;
  data: string;
  available_variants?: string[]; // Make optional
}

export default function Test() {
  const [query, setQuery] = useState("");
  const [components, setComponents] = useState<TravelComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setComponents([]);

    eventSourceRef.current = new EventSource(
      `http://localhost:8000/travel/stream-travel-assistant?user_query=${encodeURIComponent(
        query
      )}`
    );

 

    eventSourceRef.current.onmessage = (event) => {
      if (event.data === "[DONE]") {
        setIsLoading(false);
        eventSourceRef.current?.close();
        return;
      }

      const componentData = JSON.parse(event.data);
      setComponents((prev) => [...prev, componentData]);
    };

    eventSourceRef.current.onerror = () => {
      setIsLoading(false);
      eventSourceRef.current?.close();
    };
  };

  const handleFeedback = async (
    component: TravelComponent,
    isPositive: boolean
  ) => {
    await fetch("http://localhost:8000/travel/component-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        component_key: component.component_key,
        variant: component.variant,
        is_positive: isPositive,
        user_query: query,
      }),
    });
  };

  const switchVariant = async (component: TravelComponent) => {
    const response = await fetch("/api/get-alternative-variant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        component_key: component.component_key,
        previous_variant: component.variant,
        user_query: query,
        original_data: component.data,
      }),
    });

    const newVariant = await response.json();
    setComponents((prev) =>
      prev.map((comp) =>
        comp.component_key === component.component_key ? newVariant : comp
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter travel request..."
          className="w-full p-4 border rounded-lg mb-4"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Get Recommendations"}
        </button>
      </form>

      <div className="space-y-6">
        {components?.map((component, index) => (
          <div key={index} className="border rounded-lg p-4 relative">
            {/* Feedback buttons */}
            <div className="absolute top-2 right-2 space-x-2">
              <button
                onClick={() => handleFeedback(component, true)}
                className="text-green-500 hover:text-green-700"
              >
                👍
              </button>
              <button
                onClick={() => handleFeedback(component, false)}
                className="text-red-500 hover:text-red-700"
              >
                👎
              </button>
            </div>

            {/* Variant selector with null checks */}
            {component.available_variants &&
              component.available_variants.length > 1 && (
                <div className="mb-4 space-x-2">
                  {component.available_variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => switchVariant(component)}
                      className={`px-3 py-1 rounded ${
                        component.variant === variant
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              )}

            {/* Safe HTML rendering */}
            {component.html && (
              <div
                dangerouslySetInnerHTML={{ __html: component.html }}
                className="component-wrapper"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
