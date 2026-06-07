// SREContext.js
// Global React context that provides real-time SRE data to all screens
import React, { createContext, useContext } from "react";
import { useRealtimeData } from "../data/realtimeEngine";

const SREContext = createContext(null);

export function SREProvider({ children }) {
  const realtimeData = useRealtimeData(5000); // tick every 5 seconds
  return (
    <SREContext.Provider value={realtimeData}>{children}</SREContext.Provider>
  );
}

export function useSRE() {
  const ctx = useContext(SREContext);
  if (!ctx) {
    throw new Error("useSRE must be used within an <SREProvider>");
  }
  return ctx;
}
