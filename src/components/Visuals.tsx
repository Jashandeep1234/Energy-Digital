"use client";

import React, { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, Stars, ContactShadows, Environment, Sky, Sparkles, Grid, 
  Html, Float 
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { HUDMiniBadge, HUDStatusItem } from "@/components/ui/Core";
import { cn } from "@/lib/Utils";

// --- 2D UI Visuals ---

export function LightRays() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
        <svg viewBox="0 0 1440 900" fill="none" className="w-full h-full opacity-40">
          <g filter="url(#filter0_f_1_1)">
            <motion.path initial={{ opacity: 0, pathLength: 0 }} animate={{ opacity: [0.1, 0.3, 0.1], pathLength: 1 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} d="M720 0L0 900H1440L720 0Z" fill="url(#paint0_linear_1_1)" />
            <motion.path animate={{ opacity: [0.05, 0.2, 0.05], rotate: [0, 5, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} d="M720 0L300 900H1140L720 0Z" fill="url(#paint1_linear_1_1)" style={{ originX: "720px", originY: "0px" }} />
          </g>
          <defs>
            <filter id="filter0_f_1_1" x="-200" y="-200" width="1840" height="1300" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="80" /></filter>
            <linearGradient id="paint0_linear_1_1" x1="720" y1="0" x2="720" y2="900" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6" stopOpacity="0.5" /><stop offset="1" stopColor="#3B82F6" stopOpacity="0" /></linearGradient>
            <linearGradient id="paint1_linear_1_1" x1="720" y1="0" x2="720" y2="900" gradientUnits="userSpaceOnUse"><stop stopColor="#8B5CF6" stopOpacity="0.4" /><stop offset="1" stopColor="#8B5CF6" stopOpacity="0" /></linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+";
export function DecryptedText({ text, speed = 50, maxIterations = 10, className = "" }: { text: string; speed?: number; maxIterations?: number; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    let iteration = 0;
    let isMounted = true;
    
    const interval = setInterval(() => {
      if (!isMounted) return;
      setDisplayText((prev) => prev.split("").map((char, i) => i < iteration ? text[i] : characters[Math.floor(Math.random() * characters.length)]).join(""));
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / maxIterations;
    }, speed);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [text, speed, maxIterations]);
  
  return <motion.span className={className}>{displayText}</motion.span>;
}

// --- 3D Components ---

export const Building = ({ position, name, energy, type = "standard", onClick }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const getColor = () => energy > 800 ? "#ef4444" : energy >= 500 ? "#f59e0b" : "#3b82f6";
  const geoArgs: [number, number, number] = type === "tall" ? [1, 5, 1] : type === "wide" ? [3, 1.5, 3] : type === "round" ? [1.5, 2.5, 1.5] : [1.8, 2.8, 1.8];

  useFrame((state) => {
    if (meshRef.current) meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1 + (energy / 1200) * 0.2, 0.05);
  });

  return (
    <group position={position}>
      <Float speed={hovered ? 2 : 1.2} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={() => onClick(name, energy)} castShadow>
          {type === "round" ? <cylinderGeometry args={[geoArgs[0], geoArgs[0], geoArgs[1], 32]} /> : <boxGeometry args={geoArgs} />}
          <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.9} emissive={getColor()} emissiveIntensity={hovered ? 0.8 : 0.2} />
        </mesh>
        <Html position={[0, geoArgs[1] / 2 + 1.2, 0]} center distanceFactor={15}>
          <div className={cn("bg-black/80 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-xl text-center transition-all", hovered && "scale-110 -translate-y-1")}>
            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">{name}</p>
            <p className="text-xs font-black font-mono text-white">{energy} <span className="text-[7px] text-white/30">kW</span></p>
          </div>
        </Html>
      </Float>
    </group>
  );
};

export const SolarFarm = ({ position, energy }: any) => (
  <group position={position}>
    {[-1.5, 0, 1.5].map(x => [-1.5, 0, 1.5].map(z => (
      <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[-Math.PI / 4, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial color="#1a237e" metalness={0.8} emissive="#1a237e" emissiveIntensity={energy > 500 ? 0.5 : 0.2} />
      </mesh>
    )))}
  </group>
);

export const WindTurbine = ({ position, energy }: any) => {
  const bladesRef = useRef<THREE.Group>(null);
  useFrame(() => { if (bladesRef.current) bladesRef.current.rotation.z += (0.5 + energy / 500) * 0.1; });
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow><cylinderGeometry args={[0.1, 0.2, 4, 16]} /><meshStandardMaterial color="#ddd" /></mesh>
      <group position={[0, 4, 0.6]} ref={bladesRef}>
        {[0, 2.09, 4.18].map((a, i) => <mesh key={i} rotation={[0, 0, a]}><mesh position={[0, 1, 0]}><boxGeometry args={[0.15, 2, 0.05]} /><meshStandardMaterial color="white" /></mesh></mesh>)}
      </group>
    </group>
  );
};

export const EVStation = ({ position, energy }: any) => (
  <group position={position}>
    <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[1.5, 1, 0.8]} /><meshStandardMaterial color="#333" /></mesh>
    <pointLight position={[0, 1.2, 0]} color={energy > 300 ? "#ffcc00" : "#4dff88"} intensity={1} distance={3} />
  </group>
);

export const BatteryStorage = ({ position, energy }: any) => (
  <group position={position}>
    {[0, 1, 2].map(i => (
      <mesh key={i} position={[i * 0.8 - 0.8, 0.5, 0]} castShadow>
        <boxGeometry args={[0.6, 1.2, 1]} />
        <meshStandardMaterial color="#111" metalness={0.9} emissive="#00ff00" emissiveIntensity={energy > 50 ? 0.4 : 0.1} />
      </mesh>
    ))}
  </group>
);

// --- Digital Twin (Main Scene) ---

export const DigitalTwin = ({ data, onBuildingClick }: any) => (
  <div className="w-full h-full min-h-[500px] relative rounded-3xl overflow-hidden bg-black">
    <Canvas 
      shadows 
      camera={{ position: [25, 25, 25], fov: 40 }}
      onCreated={(state) => {
        state.gl.outputColorSpace = 'srgb';
        if (process.env.NODE_ENV === 'development') {
          state.gl.debug.checkShaderErrors = true;
        }
      }}
      onError={(err) => {
        if (process.env.NODE_ENV === 'development') console.error('Canvas error:', err);
      }}
    >
      <Suspense fallback={null}>
        <OrbitControls maxPolarAngle={Math.PI / 2.2} minDistance={15} maxDistance={60} makeDefault />
        <Sky distance={450000} sunPosition={[0, 1, 0]} rayleigh={2} />
        <Stars radius={100} depth={50} count={7000} factor={4} />
        <Sparkles count={200} scale={50} size={2} opacity={0.2} color="#4d94ff" />
        <Environment preset="night" />
        <ambientLight intensity={0.2} />
        <directionalLight position={[50, 50, 50]} intensity={2} castShadow />
        <fog attach="fog" args={["#000", 30, 90]} />

        <Building position={[-8, 0, 4]} name="Library" type="wide" energy={data?.library?.current || 0} onClick={onBuildingClick} />
        <Building position={[-4, 0, 0]} name="Labs" type="standard" energy={data?.labs?.current || 0} onClick={onBuildingClick} />
        <Building position={[4, 0, 2]} name="Canteen" type="wide" energy={data?.canteen?.current || 0} onClick={onBuildingClick} />
        <Building position={[0, 0, -8]} name="Innovation Hub" type="round" energy={data?.innovation_hub?.current || 0} onClick={onBuildingClick} />
        <Building position={[-12, 0, -6]} name="Data Center" type="tall" energy={data?.data_center?.current || 0} onClick={onBuildingClick} />
        <Building position={[10, 0, -8]} name="Research Center" type="tall" energy={data?.research_center?.current || 0} onClick={onBuildingClick} />
        <Building position={[12, 0, 6]} name="Sports Complex" type="wide" energy={data?.sports_complex?.current || 0} onClick={onBuildingClick} />
        <Building position={[-6, 0, 14]} name="Hostels" type="standard" energy={data?.hostels?.current || 0} onClick={onBuildingClick} />
        <Building position={[6, 0, 16]} name="Admin" type="standard" energy={data?.admin_building?.current || 0} onClick={onBuildingClick} />

        <SolarFarm position={[-20, 0, -15]} energy={data?.solar_farm?.current || 0} />
        <WindTurbine position={[20, 0, -20]} energy={data?.wind_turbine?.current || 0} />
        <EVStation position={[22, 0, 12]} energy={data?.ev_charging?.current || 0} />
        <BatteryStorage position={[-15, 0, 15]} energy={data?.battery_storage?.current || 0} />

        <group position={[0, -1.01, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[60, 64]} /><meshStandardMaterial color="#020202" roughness={0.05} metalness={0.9} /></mesh>
          <Grid position={[0, 0.05, 0]} args={[100, 100]} cellSize={2} cellColor="#1a1a1a" sectionSize={10} sectionColor="#2a2a2a" fadeDistance={50} infiniteGrid />
        </group>
        <ContactShadows position={[0, -0.99, 0]} opacity={0.6} scale={100} blur={2} far={10} color="#000" />
      </Suspense>
    </Canvas>
    <div className="absolute top-8 left-8 space-y-4 pointer-events-none">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
        <h3 className="text-sm font-black text-white/90 tracking-[0.4em] uppercase">Campus_Nexus_Core</h3>
      </div>
      <div className="flex flex-wrap gap-4">
         <HUDMiniBadge label="Grid Freq" value="60.02 Hz" color="text-blue-400" />
         <HUDMiniBadge label="Phase Bal" value="99.8%" color="text-emerald-400" />
         <HUDMiniBadge label="Voltage" value="13.8 kV" color="text-purple-400" />
         <HUDMiniBadge label="Total Load" value={`${data ? Object.values(data).reduce((a: any, c: any) => a + (c.current || 0), 0) : 0} kW`} color="text-white" />
      </div>
    </div>
    <div className="absolute bottom-8 right-8 flex flex-col gap-3 p-6 rounded-[2rem] bg-black/60 border border-white/5 backdrop-blur-3xl min-w-[240px]">
      <div className="space-y-3">
        <HUDStatusItem color="#ef4444" label="Critical Demand" status="INTERVENTION" />
        <HUDStatusItem color="#f59e0b" label="Standard Flux" status="STABILIZED" />
        <HUDStatusItem color="#3b82f6" label="Optimal Flow" status="NOMINAL" />
      </div>
    </div>
  </div>
);
