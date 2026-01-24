"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/shared/AuthProvider";
import { LightRays } from "@/components/ui/Visuals";
import { Button, Input, Label } from "@/components/ui/Core";

export function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden">
      <LightRays />
      <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h1 className="text-6xl font-black tracking-tighter">
            ENERGY<span className="text-blue-500">DIGITAL</span>
          </h1>
          <p className="text-lg text-white/60 font-medium max-w-md">
            Next-gen campus energy management. Real-time energy digital synthesis
            and neural load balancing.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-black/60 border border-white/10 p-12 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                  Terminal ID
                </Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexus.campus"
                  className="h-14 bg-white/[0.02] border-white/10 rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                  Access Code
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 bg-white/[0.02] border-white/10 rounded-xl"
                  required
                />
              </div>
            </div>
            {error && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider text-center">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-blue-600 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Initiate Sync"}
            </Button>
            <Button
              type="button"
              onClick={() => login()}
              variant="outline"
              className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Bypass via Google Auth
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
