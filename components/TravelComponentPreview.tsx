"use client";
import { useState } from "react";
import { TravelComponent } from "@/types/chat";
import { sanitizeHTML } from "@/lib/utils";
import { Button } from "./ui/button";

/**
 * A small component that displays one TravelComponent,
 * defaulting to "html_1" and toggling to "html_2" on button click.
 */
export function TravelComponentPreview({ component }: { component: TravelComponent }) {
  // By default, we show "html_1"
  const [activeVariant, setActiveVariant] = useState<keyof TravelComponent["html_variants"]>("html_1");

  // Simple toggle function: if we have only two variants "html_1" & "html_2"
  const handleToggle = () => {
    setActiveVariant((prev) => (prev === "html_1" ? "html_2" : "html_1"));
  };

  return (
    <div className="mb-8 border p-4">
      {/* Title / Description */}
      <div className="p-3">
       <div className=" flex justify-between items-center">
       <h2 className="text-4xl font-bold">{component.component_key}</h2>
       <Button variant="outline" onClick={handleToggle}> Change the UI</Button>
       </div>
        <p className="text-gray-500 text-xs px-4 pt-2">
          {component.description}
        </p>
      </div>


      {/* Render the active variant’s HTML */}
      <div dangerouslySetInnerHTML={sanitizeHTML(component.html_variants[activeVariant])} />

      {/* If your component includes CSS for these variants, you can still apply it: */}
      {component.css && <style>{component.css}</style>}
    </div>
  );
}
