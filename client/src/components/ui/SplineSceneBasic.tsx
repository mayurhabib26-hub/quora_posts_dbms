'use client'

import { SplineScene } from "./splite";
import { Card } from "./card"
import { Spotlight } from "./spotlight"
 
export function SplineSceneBasic({ children }: { children?: React.ReactNode }) {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#020617] overflow-hidden -z-10">
      {/* Spline Background */}
      <div className="absolute inset-0 w-full h-full scale-110">
        <SplineScene 
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Dark Overlay for readability - pointer-events-none allows mouse to pass through to Spline */}
      <div className="absolute inset-0 bg-black/60 backdrop-brightness-50 pointer-events-none" />
      
      {/* Content Layer - pointer-events-none to let mouse reach Spline */}
      <div className="relative z-10 w-full h-full flex items-center px-6 md:px-20 lg:px-40 pointer-events-none">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            {/* Form Area - pointer-events-auto to keep it clickable */}
            <div className="w-full md:w-[450px] animate-fade-in pointer-events-auto">
                {children}
            </div>

            {/* Desktop Hero Text - pointer-events-none to let mouse pass to robot */}
            <div className="hidden lg:flex flex-1 flex-col justify-center animate-fade-in pointer-events-none" style={{ animationDelay: '0.2s' }}>
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20"
                    fill="white"
                />
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 leading-tight">
                    Futuristic <br /> <span className="text-blue-500">DBMS Quora</span>
                </h1>
                <p className="mt-6 text-neutral-400 max-w-lg text-xl leading-relaxed">
                    Collaborative learning powered by next-gen AI visuals. 
                    Dive into the world of databases with community support.
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}
