import React, { useState } from 'react';
import { ArrowRight, Sparkles, Mic, ArrowUp } from 'lucide-react';

interface HeroSectionProps {
  onGenerate: (promptText: string) => void;
  onOpenUpload?: () => void;
  activePrompt: string;
  setActivePrompt: (prompt: string) => void;
  onStartCreating?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGenerate,
  onOpenUpload,
  activePrompt,
  setActivePrompt,
  onStartCreating,
}) => {
  const [isListening, setIsListening] = useState(false);

  const collageImages = [
    {
      id: 'collage-1',
      title: 'Cinematic Fashion Portrait',
      tag: 'Photorealism',
      model: 'FLUX.1 Schnell',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
      prompt: 'Cinematic studio portrait of an elegant model in violet iridescent silk lighting, 85mm f/1.4 lens, 8k',
    },
    {
      id: 'collage-2',
      title: 'Cybernetic Snow Leopard',
      tag: 'Wildlife AI',
      model: 'FLUX.1 Schnell',
      url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=85',
      prompt: 'Cybernetic snow leopard with glowing electric sapphire eyes resting on obsidian ledge, volumetric moonlight',
    },
    {
      id: 'collage-3',
      title: 'Floating Lavender Realm',
      tag: 'Fantasy World',
      model: 'FLUX.1 Schnell',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=85',
      prompt: 'Surreal floating crystalline islands with glowing lavender waterfalls cascading into cloud sea, twin moons, 8k',
    },
    {
      id: 'collage-4',
      title: 'Bioluminescent Midnight Lotus',
      tag: 'Botanical 3D',
      model: 'FLUX.1 Schnell',
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=85',
      prompt: 'Bioluminescent midnight lotus blooming in still obsidian water, glowing purple petals, gold stamen dust',
    },
  ];

  const handleStartClick = () => {
    if (onStartCreating) {
      onStartCreating();
    } else {
      const demoElement = document.getElementById('demo') || document.getElementById('showcase');
      demoElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePrompt.trim()) {
      onGenerate(activePrompt);
    }
  };

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setActivePrompt('Glass architectural pavilion inside bioluminescent pine forest at twilight, Octane 8k');
    }, 1200);
  };

  const handleSelectCollageItem = (prompt: string) => {
    setActivePrompt(prompt);
    onGenerate(prompt);
  };

  return (
    <section id="home" className="relative pt-32 sm:pt-40 md:pt-44 pb-20 sm:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description & CTA */}
          <div className="lg:col-span-6 xl:col-span-7 text-left">
            
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131738]/80 border border-[#6366f1]/30 text-xs font-medium text-[#c7d2fe] mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.2)]" id="hero-badge">
              <span className="w-2 h-2 rounded-full bg-[#818cf8] animate-pulse" />
              <span>Next-Generation Neural Synthesis</span>
              <span className="text-[#a5b4fc] text-xs font-semibold px-1.5 py-0.2 rounded bg-[#4f46e5]/40 border border-[#6366f1]/40 ml-1">v2.4</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6" id="hero-heading">
              Create amazing{' '}
              <span className="bg-gradient-to-r from-[#60a5fa] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(129,140,248,0.45)]">
                photos
              </span>{' '}
              with the power of AI
            </h1>

            {/* Short Description */}
            <p className="text-base sm:text-lg md:text-xl text-[#94a3b8] max-w-2xl mb-8 leading-relaxed font-normal" id="hero-subheading">
              Transform simple prompts into hyper-realistic photography, cinematic art, and high-fidelity graphics in seconds with state-of-the-art diffusion models.
            </p>

            {/* Prominent CTA Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                onClick={handleStartClick}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-base font-semibold rounded-full text-white bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] border border-white/20 shadow-[0_8px_28px_rgba(99,102,241,0.5)] hover:shadow-[0_12px_36px_rgba(124,58,237,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200 cursor-pointer group"
                id="btn-start-creating-hero"
              >
                <span>Start creating for free</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Fast Interactive Prompt Input Bar */}
            <div id="demo" className="w-full max-w-xl bg-[#090c22]/90 backdrop-blur-xl border border-white/10 hover:border-[#6366f1]/40 rounded-2xl p-2.5 sm:p-3 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.8),0_0_24px_rgba(99,102,241,0.15)] transition-all">
              <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                <div className="pl-2.5 text-[#818cf8]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={activePrompt}
                  onChange={(e) => setActivePrompt(e.target.value)}
                  placeholder="Describe anything: Cyberpunk runner in neon rain, 8k portrait..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm placeholder:text-[#64748b] focus:ring-0"
                  id="hero-quick-prompt-input"
                />
                
                <button
                  type="button"
                  onClick={handleMicClick}
                  title="Voice Prompt"
                  className={`p-2 rounded-xl transition-colors ${
                    isListening ? 'bg-[#6366f1] text-white animate-pulse' : 'text-[#64748b] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:from-[#4f46e5] hover:to-[#6d28d9] shadow-[0_0_16px_rgba(99,102,241,0.5)] transition-all cursor-pointer active:scale-95"
                  id="hero-quick-generate-btn"
                >
                  <span>Generate</span>
                  <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: 2×2 Collage of Stunning AI-Generated Images */}
          <div className="lg:col-span-6 xl:col-span-5 relative">
            
            {/* Ambient Background Aura behind the collage */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#6366f1]/20 via-[#a855f7]/15 to-transparent rounded-[32px] blur-2xl -z-10" />

            <div className="grid grid-cols-2 gap-3.5 sm:gap-4.5" id="hero-image-collage">
              {collageImages.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => handleSelectCollageItem(img.prompt)}
                  className={`group relative overflow-hidden rounded-2xl bg-[#090b1c] border transition-all duration-300 cursor-pointer shadow-[0_12px_28px_rgba(0,0,0,0.6)] ${
                    idx === 0
                      ? 'border-[#818cf8]/40 shadow-[0_0_25px_rgba(99,102,241,0.25)]'
                      : 'border-white/10 hover:border-[#818cf8]/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]'
                  } ${idx === 1 ? 'translate-y-2' : ''} ${idx === 2 ? '-translate-y-2' : ''}`}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060818] via-[#060818]/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                    {/* Top Pill Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#090b1c]/80 backdrop-blur-md text-[#c7d2fe] border border-white/10">
                        {img.tag}
                      </span>
                    </div>

                    {/* Bottom Metadata & Prompt Preview */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-3.5 text-left transform transition-transform duration-300">
                      <div className="text-xs sm:text-sm font-semibold text-white truncate mb-0.5">
                        {img.title}
                      </div>
                      <div className="text-[10px] text-[#94a3b8] line-clamp-1 group-hover:text-[#c7d2fe]">
                        {img.prompt}
                      </div>
                      <div className="mt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-[#818cf8] font-medium flex items-center gap-1">
                          <span>Use Prompt</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        <span className="text-[9px] font-mono text-[#64748b]">
                          {img.model}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating indicator badge */}
            <div className="absolute -bottom-5 -right-3 hidden sm:flex items-center gap-3 bg-[#0a0d26]/90 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-2.5 shadow-2xl">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-white">100% Generated by AI</div>
                <div className="text-[10px] text-[#94a3b8]">FLUX.1 Schnell Diffusion Engine</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
