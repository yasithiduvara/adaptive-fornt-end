import { Map, Building2, MapPin, Landmark } from "lucide-react";

export const PROMPT_SUGGESTIONS = {
  "Explore places": [
    "Explore places that inspire creativity and fuel your imagination",
    "Explore places off the beaten path for hidden gems and unforgettable experiences",
    "Explore places where history meets modern charm, creating a perfect blend of past and present",
  ],
  "Suggest Hotels": [
    "Suggest Hotels Japan beachside",
    "Suggest Hotels Unawatuna",
    "Suggest Hotels budget friendly in Sri Lanka",
  ],
  Itineraries: [
    "Show me itinerary for a budget-friendly adventure",
    "Show me itinerary for a family-friendly holiday",
    "Show me itinerary for a romantic getaway",
  ],
  "Things to Do": [
    "Things to Do in Sri Lanka",
    "Things to Do in Unawatuna Beach",
    "Things to Do in Dubai",
  ],
} as const;

export type PromptKey = keyof typeof PROMPT_SUGGESTIONS;

export const actionButtons = [
  { icon: Map, label: "Explore places", promptKey: "Explore places" },
  { icon: Building2, label: "Suggest Hotels", promptKey: "Suggest Hotels" },
  { icon: MapPin, label: "Itineraries", promptKey: "Itineraries" },
  { icon: Landmark, label: "Things to Do", promptKey: "Things to Do" },
] as const; 