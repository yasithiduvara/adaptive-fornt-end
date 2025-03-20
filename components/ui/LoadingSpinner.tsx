"use client";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export const LoadingSpinner = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const messageDurations = [10000, 20000, 30000, 90000]; // 10s, 20s, 30s, 20s
    const timers: NodeJS.Timeout[] = [];

    if (currentMessage < messageDurations.length) {
      const timer = setTimeout(() => {
        setCurrentMessage((prev) => prev + 1);
      }, messageDurations[currentMessage]);
      timers.push(timer);
    }

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [currentMessage]);

  return (
    <div className="flex items-center justify-center mt-12">
      <div className=" text-m font-medium animate-pulse transition-opacity duration-1000 mr-5">
        {currentMessage === 0 && <p>Please wait</p>}

        {currentMessage === 1 && <p>Gathering information</p>}

        {currentMessage === 2 && <p>Selecting components</p>}

        {currentMessage === 3 && <p>Almost done</p>}
      </div>
      <Loader2 className="h-6 w-6 animate-spin text-travel-600 " />
    </div>
  );
};
