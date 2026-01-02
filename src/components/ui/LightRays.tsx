"use client";

import { motion } from "framer-motion";

export function LightRays() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-40"
        >
          <g filter="url(#filter0_f_1_1)">
            <motion.path
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: [0.1, 0.3, 0.1], pathLength: 1 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              d="M720 0L0 900H1440L720 0Z"
              fill="url(#paint0_linear_1_1)"
            />
            <motion.path
              animate={{ opacity: [0.05, 0.2, 0.05], rotate: [0, 5, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              d="M720 0L300 900H1140L720 0Z"
              fill="url(#paint1_linear_1_1)"
              style={{ originX: "720px", originY: "0px" }}
            />
            <motion.path
              animate={{ opacity: [0.05, 0.15, 0.05], rotate: [0, -8, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              d="M720 0L500 900H940L720 0Z"
              fill="url(#paint2_linear_1_1)"
              style={{ originX: "720px", originY: "0px" }}
            />
          </g>
          <defs>
            <filter
              id="filter0_f_1_1"
              x="-200"
              y="-200"
              width="1840"
              height="1300"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="80"
                result="effect1_foregroundBlur_1_1"
              />
            </filter>
            <linearGradient
              id="paint0_linear_1_1"
              x1="720"
              y1="0"
              x2="720"
              y2="900"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_1_1"
              x1="720"
              y1="0"
              x2="720"
              y2="900"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_1_1"
              x1="720"
              y1="0"
              x2="720"
              y2="900"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0EA5E9" stopOpacity="0.3" />
              <stop offset="1" stopColor="#0EA5E9" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full blur-[1px]"
          initial={{
            x: Math.random() * 2000 - 1000,
            y: Math.random() * 2000 - 1000,
            opacity: 0,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}