"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/Utils";

// --- UI Components ---
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]",
        destructive: "bg-destructive text-white hover:bg-destructive/90 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
        outline: "border bg-background shadow-xs hover:bg-accent dark:bg-white/[0.02] dark:border-white/10 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent dark:hover:bg-white/5",
        link: "text-primary underline-offset-4 hover:underline",
        cyber: "bg-transparent border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]",
        neon: "bg-fuchsia-600 text-white hover:bg-fuchsia-500 shadow-[0_0_20px_rgba(192,38,211,0.4)] hover:shadow-[0_0_30px_rgba(192,38,211,0.6)]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-8 rounded-md px-3 text-[10px]",
        lg: "h-14 rounded-2xl px-8",
        icon: "size-11 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export const Button = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { indicatorClassName?: string, color?: string }>(
  ({ className, value, indicatorClassName, color = "bg-blue-500", ...props }, ref) => (
    <ProgressPrimitive.Root ref={ref} className={cn("bg-white/5 relative h-1.5 w-full overflow-hidden rounded-full", className)} {...props}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn("h-full transition-all duration-500 ease-in-out", color, indicatorClassName)} 
      />
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = "Progress";

export const Input = ({ className, ...props }: React.ComponentProps<"input">) => <input className={cn("flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-1 text-sm shadow-sm transition-all placeholder:text-white/20 focus-visible:outline-none focus-visible:border-blue-500/50 focus-visible:ring-1 focus-visible:ring-blue-500/20 disabled:opacity-50", className)} {...props} />;
export const Label = ({ className, ...props }: React.ComponentProps<"label">) => <label className={cn("text-[10px] font-black uppercase tracking-widest leading-none peer-disabled:opacity-70 text-white/40", className)} {...props} />;

export const Switch = ({ className, color = "data-[state=checked]:bg-blue-500", ...props }: React.ComponentProps<typeof SwitchPrimitive.Root> & { color?: string }) => (
  <SwitchPrimitive.Root className={cn("peer data-[state=unchecked]:bg-white/5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-white/10 shadow-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50", color, className)} {...props}>
    <SwitchPrimitive.Thumb className={cn("bg-white pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5")} />
  </SwitchPrimitive.Root>
);

export const Slider = ({ className, defaultValue, value, min = 0, max = 100, color = "bg-blue-500", ...props }: React.ComponentProps<typeof SliderPrimitive.Root> & { color?: string }) => {
  const _values = React.useMemo(() => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]), [value, defaultValue, min, max]);
  return (
    <SliderPrimitive.Root defaultValue={defaultValue} value={value} min={min} max={max} className={cn("relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full", className)} {...props}>
      <SliderPrimitive.Track className="bg-white/5 relative grow overflow-hidden rounded-full h-1.5 w-full">
        <SliderPrimitive.Range className={cn("absolute h-full", color)} />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, i) => (
        <SliderPrimitive.Thumb key={i} className={cn("block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-all hover:scale-120 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50", color.replace('bg-', 'border-'))} />
      ))}
    </SliderPrimitive.Root>
  );
};

// --- Shared Display Components ---
export const GlassPanel = ({ title, children, className, style, innerClassName, accentColor = "blue" }: any) => {
  const accentClasses = {
    blue: "bg-blue-500/20",
    purple: "bg-fuchsia-500/20",
    green: "bg-emerald-500/20",
    amber: "bg-amber-500/20",
    cyan: "bg-cyan-500/20",
  }[accentColor as string] || "bg-blue-500/20";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -2 }}
      style={style} 
      className={cn("relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-black/40 backdrop-blur-3xl transition-all duration-500 hover:border-white/20 group", className)}
    >
      {/* Scanning Line Effect */}
      <motion.div 
        animate={{ y: ["0%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none"
      />

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 rounded-tl-[2.5rem] pointer-events-none group-hover:border-white/30 transition-colors" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-[2.5rem] pointer-events-none group-hover:border-white/30 transition-colors" />

      <div className={cn("p-6 relative z-10", innerClassName)}>
        {title && (
          <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 group-hover:text-white transition-colors">{title}</h3>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(i => (
                <div key={i} className={cn("h-1 w-1 rounded-full animate-pulse", accentClasses.replace('/20', ''))} style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
};

export const EnergyChart = ({ data, color = "#3b82f6" }: { data: any[], color?: string }) => (
  <div className="h-full w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`color-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
        <XAxis dataKey="timestamp" hide />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }} 
          itemStyle={{ color: '#fff', fontWeight: 'bold' }} 
          labelStyle={{ display: 'none' }} 
        />
        <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill={`url(#color-${color.replace('#', '')})`} strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const Badge = ({ children, className }: any) => (
  <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/10", className)}>
    {children}
  </span>
);

// --- HUD Components ---
export const HUDMiniBadge = ({ label, value, color }: any) => (
  <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/5 backdrop-blur-xl">
    <p className="text-[7px] font-bold text-white/20 uppercase tracking-tighter mb-0.5">{label}</p>
    <p className={cn("text-[10px] font-black font-mono", color)}>{value}</p>
  </div>
);

export const HUDStatusItem = ({ color, label, status }: any) => (
  <div className="flex items-center justify-between gap-6">
    <div className="flex items-center gap-2.5">
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
      <span className="text-white/40 font-bold uppercase tracking-wider text-[10px]">{label}</span>
    </div>
    <span className="text-white/80 font-black font-mono bg-white/[0.03] px-2 py-0.5 rounded uppercase text-[9px]">{status}</span>
  </div>
);
