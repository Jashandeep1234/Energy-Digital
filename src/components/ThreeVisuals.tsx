"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";

// --- Building Component ---
interface BuildingProps {
  position: [number, number, number];
  name: string;
  energy: number;
  type?: "tall" | "wide" | "round" | "standard";
  onClick: (name: string, energy: number) => void;
}

export const Building = ({ position, name, energy, type = "standard", onClick }: BuildingProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const geometryArgs: [number, number, number] = useMemo(() => {
    switch (type) {
      case "tall": return [1, 5, 1];
      case "wide": return [3, 1.5, 3];
      case "round": return [1.5, 2.5, 1.5];
      default: return [1.8, 2.8, 1.8];
    }
  }, [type]);

  const getColor = () => {
    if (energy > 800) return "#ef4444";
    if (energy >= 500) return "#f59e0b";
    return "#3b82f6";
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      const targetScale = 1 + (energy / 1200) * 0.2;
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.05);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.05 + Math.sin(time * 2) * 0.02);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <group position={position}>
      <Float speed={hovered ? 2 : 1.2} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onClick(name, energy)}
          castShadow
        >
          {type === "round" ? <cylinderGeometry args={[geometryArgs[0], geometryArgs[0], geometryArgs[1], 32]} /> : <boxGeometry args={geometryArgs} />}
          <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.9} emissive={getColor()} emissiveIntensity={hovered ? 0.8 : 0.2} />
          <mesh scale={[1.02, 1.02, 1.02]}>
            {type === "round" ? <cylinderGeometry args={[geometryArgs[0], geometryArgs[0], geometryArgs[1], 32]} /> : <boxGeometry args={geometryArgs} />}
            <meshBasicMaterial color={getColor()} wireframe transparent opacity={hovered ? 0.4 : 0.15} />
          </mesh>
        </mesh>
        <mesh ref={glowRef}>
          {type === "round" ? <cylinderGeometry args={[geometryArgs[0], geometryArgs[0], geometryArgs[1], 32]} /> : <boxGeometry args={geometryArgs} />}
          <meshBasicMaterial color={getColor()} transparent opacity={0.1} />
        </mesh>
        <Html position={[0, geometryArgs[1] / 2 + 1.2, 0]} center distanceFactor={15}>
          <div className={`flex flex-col items-center transition-all duration-500 ${hovered ? 'scale-110 translate-y-[-5px]' : 'scale-100'}`}>
            <div className="bg-black/80 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-xl shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundColor: getColor() }} />
              <div className="relative z-10 text-center">
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">{name}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <p className="text-xs font-black font-mono text-white">{energy}</p>
                  <p className="text-[7px] text-white/30 uppercase">kW</p>
                </div>
              </div>
            </div>
            <div className="w-px h-4 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </Html>
      </Float>
    </group>
  );
};

// --- Solar Farm Component ---
export const SolarFarm = ({ position, energy }: { position: [number, number, number], energy: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      const tilt = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry.type === 'BoxGeometry') child.rotation.x = -Math.PI / 4 + tilt;
      });
    }
  });
  return (
    <group position={position} ref={groupRef}>
      {[-1.5, 0, 1.5].map((x) => [-1.5, 0, 1.5].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[-Math.PI / 4, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.05, 0.8]} />
          <meshStandardMaterial color="#1a237e" metalness={0.8} roughness={0.2} emissive="#1a237e" emissiveIntensity={energy > 500 ? 0.5 : 0.2} />
        </mesh>
      )))}
      <mesh position={[0, -0.2, 0]} receiveShadow><boxGeometry args={[4.5, 0.1, 4.5]} /><meshStandardMaterial color="#222" /></mesh>
    </group>
  );
};

// --- Wind Turbine Component ---
export const WindTurbine = ({ position, energy }: { position: [number, number, number], energy: number }) => {
  const bladesRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (bladesRef.current) bladesRef.current.rotation.z += (0.5 + energy / 500) * 0.1;
  });
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow><cylinderGeometry args={[0.1, 0.2, 4, 16]} /><meshStandardMaterial color="#ddd" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0, 4, 0.2]} castShadow><boxGeometry args={[0.4, 0.4, 0.8]} /><meshStandardMaterial color="#eee" /></mesh>
      <group position={[0, 4, 0.6]} ref={bladesRef}>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, angle]}><mesh position={[0, 1, 0]}><boxGeometry args={[0.15, 2, 0.05]} /><meshStandardMaterial color="white" /></mesh></mesh>
        ))}
      </group>
    </group>
  );
};

// --- EV Station Component ---
export const EVStation = ({ position, energy }: { position: [number, number, number], energy: number }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (lightRef.current) lightRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5 * (energy / 500);
  });
  const color = energy > 300 ? "#ffcc00" : "#4dff88";
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[1.5, 1, 0.8]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[2, 0.1, 1.2]} /><meshStandardMaterial color="#444" metalness={0.8} /></mesh>
      <mesh position={[0, 1, 0.4]}><sphereGeometry args={[0.1, 16, 16]} /><meshBasicMaterial color={color} /></mesh>
      <pointLight ref={lightRef} position={[0, 1.2, 0]} color={color} distance={3} />
    </group>
  );
};

// --- Power Grid Component ---
const Connection = ({ start, end, active }: { start: [number, number, number], end: [number, number, number], active: boolean }) => {
  const midPoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2] as [number, number, number];
  const direction = new THREE.Vector3(...end).sub(new THREE.Vector3(...start));
  const length = direction.length();
  const lookAt = new THREE.Matrix4().lookAt(new THREE.Vector3(...start), new THREE.Vector3(...end), new THREE.Vector3(0, 1, 0));
  const rotation = new THREE.Euler().setFromRotationMatrix(lookAt);

  return (
    <mesh position={midPoint} rotation={rotation}>
      <boxGeometry args={[0.05, 0.05, length]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={active ? 0.2 : 0.05} />
    </mesh>
  );
};

export const PowerGrid = ({ data }: { data: any }) => (
  <group>
    <Connection start={[-20, 0, -15]} end={[-8, 0, 4]} active={!!data?.solar_farm} />
    <Connection start={[-20, 0, -15]} end={[-4, 0, 0]} active={!!data?.solar_farm} />
    <Connection start={[20, 0, -20]} end={[0, 0, -8]} active={true} />
    <Connection start={[0, 0, -8]} end={[22, 0, 12]} active={true} />
  </group>
);
