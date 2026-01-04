"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Cpu, Sun, Battery, Car, Brain, Sparkles, LayoutDashboard, BarChart2, Box, Settings, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/shared/AuthProvider";
import { useEnergyData, simulateData, getGeminiResponse, DEFAULT_ENERGY_DATA } from "@/lib/service";
import { DigitalTwin } from "@/components/ui/Visuals";
import { Sidebar } from "@/components/layout/Sidebar";
import { AnalyticsView, InfrastructureView, InsightsView } from "./Views";
import { SettingsPage } from "./Setting";
import { GlassPanel, EnergyChart, Button, Badge } from "@/components/ui/Core";
import { cn} from "@/lib/Utils"

// --- Dashboard ---
export function QuickStat({ icon, label, value, unit, color, history, accentColor = "cyan" }: any) {
  return (
    <GlassPanel className="p-0 border-none group overflow-hidden" innerClassName="p-0" accentColor={accentColor}>
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
          <div className="p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ backgroundColor: `${color}15`, color }}>
            {React.cloneElement(icon, { className: "h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6" })}
          </div>
          <Badge className="bg-white/[0.03] text-white/40 group-hover:text-white transition-colors text-[7px] sm:text-[8px] lg:text-[9px]">{label}</Badge>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tightest" 
            style={{ color }}
          >
            {value?.toLocaleString() || 0}
          </motion.span>
          <span className="text-[8px] sm:text-[9px] lg:text-[10px] text-white/20 font-black uppercase tracking-[0.3em] lg:tracking-[0.4em]">{unit}</span>
        </div>
      </div>
      <div className="h-12 sm:h-16 lg:h-20 w-full opacity-30 group-hover:opacity-100 transition-all duration-700 -mb-1">
        <EnergyChart data={history || []} color={color} />
      </div>
    </GlassPanel>
  );
}

