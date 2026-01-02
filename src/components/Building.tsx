"use client";

import { GlassPanel } from "@/components/ui/Core";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, MessageSquare, History, Zap, TrendingDown, Target, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Core";

interface AIInsightsProps {
  report: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const AIInsights = ({ report, isGenerating, onGenerate }: AIInsightsProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tighter">NEURAL_<span className="text-blue-500">INSIGHTS</span></h2>
        <p className="text-xs text-white/40 font-mono tracking-widest uppercase">Gemini AI Campus Optimization Engine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator Panel */}
        <div className="lg:col-span-1 space-y-6">
          <GlassPanel title="Intelligence Control" className="bg-gradient-to-br from-blue-600/10 to-transparent">
            <div className="space-y-6">
              <div className="relative group p-6 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Brain className="h-12 w-12 text-blue-500 mb-4 animate-pulse" />
                  <h3 className="text-lg font-black uppercase tracking-tight">Nexus-Gemini Neural Sync</h3>
                  <p className="text-xs text-white/40 mt-2 leading-relaxed">
                    Utilizing frontier intelligence (Gemini 3) for real-time synchronization with campus nodes for predictive load balancing.
                  </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Knowledge Base</span>
                  <span className="text-blue-400">Live Campus Data</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                  />
                </div>
              </div>

              <Button 
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    <span>Synthesizing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Master Report</span>
                  </div>
                )}
              </Button>
            </div>
          </GlassPanel>

          <div className="grid grid-cols-2 gap-4">
            <MiniInsightCard icon={<TrendingDown className="text-emerald-400" />} label="Avg reduction" value="-14%" />
            <MiniInsightCard icon={<ShieldCheck className="text-blue-400" />} label="Reliability" value="99.9%" />
          </div>
        </div>

        {/* Report Display */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {report ? (
              <motion.div
                key="report"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
              >
                <GlassPanel title="Synthesized Executive Summary" className="min-h-[600px] border-blue-500/20">
                  <div className="prose prose-invert max-w-none">
                      <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <div className={`h-2 w-2 rounded-full ${report.toLowerCase().includes("error") || report.toLowerCase().includes("unavailable") ? "bg-red-500" : "bg-blue-500"} animate-ping`} />
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${report.toLowerCase().includes("error") || report.toLowerCase().includes("unavailable") ? "text-red-400" : "text-blue-400"}`}>
                          {report.toLowerCase().includes("error") || report.toLowerCase().includes("unavailable") ? "Analysis Interrupted" : "Analysis Complete | Confidence: 98.4%"}
                        </p>
                      </div>
                      <div className={`text-sm leading-relaxed whitespace-pre-wrap font-medium font-mono ${report.toLowerCase().includes("error") || report.toLowerCase().includes("unavailable") ? "text-red-400/80" : "text-white/70 first-letter:text-4xl first-letter:font-black first-letter:text-blue-500"}`}>
                        {report}
                      </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center gap-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                <div className="relative">
                  <div className="absolute inset-0 blur-3xl bg-blue-500/20 animate-pulse" />
                  <MessageSquare className="h-16 w-16 text-white/10 relative" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-[0.5em] text-white/20">Awaiting Neural Synthesis</p>
                  <p className="text-[10px] text-white/10 mt-2 font-mono italic">Initiate command to analyze global campus topology</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const MiniInsightCard = ({ icon, label, value }: any) => (
  <GlassPanel className="p-4 text-center">
    <div className="mx-auto w-8 h-8 flex items-center justify-center bg-white/[0.03] rounded-lg mb-2">
      {icon}
    </div>
    <p className="text-[8px] font-bold uppercase text-white/30 tracking-widest">{label}</p>
    <p className="text-lg font-black font-mono mt-1">{value}</p>
  </GlassPanel>
);