import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface CtaSectionProps {
  onStartCreating: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onStartCreating }) => {
  return (
    <section id="pricing" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dark navy/black card with subtle purple-blue gradients */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e1236]/90 via-[#090b20]/95 to-[#060818] border border-[#6366f1]/30 p-8 sm:p-14 md:p-16 text-center shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.2)]" id="cta-card">
          
          {/* Subtle neon center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-[radial-gradient(circle,rgba(99,102,241,0.25)_0%,transparent_70%)] blur-[80px] pointer-events-none" />

          {/* Background Ambient Streaks */}
          <div className="absolute -top-24 left-1/4 w-96 h-[1px] bg-gradient-to-r from-transparent via-[#818cf8]/40 to-transparent rotate-12 blur-[0.5px]" />
          <div className="absolute -bottom-24 right-1/4 w-96 h-[1px] bg-gradient-to-r from-transparent via-[#c084fc]/30 to-transparent -rotate-12 blur-[0.5px]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181d4a] border border-[#6366f1]/40 text-xs font-semibold text-[#c7d2fe] mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Ready in under 30 seconds</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl font-bold text-white leading-[1.15] mb-5 tracking-tight" id="cta-heading">
              Your next great visual<br />
              <span className="bg-gradient-to-r from-[#818cf8] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                is one prompt away.
              </span>
            </h2>

            {/* Supporting text */}
            <p className="text-sm sm:text-base md:text-lg text-[#94a3b8] mb-8 font-normal leading-relaxed">
              Join thousands of creators, digital artists, and production studios leveraging SS AI to render imagination into reality.
            </p>

            {/* Bright indigo/purple accent button */}
            <div className="inline-block mb-6">
              <button
                onClick={onStartCreating}
                className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] border border-white/25 shadow-[0_8px_30px_rgba(99,102,241,0.5)] hover:shadow-[0_12px_45px_rgba(124,58,237,0.75)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                id="btn-start-creating-cta"
              >
                <span>Create free account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Subtext info */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#94a3b8]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#818cf8]" />
                No credit card required
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#818cf8]" />
                50 free daily FLUX.1 generations
              </span>
              <span>•</span>
              <span>Commercial usage license</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
