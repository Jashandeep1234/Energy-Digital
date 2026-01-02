"use client";

import React from "react";
import { Cpu, Zap, ShieldCheck, Database } from "lucide-react";
import { GlassPanel, Slider, Switch, Button } from "@/components/ui/Core";

export function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-3xl font-black tracking-tighter uppercase">
        System_<span className="text-blue-500">Config</span>
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassPanel title="Parameters" className="lg:col-span-2 p-8 space-y-8">
          {[
            { label: "AI Aggression", icon: Cpu },
            { label: "Grid Sensitivity", icon: Zap },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <item.icon className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-black uppercase tracking-widest">
                  {item.label}
                </span>
              </div>
              <Slider defaultValue={[50]} className="w-48" />
            </div>
          ))}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-black uppercase tracking-widest">
                Autonomous Failover
              </span>
            </div>
            <Switch defaultChecked />
          </div>
        </GlassPanel>
        <GlassPanel title="Infrastructure" className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Database className="h-6 w-6 text-blue-400" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest">
                Database Sync
              </p>
              <span className="text-[9px] font-mono text-green-500 uppercase">
                Latency: 12ms
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full text-[10px] font-black uppercase">
            Force Re-Sync
          </Button>
        </GlassPanel>
      </div>
    </div>
  );
}
