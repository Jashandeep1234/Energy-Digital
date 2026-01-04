"use client";

import React, { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { Brain, Loader2 } from "lucide-react";
import { GlassPanel, Button, Progress, HUDMiniBadge, Badge } from "@/components/ui/Core";
import { motion } from "framer-motion";

// --- Views Enhancements ---
export function AnalyticsView({ data }: any) {
  const radarData = useMemo(() => 
    !data ? [] : Object.entries(data).slice(0, 6).map(([key, val]: any) => ({
      subject: key.replace('_', ' '),
      A: val.current || 0,
      fullMark: 1000
    })), [data]);

const aggregateHistory = useMemo(() => {
if (!data) return [];

// Find the first building with history to use as a baseline for timestamps
  const baseBuilding = Object.values(data).find((b: any) => b?.history?.length > 0) as any;
  if (!baseBuilding) return [];
  
  return baseBuilding.history.map((h: any, i: number) => {
let totalConsumption = 0;
Object.entries(data).forEach(([key, b]: [string, any]) => {
if (key !== "solar_farm" && key !== "wind_turbine" && b?.history?.[i]) {
      totalConsumption += (b.history[i].value || 0);
    }
  });

  return {
time: h.timestamp,
consumption: totalConsumption,
production: (data.solar_farm?.history?.[i]?.value || 0) + (data.wind_turbine?.history?.[i]?.value || 0)
};
});
}, [data]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 mb-4">Historical Intelligence</h2>
          <h3 className="text-6xl font-black tracking-tightest uppercase">Analytics_<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Hub</span></h3>
        </div>
        <div className="flex gap-4">
           <HUDMiniBadge label="Sample Rate" value="5s" color="text-cyan-400" />
           <HUDMiniBadge label="Grid Nodes" value="12" color="text-blue-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <GlassPanel title="Grid Balance Topology" className="lg:col-span-2" accentColor="cyan">
          <div className="h-[450px] w-full mt-4 min-h-[100px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={aggregateHistory} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#ffffff20" fontSize={10} fontVariant="mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '16px' }} 
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area name="Consumption" type="monotone" dataKey="consumption" stroke="#06b6d4" fill="url(#colorCons)" strokeWidth={4} />
                <Area name="Production" type="monotone" dataKey="production" stroke="#10b981" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
        
        <GlassPanel title="Sector Load Distribution" accentColor="purple">
          <div className="h-[450px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="subject" stroke="#ffffff40" fontSize={9} fontVariant="black" />
                <Radar name="Load" dataKey="A" stroke="#d946ef" fill="#d946ef" fillOpacity={0.4} strokeWidth={3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

export function InfrastructureView({ data, onBuildingClick }: any) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
       <div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-4">Node Management</h2>
        <h3 className="text-6xl font-black tracking-tightest uppercase">Sector_<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Infrastructure</span></h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {Object.entries(data || {}).map(([key, sector]: any) => {
          const load = Math.min((sector.current / 1000) * 100, 100);
          const isHigh = load > 80;
          return (
            <GlassPanel key={key} className="group" accentColor={isHigh ? "purple" : "cyan"}>
              <div className="flex justify-between items-start mb-10">
                <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-white transition-colors">{key.replace('_', ' ')}</h3>
                <Badge className={isHigh ? "bg-red-500/10 text-red-400" : "bg-cyan-500/10 text-cyan-400"}>
                  {isHigh ? "High Stress" : "Stable"}
                </Badge>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Draw</span>
                  <span className="text-2xl font-black font-mono tracking-tighter">{sector.current} <span className="text-xs font-sans text-white/40">kW</span></span>
                </div>
                
                <div className="relative pt-4">
                  <Progress 
                    value={load} 
                    className="h-2 bg-white/5" 
                    color={isHigh ? "bg-fuchsia-500" : "bg-cyan-500"} 
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[8px] font-black text-white/10 uppercase">Efficiency: 94%</span>
                    <span className="text-[8px] font-black text-white/10 uppercase">Load: {Math.round(load)}%</span>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="cyber" 
                onClick={() => onBuildingClick(key.replace('_', ' '), sector.current)} 
                className="w-full mt-10 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-cyan-500 group-hover:text-black transition-all"
              >
                Synthesize Advice
              </Button>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}

export function InsightsView({ report, isGenerating, onGenerate }: any) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-fuchsia-500 mb-4">Neural Synthesis</h2>
        <h3 className="text-6xl font-black tracking-tightest uppercase">Neural_<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-500">Insights</span></h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <GlassPanel title="Intelligence Control" accentColor="purple" className="lg:col-span-1">
          <div className="relative mb-12 flex justify-center">
             <div className="absolute inset-0 bg-fuchsia-500/20 blur-3xl rounded-full" />
             <Brain className="relative h-20 w-20 text-fuchsia-500" />
          </div>
          <p className="text-[11px] text-white/40 font-medium leading-relaxed mb-12 text-center uppercase tracking-[0.2em]">
            Execute deep-packet neural analysis on global grid distribution.
          </p>
          <Button 
            onClick={onGenerate} 
            disabled={isGenerating} 
            className="w-full h-20 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(217,70,239,0.3)]"
          >
            {isGenerating ? <Loader2 className="animate-spin h-6 w-6" /> : "Initiate Synthesis"}
          </Button>
        </GlassPanel>

        <div className="lg:col-span-3">
          <GlassPanel className="min-h-[600px] border-fuchsia-500/20 relative group" accentColor="purple">
            <div className="absolute top-6 right-8">
               <Badge className="bg-fuchsia-500/10 text-fuchsia-400">v4_Neural_Output</Badge>
            </div>
              <div className="text-sm font-medium text-white/70 whitespace-pre-wrap leading-loose font-mono pt-12">
                {report ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    {typeof report === 'string' ? report : JSON.stringify(report, null, 2)}
                  </motion.div>
                ) : (
                <div className="flex flex-col items-center justify-center h-[500px] gap-6 text-white/20">
                   <div className="animate-pulse flex flex-col items-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em]">System Standby</p>
                      <p className="text-[8px] font-mono mt-2 uppercase">Neural Pipeline Empty</p>
                   </div>
                </div>
              )}
            </div>
            

          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
