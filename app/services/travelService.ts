import { TravelComponent } from "@/types/chat";

export const streamTravelComponents = async (userQuery: string, {
  onData,
  onDone,
  onError
}: {
  onData: (component: TravelComponent) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}) => {
  const url = `http://induvaray-w10vm.codegen.net:8000/travel/stream-travel-assistant?user_query=${encodeURIComponent(userQuery)}`;
  const eventSource = new EventSource(url, { withCredentials: true });

  eventSource.addEventListener("error", () => {
    onError(new Error('EventSource failed'));
    eventSource.close();
  });

  eventSource.onmessage = (event) => {
    try {
      if (event.data === "[DONE]") {
        onDone();
        eventSource.close();
        return;
      }

      const component = JSON.parse(event.data) as TravelComponent;
      onData(component);
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Failed to parse component'));
    }
  };

  return eventSource;
};

export const submitReward = async (componentKey: string, reward: number, userQuery: string) => {
  const response = await fetch("http://induvaray-w10vm.codegen.net:8000/reward/update", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      component_key: componentKey,
      reward: reward,
      user_query: userQuery,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Failed to submit reward');
  }

  return response.json();
}; 