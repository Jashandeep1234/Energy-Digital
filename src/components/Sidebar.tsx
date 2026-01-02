"use client";

import React from "react";
import { LayoutDashboard, BarChart3, Building2, BrainCircuit, Settings, LogOut, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/Utils";

// --- Sidebar Enhancements ---
export function Sidebar({ activeTab, onTabChange, onLogout }: any) {
  return (
    <div className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-10 bg-black/40 border-r border-white/5 backdrop-blur-3xl z-[100] group transition-all duration-700 ease-[0.16, 1, 0.3, 1] hover:w-72 overflow-hidden shadow-[30px_0_60px_rgba(0,0,0,0.5)]">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="mb-16 relative flex items-center w-full px-6">
        <div className="flex h-10 min-w-[40px] items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] relative z-10">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div className="ml-6 flex flex-col opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 whitespace-nowrap overflow-hidden">
          <span className="font-black tracking-tightest text-2xl leading-none">
            NEXUS<span className="text-cyan-400">TWIN</span>
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mt-1">v2.5.0_PRO_CORE</span>
        </div>
      </div>

      <nav className="flex-1 w-full space-y-3 px-4 relative z-10">
        {[
          { id: "overview", label: "Overview", icon: LayoutDashboard, color: "text-cyan-400" },
          { id: "analytics", label: "Analytics Hub", icon: BarChart3, color: "text-blue-400" },
          { id: "infrastructure", label: "Infrastructure", icon: Building2, color: "text-emerald-400" },
          { id: "ai-insights", label: "Neural Insights", icon: BrainCircuit, color: "text-fuchsia-400" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "relative flex items-center w-full h-14 rounded-2xl transition-all duration-300 group/btn",
              activeTab === item.id 
                ? "bg-white/[0.05] text-white shadow-[0_0_20px_rgba(255,255,255,0.02)]" 
                : "text-white/30 hover:text-white hover:bg-white/[0.03]"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1.5 h-8 bg-cyan-500 rounded-r-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
              />
            )}
            <div className="min-w-[48px] flex justify-center">
              <item.icon className={cn("h-6 w-6 transition-transform duration-300 group-hover/btn:scale-110", activeTab === item.id ? item.color : "")} />
            </div>
            <span className="ml-4 text-[11px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 whitespace-nowrap">
              {item.label}
            </span>
            
            {/* Hover Tooltip equivalent for collapsed state */}
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-black border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white opacity-0 pointer-events-none group-hover:group-hover/btn:opacity-0 group-hover/btn:opacity-100 transition-opacity hidden lg:block">
              {item.label}
            </div>
          </button>
        ))}
      </nav>

      <div className="w-full px-4 space-y-4 relative z-10">
        <button
          onClick={() => onTabChange("settings")}
          className={cn(
            "flex items-center w-full h-14 rounded-2xl transition-all duration-300",
            activeTab === "settings" ? "bg-white/5 text-white" : "text-white/30 hover:text-white hover:bg-white/[0.03]"
          )}
        >
          <div className="min-w-[48px] flex justify-center">
            <Settings className="h-6 w-6" />
          </div>
          <span className="ml-4 text-[11px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 whitespace-nowrap">
            Settings
          </span>
        </button>

        <div className="h-px bg-white/5 mx-2" />
        
        <button
          onClick={onLogout}
          className="flex items-center w-full h-14 rounded-2xl text-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group/logout"
        >
          <div className="min-w-[48px] flex justify-center">
            <LogOut className="h-6 w-6 transition-transform group-hover/logout:-translate-x-1" />
          </div>
          <span className="ml-4 text-[11px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 whitespace-nowrap">
            De-Sync Engine
          </span>
        </button>
      </div>
    </div>
  );
}
