"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, ContactShadows, Environment, Sky, Sparkles, Grid } from "@react-three/drei";
import { Building, SolarFarm, WindTurbine, EVStation, PowerGrid } from "@/components/ThreeVisuals";
import { HUDMiniBadge, HUDStatusItem } from "@/components/ui/Core";
import { CampusEnergy } from "@/lib/service";
import { Suspense } from "react";
import * as THREE from "three";

interface DigitalTwinProps {
  data: CampusEnergy | null;
  onBuildingClick: (name: string, energy: number) => void;
}

export const DigitalTwin = ({ data, onBuildingClick }: DigitalTwinProps) => {
  return (
    <div className="w-full h-full min-h-[500px] relative rounded-3xl overflow-hidden bg-[#000]">
      <Canvas shadows camera={{ position: [25, 25, 25], fov: 40 }}>
        <Suspense fallback={null}>
          <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2.2} minDistance={15} maxDistance={60} makeDefault />
          <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.8} />
          <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1.5} />
          <Sparkles count={200} scale={50} size={2} speed={0.5} opacity={0.2} color="#4d94ff" />
          <Environment preset="night" />
          <ambientLight intensity={0.2} />
          <directionalLight position={[50, 50, 50]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />
          <pointLight position={[0, 10, 0]} intensity={2} color="#3b82f6" decay={2} distance={100} />
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
          <WindTurbine position={[20, 0, -20]} energy={400} />
          <WindTurbine position={[15, 0, -25]} energy={350} />
          <EVStation position={[22, 0, 12]} energy={data?.ev_charging?.current || 0} />
          <PowerGrid data={data} />

          <group position={[0, -1.01, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[60, 64]} /><meshStandardMaterial color="#020202" roughness={0.05} metalness={0.9} /></mesh>
            <Grid position={[0, 0.05, 0]} args={[100, 100]} cellSize={2} cellThickness={1} cellColor="#1a1a1a" sectionSize={10} sectionThickness={1.5} sectionColor="#2a2a2a" fadeDistance={50} infiniteGrid />
          </group>
          <ContactShadows position={[0, -0.99, 0]} opacity={0.6} scale={100} blur={2} far={10} color="#000" />
        </Suspense>
      </Canvas>
      
      <div className="absolute top-8 left-8 flex flex-col gap-4 pointer-events-none">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <h3 className="text-sm font-black text-white/90 tracking-[0.4em] uppercase">Campus_Nexus_Core</h3>
          </div>
          <p className="text-[9px] text-white/30 font-mono tracking-widest uppercase">Node Synchronization: ACTIVE</p>
        </div>
        <div className="flex gap-4">
           <HUDMiniBadge label="Grid Freq" value="60.02 Hz" color="text-blue-400" />
           <HUDMiniBadge label="Phase Bal" value="99.8%" color="text-emerald-400" />
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col gap-3 p-6 rounded-[2rem] bg-black/60 border border-white/5 backdrop-blur-3xl min-w-[240px] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0" />
        <p className="font-black mb-1 uppercase tracking-[0.3em] text-white/20 text-[8px]">Spectral Load Status</p>
        <div className="space-y-3">
          <HUDStatusItem color="#ef4444" label="Critical Demand" status="INTERVENTION" />
          <HUDStatusItem color="#f59e0b" label="Standard Flux" status="STABILIZED" />
          <HUDStatusItem color="#3b82f6" label="Optimal Flow" status="NOMINAL" />
        </div>
      </div>
    </div>
  );
};