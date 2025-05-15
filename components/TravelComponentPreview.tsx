"use client";
import { useState } from "react";
import { TravelComponent } from "@/types/chat";
import { sanitizeHTML } from "@/lib/utils";
import { Button } from "./ui/button";

export function TravelComponentPreview({
  component,
}: {
  component: TravelComponent;
}) {
  // Show any section‑level error the backend sent
  if (component.error) {
    return (
      <div className="mb-8 border p-4 rounded">
        <h2 className="text-xl font-bold text-red-600">
          {component.section_key}
        </h2>
        <p className="text-red-500">{component.error}</p>
      </div>
    );
  }

  return (
    <div className="mb-8 border p-4 rounded">
      <h2 className="text-2xl font-bold mb-4">{component.section_key}</h2>

      {/* The snippet already includes its own <style> tag. */}
      {/* sanitizeHTML returns { __html: string } */}
      <div dangerouslySetInnerHTML={sanitizeHTML(component.html)} />
    </div>
  );
}