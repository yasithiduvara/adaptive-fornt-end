import { Map, Building2, MapPin, Landmark } from "lucide-react";

export const PROMPT_SUGGESTIONS = {
  "Explore places": [
    "that inspire creativity and fuel your imagination",
    "off the beaten path for hidden gems and unforgettable experiences",
  ],
  "Suggest Hotels": [
    "Japan beachside",
    "Unawatuna beach and also provide me some imeges of the beach side and activities to do in beach",
    "budget friendly in Sri Lanka",
  ],
  Itineraries: [
    "for a budget-friendly adventure",
    "for a family-friendly holiday",
    "for a romantic getaway",
  ],
  "Things to Do": [
    "in Sri Lanka",
    "in Unawatuna Beach",
    "in Dubai",
  ],
} as const;

export type PromptKey = keyof typeof PROMPT_SUGGESTIONS;

export const actionButtons = [
  { icon: Map, label: "Explore places", promptKey: "Explore places" },
  { icon: Building2, label: "Suggest Hotels", promptKey: "Suggest Hotels" },
  { icon: MapPin, label: "Itineraries", promptKey: "Itineraries" },
  { icon: Landmark, label: "Things to Do", promptKey: "Things to Do" },
] as const; 