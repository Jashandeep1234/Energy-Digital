"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, BarChart3, Globe, ArrowRight, Github } from "lucide-react";
import { useAuth } from "@/components/shared/AuthProvider";
import { Button } from "@/components/ui/Core";
import { LightRays } from "@/components/ui/Visuals";
import { cn } from "@/lib/Utils";

// --- Landing Page Enhancements ---
export function LandingPage() {
  const { login } = useAuth();

  return (
    <div className="relative min-h-screen w-full bg-[#020202] text-white overflow-hidden selection:bg-cyan-500/30 font-sans">
      <LightRays />
      
      {/* Background Noise Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-8 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all group-hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]"
          >
            <Zap className="h-7 w-7 text-white fill-white" />
          </motion.div>
          <span className="text-2xl font-black tracking-tighter uppercase flex items-center">
            Energy
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 ml-1">Digital</span>
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-12">
          {["System", "Neural", "Security", "Grid"].map((item) => (
            <motion.a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              whileHover={{ y: -2 }}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-cyan-400 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-cyan-500 transition-all group-hover:w-full" />
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Button 
            onClick={() => login()}
            variant="cyber"
            className="rounded-full px-8 h-12 text-[10px] font-black uppercase tracking-widest hidden sm:flex"
          >
            Access Portal
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-56 pb-32 px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-10"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Core Engine Online v2.5.0</span>
            </motion.div>
            
            <h1 className="text-8xl lg:text-9xl font-black tracking-tightest leading-[0.85] mb-10">
              <span className="block overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="block"
                >
                  AUTONOMOUS
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500"
                >
                  ENERGY GRIDS
                </motion.span>
              </span>
            </h1>
            
            <p className="text-xl text-white/40 font-medium max-w-xl mb-16 leading-relaxed">
              Synthesize your infrastructure into a hyper-intelligent digital twin. 
              Deploy AI-driven predictive load balancing across a high-fidelity 3D spatial interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                onClick={() => login()}
                size="lg"
                className="h-20 bg-cyan-500 hover:bg-cyan-400 text-black rounded-[2rem] px-12 text-[12px] font-black uppercase tracking-[0.4em] shadow-[0_30px_60px_rgba(6,182,212,0.3)] group"
              >
                Launch Twin <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="h-20 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 rounded-[2rem] px-12 text-[12px] font-black uppercase tracking-[0.4em] backdrop-blur-2xl"
              >
                View Manifest
              </Button>
            </div>
          </motion.div>

          {/* Abstract 3D Representation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block perspective-1000"
          >
            <div className="relative aspect-square">
              {/* Floating Orbs */}
              <motion.div 
                animate={{ 
                  y: [0, -40, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/30 blur-[100px] rounded-full" 
              />
              <motion.div 
                animate={{ 
                  y: [0, 40, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-20 -right-20 w-80 h-80 bg-fuchsia-500/20 blur-[120px] rounded-full" 
              />
              
              {/* Layered Glass Cards */}
              <div className="relative h-full w-full flex items-center justify-center">
                <div className="grid grid-cols-3 gap-6 p-16">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1, z: 50, rotateX: 10, rotateY: 10 }}
                      animate={{ 
                        y: [0, -30, 0],
                        rotate: [0, i % 2 === 0 ? 5 : -5, 0],
                      }}
                      transition={{ 
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                      className={cn(
                        "h-32 w-32 rounded-[2.5rem] border backdrop-blur-md flex items-center justify-center transition-all duration-700 shadow-2xl",
                        i % 3 === 0 ? "bg-cyan-500/10 border-cyan-500/30" : 
                        i % 3 === 1 ? "bg-fuchsia-500/10 border-fuchsia-500/30" : 
                        "bg-blue-500/10 border-blue-500/30"
                      )}
                    >
                      <Zap className={cn(
                        "h-8 w-8",
                        i % 3 === 0 ? "text-cyan-400" : 
                        i % 3 === 1 ? "text-fuchsia-400" : 
                        "text-blue-400"
                      )} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Status Ticker */}
      <div className="w-full border-y border-white/5 bg-white/[0.02] py-6 overflow-hidden whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">System Status: Nominal</span>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Uptime: 99.998%</span>
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Grid Sync: Active</span>
              <div className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Features Grid */}
      <section className="py-48 px-12 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 mb-6">Capabilities</h2>
            <h3 className="text-6xl font-black tracking-tighter">ENGINEERED FOR <br /> PERFORMANCE.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <FeatureCard 
              icon={<Globe className="h-7 w-7" />}
              title="Spatial Mapping"
              color="cyan"
              description="High-fidelity 3D visualization of your entire power infrastructure grid with centimeter accuracy."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-7 w-7" />}
              title="Neural Sync"
              color="fuchsia"
              description="AI-driven predictive analytics for load forecasting and demand response utilizing LSTM networks."
            />
            <FeatureCard 
              icon={<Shield className="h-7 w-7" />}
              title="Quantum Security"
              color="blue"
              description="Military-grade security with multi-factor Google enterprise authentication and end-to-end encryption."
            />
            <FeatureCard 
              icon={<Zap className="h-7 w-7" />}
              title="Real-time Node"
              color="emerald"
              description="Sub-millisecond latency data synchronization via Firebase Realtime global edge nodes."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-12">
        <div className="max-w-5xl mx-auto rounded-[4rem] bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-transparent border border-white/10 p-24 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
          <motion.div 
            whileInView={{ scale: [0.9, 1.1, 1], opacity: [0, 1] }}
            className="relative z-10"
          >
            <h2 className="text-7xl font-black tracking-tightest mb-10 uppercase">Ready to <span className="text-cyan-400">Synchronize?</span></h2>
            <p className="text-xl text-white/40 font-medium max-w-2xl mx-auto mb-16 uppercase tracking-widest">
              Join the elite infrastructure teams managing the world's most advanced energy grids.
            </p>
            <Button 
              onClick={() => login()}
              size="lg"
              className="h-24 bg-white text-black hover:bg-cyan-400 hover:scale-105 transition-all rounded-[2.5rem] px-16 text-[14px] font-black uppercase tracking-[0.5em] shadow-2xl"
            >
              Enter Portal
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-black fill-black" />
              </div>
              <span className="font-black uppercase tracking-widest text-lg">Energy Digital</span>
            </div>
            <p className="text-white/20 text-[10px] font-black tracking-[0.4em] uppercase max-w-xs">
              Autonomous Infrastructure Management & Digital Twin Synthesis.
            </p>
          </div>
          <div className="flex gap-16">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Platform</h4>
              <ul className="space-y-2">
                {["Core", "Neural", "Security"].map(l => (
                  <li key={l} className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white cursor-pointer transition-colors">{l}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Legal</h4>
              <ul className="space-y-2">
                {["Privacy", "Terms", "Compliance"].map(l => (
                  <li key={l} className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white cursor-pointer transition-colors">{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: any) {
  const colorStyles = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:bg-cyan-500/20",
    fuchsia: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20 group-hover:bg-fuchsia-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20",
  }[color as string] || "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20";

  return (
    <motion.div
      whileHover={{ y: -15, scale: 1.02 }}
      className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-md group transition-all duration-500 hover:border-white/10"
    >
      <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center mb-10 transition-all duration-500", colorStyles)}>
        {icon}
      </div>
      <h3 className="text-[12px] font-black uppercase tracking-[0.3em] mb-6 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-sm text-white/30 font-medium leading-relaxed group-hover:text-white/50 transition-colors">{description}</p>
    </motion.div>
  );
}
