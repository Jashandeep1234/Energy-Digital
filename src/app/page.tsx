"use client";

import { useAuth } from "@/components/shared/AuthProvider";
import { Dashboard } from "@/components/features/Dashboard";
import { LandingPage } from "@/components/features/LandingPage";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex min-h-screen items-center justify-center bg-[#020202]"
        >
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
              <Zap className="relative h-12 sm:h-16 w-12 sm:w-16 text-blue-500 animate-bounce" />
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-black tracking-[0.5em] uppercase text-white">Synchronizing</p>
              <p className="text-[8px] sm:text-[10px] font-mono text-white/20 mt-2 uppercase tracking-widest">Neural Twin v2.5.0_PRO</p>
            </div>
          </div>
        </motion.div>
      ) : user ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-[#020202]"
        >
          <Dashboard />
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LandingPage />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
