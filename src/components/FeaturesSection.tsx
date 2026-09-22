import React from 'react';
import { Zap, Layers, CloudDownload, Sparkles, ArrowRight, Gauge, Cpu, CheckCircle2 } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 'feature-speed',
      title: 'Built for speed',
      description:
        'Generate high-resolution 4K imagery in under 1.5 seconds powered by accelerated FLUX.1 tensor cores and low-latency edge inference.',
      icon: Zap,
      metric: '< 1.5s',
      metricLabel: 'Inference latency',
      tag: 'Accelerated',
    },
    {
      id: 'feature-models',
      title: '10+ AI models',
      description:
        'Switch seamlessly between FLUX.1 Schnell, Midjourney-grade photorealism, SDXL, and domain-tuned cinematic style architectures.',
      icon: Layers,
      metric: '10+ Models',
      metricLabel: 'Continuous updates',
      tag: 'Multi-Engine',
    },
    {
      id: 'feature-downloads',
      title: 'Downloads required',
      description:
        'Zero bulky local downloads required — run multi-gigabyte neural diffusion pipelines entirely in the cloud directly inside your browser.',
      icon: CloudDownload,
      metric: '100% Cloud',
      metricLabel: 'Zero local setup',
      tag: 'Serverless',
    },
    {
      id: 'feature-use-cases',
      title: 'Works for all use cases',
      description:
        'From high-fashion lookbooks and AAA game concept art to marketing campaigns, product staging, and surreal fantasy worlds.',
      icon: Sparkles,
      metric: '40k+ Creators',
      metricLabel: 'Across 120+ industries',
      tag: 'Universal',
    },
  ];

  return (
    <section id="features" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background radial gradient accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#6366f1]/10 via-[#a855f7]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111438]/80 border border-[#6366f1]/30 text-xs font-semibold text-[#c7d2fe] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8]" />
            <span>Architecture & Capabilities</span>
          </div>

          {/* Centered Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5 leading-tight" id="features-heading">
            A fully integrated suite of image-generation tools
          </h2>

          <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed">
            Everything creative teams, designers, and digital studios need to conceptualize, iterate, and export production-grade visual assets without friction.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="features-cards-grid">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative bg-[#090b20]/80 hover:bg-[#0e1232]/90 border border-white/10 hover:border-[#818cf8]/50 rounded-2xl p-6 sm:p-7 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_36px_-6px_rgba(99,102,241,0.25)] hover:-translate-y-1 flex flex-col justify-between"
                id={`feature-card-${idx}`}
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#6366f1]/5 rounded-bl-full pointer-events-none group-hover:bg-[#6366f1]/15 transition-colors" />

                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1b1f48] to-[#2b2766] border border-[#6366f1]/30 flex items-center justify-center text-[#818cf8] shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:scale-105 group-hover:border-[#818cf8]/60 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#161a40] text-[#a5b4fc] border border-white/5">
                      {feature.tag}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-[#c7d2fe] transition-colors">
                    {feature.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-sm text-[#94a3b8] leading-relaxed mb-6 font-normal">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Metric Strip */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold text-white font-mono">{feature.metric}</div>
                    <div className="text-[11px] text-[#64748b]">{feature.metricLabel}</div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[#64748b] group-hover:text-[#818cf8] group-hover:bg-[#818cf8]/10 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