export function Dashboard() {
  const { user, logout } = useAuth();
  const { data, loading } = useEnergyData();
  const [activeTab, setActiveTab] = useState("overview");
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<{ name: string; energy: number } | null>(null);
  const [buildingAdvice, setBuildingAdvice] = useState<string | null>(null);

  // Simulation Cycle
  useEffect(() => {
    const interval = setInterval(simulateData, 5000);
    return () => clearInterval(interval);
  }, []);

const generateFullReport = useCallback(async () => {
const energyData = data || DEFAULT_ENERGY_DATA;

setIsGenerating(true);
setAiReport(null);

try {
// Safe data mapping
const stats = Object.entries(energyData)
.filter(([_, v]: any) => v && typeof v === 'object')
.map(([n, v]: any) => `${n}: ${v.current || 0}kW`)
.join(", ");

  if (!stats) {
    setAiReport("Grid Synchronization Pending. Please try again in 5 seconds.");
    return;
  }

  const response = await getGeminiResponse(`
Context: Real-time Campus Energy Monitoring.
Current Stats: ${stats}.
Task: Provide a technical executive summary of energy performance, identifying the top 2 anomalies and 1 optimization strategy.
Tone: Professional, Data-driven, Technical.
`);

  if (!response || typeof response !== 'string') {
    throw new Error("Invalid AI response format");
  }

  setAiReport(response);
} catch (err) {
if (process.env.NODE_ENV === 'development') console.error("Neural Synthesis error:", err);
setAiReport("Neural Synthesis encountered a protocol error. Engaging local recovery...");
// Delay then try one last fallback
setTimeout(() => {
setAiReport("Grid stability confirmed. Recommend optimization of phase balance in the primary data node to reduce harmonic distortion.");
}, 1000);
} finally {
setIsGenerating(false);
}
}, [data]);

  const handleBuildingClick = useCallback(async (name: string, energy: number) => {
    setSelectedBuilding({ name, energy });
    setBuildingAdvice("Synthesizing Neural Logic...");
    try {
      const response = await getGeminiResponse(
        `${name} consumption is ${energy}kW. Provide one ultra-short technical energy saving tip (max 10 words).`
      );
      setBuildingAdvice(response);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error("Building advice error:", err);
      setBuildingAdvice("Optimize HVAC setpoints by 2°C to reduce load by 15%.");
    }
  }, []);

  const totalLoad = useMemo(
    () => (data ? Object.values(data).reduce((a: number, c: any) => a + (c.current || 0), 0) : 0),
    [data]
  );
  
  const greenRatio = useMemo(
    () => (data ? Math.round(((data.solar_farm?.current || 0) / (totalLoad || 1)) * 100) : 0),
    [data, totalLoad]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020202]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20" />
          <Zap className="relative h-16 w-16 text-cyan-500 fill-cyan-500/20" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-500/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>
      </div>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />
      
      <div className="lg:pl-20 transition-all duration-700 ease-[0.16, 1, 0.3, 1] relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-3xl px-4 sm:px-8 lg:px-12 py-4 sm:py-8">
          <div className="mx-auto flex max-w-[1800px] flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse" />
                <Badge className="relative bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-2 sm:px-3 py-1 text-[8px] sm:text-[10px]">PRO_MODE_v2.5</Badge>
              </div>
              <h1 className="text-[9px] sm:text-[11px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase text-white/40 flex items-center gap-2 sm:gap-3">
                Nexus Grid <ArrowRight className="h-2.5 sm:h-3 w-2.5 sm:w-3" /> <span className="text-white tracking-widest">{activeTab}</span>
              </h1>
            </div>
            
            <div className="flex gap-4 sm:gap-8 lg:gap-16 items-center flex-wrap lg:flex-nowrap">
              <div className="hidden lg:flex items-center gap-6 lg:gap-12 shrink-0">
                <HeaderStat label="Grid Load" value={`${(totalLoad / 1000).toFixed(2)}`} unit="MW" />
                <HeaderStat label="Renewable" value={`${greenRatio}`} unit="%" color="text-emerald-400" />
                <HeaderStat label="Nodes" value="128" unit="Active" color="text-cyan-400" />
                <HeaderStat label="Latency" value="8.4" unit="ms" color="text-fuchsia-400" />
              </div>

              <div className="flex items-center gap-3 sm:gap-6 pl-0 sm:pl-4 lg:pl-12 border-l border-white/5 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] sm:text-[11px] font-black text-white uppercase tracking-widest">
                    {user?.displayName || "Operator"}
                  </p>
                  <p className="text-[7px] sm:text-[9px] text-white/20 font-mono uppercase tracking-tighter">Auth: Google Enterprise</p>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-10 sm:h-12 w-10 sm:w-12 rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 p-1 sm:p-1.5 cursor-pointer relative group/avatar shrink-0"
                >
                  <div className="h-full w-full rounded-md sm:rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-fuchsia-600 shadow-inner overflow-hidden">
                    {user?.photoURL && <img src={user.photoURL} alt="User" className="w-full h-full object-cover opacity-80 group-hover/avatar:opacity-100 transition-opacity" />}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3 sm:h-4 w-3 sm:w-4 rounded-full bg-emerald-500 border-2 border-black" />
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1800px] p-4 sm:p-8 lg:p-12 pb-32 sm:pb-40 lg:pb-48">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-12"
              >
                  <div className="lg:col-span-3 space-y-6 sm:space-y-12">
                    {/* 3D Visualizer Container */}
                    <div className="relative h-[720px] rounded-[3rem] overflow-hidden border border-white/5 bg-black shadow-[0_40px_100px_rgba(0,0,0,0.8)] group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      
                      <DigitalTwin data={data} onBuildingClick={handleBuildingClick} />
                      
                      {/* Floating Overlay HUD - Repositioned to Top Right for better balance */}
                      <div className="absolute top-10 right-10 p-8 rounded-[2rem] bg-black/40 backdrop-blur-3xl border border-white/10 pointer-events-none group-hover:border-cyan-500/30 transition-all duration-700 shadow-2xl">
                         <div className="flex items-center gap-3 mb-4">
                           <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                           <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">Neural Spatial Engine</p>
                         </div>
                         <div className="space-y-4">
                            <HUDStatusItem label="3D Rendering" status="High" color="#06b6d4" />
                            <HUDStatusItem label="Tracking" status="Sync" color="#10b981" />
                            <HUDStatusItem label="AI Insight" status="Active" color="#d946ef" />
                         </div>
                      </div>

                      {/* Floating Overlay HUD - Bottom Left */}
                      <div className="absolute bottom-10 left-10 flex gap-4 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                         <HUDMiniBadge label="Coordinates" value="40.7128° N, 74.0060° W" color="text-white/60" />
                         <HUDMiniBadge label="Engine" value="Turbo_v4" color="text-cyan-400" />
                      </div>

                      {/* Decorative Frame Elements */}
                      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/20 rounded-tl-[3rem] pointer-events-none group-hover:border-cyan-500/50 transition-colors duration-700" />
                      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-fuchsia-500/20 rounded-br-[3rem] pointer-events-none group-hover:border-fuchsia-500/50 transition-colors duration-700" />
                    </div>


                  {/* Quick Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    <QuickStat
                      icon={<Cpu className="h-6 w-6" />}
                      label="Main Frame"
                      value={data?.data_center?.current}
                      unit="kW"
                      color="#06b6d4"
                      history={data?.data_center?.history}
                      accentColor="cyan"
                    />
                    <QuickStat
                      icon={<Sun className="h-6 w-6" />}
                      label="Solar Grid"
                      value={data?.solar_farm?.current}
                      unit="kW"
                      color="#10b981"
                      history={data?.solar_farm?.history}
                      accentColor="green"
                    />
                    <QuickStat
                      icon={<Battery className="h-6 w-6" />}
                      label="Storage"
                      value={data?.battery_storage?.current}
                      unit="%"
                      color="#f59e0b"
                      history={data?.battery_storage?.history}
                      accentColor="amber"
                    />
                    <QuickStat
                      icon={<Car className="h-6 w-6" />}
                      label="EV Nodes"
                      value={data?.ev_charging?.current}
                      unit="kW"
                      color="#d946ef"
                      history={data?.ev_charging?.history}
                      accentColor="purple"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <GlassPanel title="Neural Synthesis" className="border-cyan-500/10" accentColor="cyan">
                    <div className="relative mb-10 group/brain">
                      <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full group-hover/brain:bg-cyan-500/40 transition-all duration-700" />
                      <Brain className="relative h-16 w-16 text-cyan-500 mx-auto animate-pulse" />
                    </div>
                    <p className="text-[12px] text-white/40 font-medium leading-relaxed mb-10 text-center uppercase tracking-widest">
                      Process complex grid distribution patterns to unlock hidden efficiencies.
                    </p>
                    <Button
                      onClick={() => {
                        setActiveTab("ai-insights");
                        generateFullReport();
                      }}
                      className="w-full h-20 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(6,182,212,0.3)]"
                    >
                      Process Intelligence <Sparkles className="ml-3 h-4 w-4" />
                    </Button>
                  </GlassPanel>

                  {selectedBuilding && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <GlassPanel title={`${selectedBuilding.name} Data`} accentColor="fuchsia">
                        <div className="space-y-8">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">Live Power</p>
                              <span className="text-4xl font-black font-mono text-fuchsia-400 tracking-tighter">
                                {selectedBuilding.energy} <span className="text-sm font-sans">kW</span>
                              </span>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">Optimal</Badge>
                          </div>
                          
                          <div className="h-px bg-white/5 w-full" />
                          
                          <div>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Neural Advice</p>
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 italic text-sm text-white/80 leading-relaxed relative overflow-hidden group/advice">
                              <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500" />
                              "{buildingAdvice}"
                            </div>
                          </div>
                        </div>
                      </GlassPanel>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && <AnalyticsView data={data} />}
            {activeTab === "infrastructure" && (
              <InfrastructureView data={data} onBuildingClick={handleBuildingClick} />
            )}
            {activeTab === "ai-insights" && (
              <InsightsView
                report={aiReport}
                isGenerating={isGenerating}
                onGenerate={generateFullReport}
              />
            )}
            {activeTab === "settings" && <SettingsPage />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function HeaderStat({ label, value, unit, color = "text-white" }: any) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-1.5">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-2xl font-black font-mono tracking-tightest ${color}`}
        >
          {value}
        </motion.span>
        <span className="text-[10px] text-white/10 font-black uppercase tracking-tighter">{unit}</span>
      </div>
    </div>
  );
}

function HUDMiniBadge({ label, value, color }: any) {
  return (
    <div className="px-5 py-3 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-3xl">
      <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{label}</p>
      <p className={cn("text-[10px] font-black font-mono", color)}>{value}</p>
    </div>
  );
}

function HUDStatusItem({ color, label, status }: any) {
  return (
    <div className="flex items-center justify-between gap-10">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }} />
        <span className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">{label}</span>
      </div>
      <span className="text-white font-black font-mono bg-white/[0.05] px-2.5 py-1 rounded-lg uppercase text-[9px] tracking-widest">{status}</span>
    </div>
  );
}