"use client";

import { GlassPanel, Progress, Button } from "@/components/ui/Core";
import { CampusEnergy } from "@/lib/service";
import { motion } from "framer-motion";
import { Building2, Cpu, GraduationCap, Coffee, Lightbulb, Rocket, Microscope, Trophy, Home, UserCog, AlertCircle, Zap, Sparkles, Sun, Battery, Car, Globe } from "lucide-react";
import { cn } from "@/lib/Utils";

interface InfrastructureDetailsProps {
  data: CampusEnergy | null;
  onBuildingClick: (name: string, energy: number) => void;
  context?: string | null;
  alerts?: any[];
}

const sectorIcons: Record<string, any> = {
  library: GraduationCap,
  labs: Microscope,
  canteen: Coffee,
  innovation_hub: Rocket,
  data_center: Cpu,
  research_center: Lightbulb,
  sports_complex: Trophy,
  hostels: Home,
  admin_building: UserCog,
  solar_farm: Sun,
  battery_storage: Battery,
  ev_charging: Car,
};

export const InfrastructureDetails = ({ data, onBuildingClick, context, alerts }: InfrastructureDetailsProps) => {
  if (!data) return null;

  const activeAlerts = alerts && alerts.length > 0 ? alerts : [
    { type: "URGENT", title: "Voltage Fluctuation", message: "Sector: DATA_CENTER | Auto-stabilizing...", code: "SYS_ERR_01" },
    { type: "STABLE", title: "Nominal Flow", message: "All grid nodes operating within parameters.", code: "SYS_OK_01" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black tracking-tighter">SECTOR_<span className="text-blue-500">INFRASTRUCTURE</span></h2>
          <p className="text-xs text-white/40 font-mono tracking-widest uppercase">Granular management of campus grid nodes</p>
        </div>
        {context && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl max-w-md">
            <Sparkles className="h-3 w-3 text-blue-400 shrink-0" />
            <p className="text-[9px] font-bold text-blue-400/80 uppercase truncate">Neural Context Active: {context}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(data).map(([key, sector], index) => {
          const Icon = sectorIcons[key] || Building2;
          const loadPercentage = Math.min((sector.current / 1000) * 100, 100);
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassPanel className="p-6 group hover:border-blue-500/30 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                    <Icon className="h-6 w-6 text-white/60 group-hover:text-blue-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Load Status</p>
                    <p className={`text-[10px] font-black uppercase mt-1 ${loadPercentage > 80 ? 'text-red-500' : 'text-green-500'}`}>
                      {loadPercentage > 80 ? 'CRITICAL_LOAD' : 'NOMINAL_FLOW'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black tracking-tight uppercase">{key.replace('_', ' ')}</h3>
                    <p className="text-[10px] font-mono text-white/30">NODE_ID: {key.toUpperCase()}_01</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-white/40 uppercase">Grid Draw</span>
                      <span className="text-xl font-black font-mono">{sector.current} <span className="text-[10px] text-white/20">{key === 'battery_storage' ? '%' : 'kW'}</span></span>
                    </div>
                    <Progress value={loadPercentage} className="h-1.5 bg-white/5" indicatorClassName={loadPercentage > 80 ? 'bg-red-500' : 'bg-blue-500'} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Peak Today</p>
                      <p className="text-xs font-black font-mono mt-1">
                        {sector.history ? Math.max(...sector.history.map(h => h.value)) : 0} {key === 'battery_storage' ? '%' : 'kW'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Efficiency</p>
                      <p className="text-xs font-black font-mono mt-1">94.2%</p>
                    </div>
                  </div>

                  <Button 
                    variant="outline"
                    onClick={() => onBuildingClick(key.replace('_', ' '), sector.current)}
                    className="w-full border-white/5 hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-400 text-[10px] font-black uppercase tracking-widest h-10 group/btn"
                  >
                    <Zap className="h-3 w-3 mr-2 group-hover/btn:animate-pulse" />
                    Neural Advice
                  </Button>
                </div>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <GlassPanel title="Neural Context Alerts" className="border-blue-500/10 bg-blue-500/[0.01]">
            <div className="space-y-4">
              {activeAlerts.map((alert, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 items-start">
                  <div className={cn(
                    "p-2 rounded-lg shrink-0",
                    alert.type === "URGENT" ? "bg-red-500/10" : "bg-blue-500/10"
                  )}>
                    <AlertCircle className={cn(
                      "h-4 w-4",
                      alert.type === "URGENT" ? "text-red-500" : "text-blue-500"
                    )} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">{alert.title}</p>
                    <p className="text-[10px] text-white/40 mt-1">{alert.message} | Code: {alert.code}</p>
                  </div>
                </div>
              ))}
            </div>
         </GlassPanel>

         <GlassPanel title="Energy Distribution Map">
            <div className="aspect-video rounded-xl border border-white/5 bg-black/40 flex items-center justify-center relative overflow-hidden group/map">
               <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
               
               <div className="grid grid-cols-8 grid-rows-8 w-full h-full p-4 gap-2 opacity-20">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-white/5 rounded-[2px] relative overflow-hidden">
                      {Math.random() > 0.8 && (
                        <motion.div 
                          animate={{ opacity: [0, 1, 0] }} 
                          transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 5 }}
                          className="absolute inset-0 bg-blue-500/40"
                        />
                      )}
                    </div>
                  ))}
               </div>

               <div className="relative text-center space-y-4 z-10">
                 <div className="relative">
                    <div className="w-16 h-16 rounded-full border border-blue-500/30 animate-[ping_3s_infinite] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <div className="w-12 h-12 rounded-full border border-blue-500/50 animate-[pulse_2s_infinite] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <div className="h-12 w-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center relative mx-auto">
                       <Globe className="h-6 w-6 text-blue-500 animate-pulse" />
                    </div>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Live Heatmap Sync</p>
                    <p className="text-[8px] font-mono text-white/20 mt-1 uppercase">Active Grid Nodes: {Object.keys(data).length}</p>
                 </div>
               </div>

               {/* Scanning line effect */}
               <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-[scan_4s_linear_infinite]" />
            </div>
         </GlassPanel>
      </div>
    </div>
  );
};