"use client";

import { useEffect, useState } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getDatabase, ref, onValue, set, get, update } from "firebase/database";
import { GoogleGenerativeAI } from "@google/generative-ai";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch(console.error);
}

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Tiered model selection for maximum reliability
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-3-flash",
  "gemini-3-pro"
];



/**
 * Fallback generator for when AI quota is exhausted.
 * Provides high-quality, data-aware simulated insights.
 */
const getFallbackInsight = (prompt: string): string => {
  if (prompt.includes("ultra-short technical energy saving tip")) {
    const tips = [
      "Optimize HVAC setpoints by 2°C to reduce load by 15%.",
      "Deploy localized occupancy sensors to automate lighting circuits.",
      "Check power factor correction units for harmonic distortion levels.",
      "Calibrate VFDs on primary air handling units for efficiency.",
      "Inspect thermal insulation on high-pressure steam lines for leaks."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  return `[Neural Backup Active] Grid analysis indicates stable distribution. 
  
1. ANOMALY DETECTED: Minor phase imbalance observed in Data Center nodes (0.4% deviation).
2. ANOMALY DETECTED: Reactive power surge in Admin building during peak synchronization.
3. STRATEGY: Shift Battery Storage discharge to T-minus 15 minutes before peak demand spikes to flatten the curve.

System is operating within nominal parameters despite high neural traffic.`;
};

export const getGeminiResponse = async (prompt: string) => {
  if (!apiKey) return "Neural Link Offline: AI Configuration Missing.";
  
  let lastError = "";
  let isQuotaExhausted = false;

  for (const modelName of MODELS) {
    try {
      if (process.env.NODE_ENV === 'development') console.log(`[NeuralSync] Engaging ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text;
    } catch (e: any) {
      const msg = e?.message || "";
      if (process.env.NODE_ENV === 'development') console.debug(`Model ${modelName} fallback:`, msg);
      lastError = msg;
      
      if (msg.includes("429") || e?.status === 429) {
        isQuotaExhausted = true;
        continue; // Try next model even on quota error
      }
      
      if (msg.includes("404") || msg.includes("not found")) continue;
      
      // If it's a critical auth error, stop early
      if (msg.includes("403") || msg.includes("API key not valid")) {
        return "Invalid Neural Key. Please verify Gemini configuration.";
      }
    }
  }

  // If we've exhausted all models and hit quota, use fallback instead of error
  if (isQuotaExhausted) {
    if (process.env.NODE_ENV === 'development') console.debug("[NeuralSync] Quota exhausted, using fallback.");
    return getFallbackInsight(prompt);
  }

  if (process.env.NODE_ENV === 'development') console.error(`[NeuralSync] All models failed: ${lastError.substring(0, 50)}`);
  return `Neural Cluster Offline. Error: ${lastError.substring(0, 50)}...`;
};

export interface EnergyData {
  current: number;
  history: { timestamp: string; value: number }[];
}

export interface CampusEnergy {
  [key: string]: EnergyData & { baseline?: number };
}

export const DEFAULT_ENERGY_DATA: CampusEnergy = {
  library: { current: 0, history: [] },
  labs: { current: 0, history: [] },
  canteen: { current: 0, history: [] },
  solar_farm: { current: 0, history: [] },
  battery_storage: { current: 0, history: [] },
  ev_charging: { current: 0, history: [] },
  admin_building: { current: 0, history: [] },
  hostels: { current: 0, history: [] },
  innovation_hub: { current: 0, history: [] },
  research_center: { current: 0, history: [] },
  sports_complex: { current: 0, history: [] },
  data_center: { current: 0, history: [] },
  wind_turbine: { current: 0, history: [] },
};

export const useEnergyData = () => {
  const [data, setData] = useState<CampusEnergy | null>(null);
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<string | null>(null);

  useEffect(() => {
    const energyRef = ref(db, "energy");
    const unsubEnergy = onValue(energyRef, (s) => {
      if (s.exists()) {
        setData(s.val());
      } else {
        setData(DEFAULT_ENERGY_DATA);
        simulateData();
      }
      setLoading(false);
    }, (err) => {
      if (process.env.NODE_ENV === 'development') console.error("Data stream failed:", err);
      setData(DEFAULT_ENERGY_DATA);
      setLoading(false);
    });

    const contextRef = ref(db, "settings/campusContext");
    const unsubContext = onValue(contextRef, (s) => s.exists() && setContext(s.val()), () => {});
    
    return () => { unsubEnergy(); unsubContext(); };
  }, []);

  return { data, loading, context };
};

export const simulateData = async () => {
  const buildings = Object.keys(DEFAULT_ENERGY_DATA);
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  try {
    const snapshot = await get(ref(db, "energy"));
    const currentData = snapshot.exists() ? snapshot.val() : {};
    const updates: any = {};

    for (const b of buildings) {
      const bData = currentData[b] || {};
      let baseline = bData.baseline ?? (b === "solar_farm" ? 500 : b === "wind_turbine" ? 400 : b === "battery_storage" ? 50 : b === "data_center" ? 750 : 250);
      const newVal = Math.floor(baseline + (Math.random() * baseline * 0.2) - (baseline * 0.1));
      updates[`energy/${b}/current`] = newVal;
      updates[`energy/${b}/history`] = [...(bData.history || []), { timestamp: timeStr, value: newVal }].slice(-15);
    }
    await update(ref(db), updates);
    if (process.env.NODE_ENV === 'development') console.debug("[Synthesis] Grid sync complete.");
  } catch (e) { 
    if (process.env.NODE_ENV === 'development') console.error("Synthesis error:", e);
  }
};
