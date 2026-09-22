import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  Layers,
  Wand2,
  RefreshCw,
  Eye,
  Check,
  Zap,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

interface ProductShowcaseProps {
  onTryImageToImage?: () => void;
  onOpenUpload?: () => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  onTryImageToImage,
  onOpenUpload,
}) => {
  const [activePreset, setActivePreset] = useState<'cyber' | 'cinematic' | 'art' | 'scifi'>('cyber');
  const [sliderPosition, setSliderPosition] = useState(55);
  const [isHoveringMockup, setIsHoveringMockup] = useState(false);

  const presets = [
    {
      id: 'cyber',
      name: 'Cyberpunk Neon',
      prompt: 'Cybernetic chrome augmentations, neon indigo backlighting, reflective obsidian rain sheen, 8k',
      denoise: '0.68',
      transformedUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=85',
      originalUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    },
    {
      id: 'cinematic',
      name: 'Cinematic Noir',
      prompt: '35mm anamorphic film still, moody amber shadows, high-contrast rim lighting, cinematic grain',
      denoise: '0.52',
      transformedUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85',
      originalUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85',
    },
    {
      id: 'art',
      name: 'Fine Art Impasto',
      prompt: 'Vibrant oil impasto brushstrokes, textured canvas palette knife technique, glowing violet hues',
      denoise: '0.80',
      transformedUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=85',
      originalUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85',
    },
    {
      id: 'scifi',
      name: 'Cosmic Hologram',
      prompt: 'Volumetric holographic projection, luminous star particles, zero-gravity atmosphere',
      denoise: '0.74',
      transformedUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85',
      originalUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=85',
    },
  ];

  const currentPresetData = presets.find((p) => p.id === activePreset) || presets[0];

  const handleActionClick = () => {
    if (onTryImageToImage) {
      onTryImageToImage();
    } else if (onOpenUpload) {
      onOpenUpload();
    } else {
      const demoEl = document.getElementById('demo') || document.getElementById('possibilities-studio');
      demoEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="showcase" className="relative py-20 sm:py-32 overflow-hidden border-t border-b border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#4f46e5]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#7c3aed]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Text & Features */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141738]/80 border border-[#6366f1]/30 text-xs font-semibold text-[#c7d2fe] mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Multi-Condition Latent Conditioning</span>
            </div>

            {/* Requested Text: "Image to Images" */}
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.12]" id="showcase-heading">
              Image to Images
            </h2>

            <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed mb-8">
              Feed an existing photo, preliminary rough sketch, or 3D viewport capture, and direct the neural engine to reimagine lighting, character costume, artistic medium, or cinematic angle while preserving the fundamental composition.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-4 mb-9">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#818cf8] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Structural Pose & Geometry Retention</h4>
                  <p className="text-xs text-[#94a3b8] leading-normal mt-0.5">
                    Locks contours, facial angles, and focal focal planes while restyling palettes and ambient shaders.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#818cf8] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Variable Denoising & Guidance Dial</h4>
                  <p className="text-xs text-[#94a3b8] leading-normal mt-0.5">
                    Tweak latent freedom from 0.1 (subtle retouching) to 0.95 (radical stylistic metamorphosis).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#818cf8] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Instant Prompt-Driven Texture Replacement</h4>
                  <p className="text-xs text-[#94a3b8] leading-normal mt-0.5">
                    Swap daytime sunlight for moody neon rain, concrete for polished obsidian, or cotton for silk.
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={handleActionClick}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold rounded-full text-white bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] border border-white/20 shadow-[0_8px_24px_rgba(99,102,241,0.45)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.65)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-95"
              id="btn-try-image-to-image"
            >
              <span>Try Image to Image</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: Visual UI Mockup */}
          <div className="lg:col-span-7">
            <div className="relative bg-[#080a1e]/90 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.2)]">
              
              {/* Mockup Window Top Navigation Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
                  <span className="w-3 h-3 rounded-full bg-[#10b981]/80" />
                  <span className="ml-2 text-xs font-mono text-[#94a3b8]">mage-pro://engine/img2img</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#13173d] border border-white/10 text-[11px] font-mono text-[#a5b4fc]">
                    <Sliders className="w-3 h-3 text-[#818cf8]" />
                    <span>Denoise: {currentPresetData.denoise}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#10b981]/15 border border-[#10b981]/30 text-[10px] font-semibold text-[#34d399]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                    Live
                  </span>
                </div>
              </div>

              {/* Style Presets Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setActivePreset(preset.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      activePreset === preset.id
                        ? 'bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                        : 'bg-[#101436] hover:bg-[#1a1f4e] text-[#94a3b8] hover:text-white border border-white/5'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Interactive Before/After Split Preview Canvas */}
              <div
                className="relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 select-none cursor-ew-resize group"
                onMouseEnter={() => setIsHoveringMockup(true)}
                onMouseLeave={() => setIsHoveringMockup(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                  setSliderPosition(Math.round((x / rect.width) * 100));
                }}
              >
                {/* Transformed Image (Full background) */}
                <img
                  src={currentPresetData.transformedUrl}
                  alt="Transformed AI output"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Original Image (Clipped by slider position) */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={currentPresetData.originalUrl}
                    alt="Original reference"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  {/* Subtle Darkening Overlay */}
                  <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                </div>

                {/* Vertical Divider Line with handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_#ffffff] z-10 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0a0d24] border-2 border-white flex items-center justify-center shadow-xl text-white">
                    <span className="text-[10px] font-bold">⇄</span>
                  </div>
                </div>

                {/* Floating Tags */}
                <div className="absolute top-3 left-3 z-20 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-[#090b1c]/80 backdrop-blur-md text-white border border-white/10">
                    Original Reference
                  </span>
                </div>
                <div className="absolute top-3 right-3 z-20 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-[#6366f1]/90 backdrop-blur-md text-white border border-white/20 shadow-lg">
                    AI Reimagined (FLUX.1)
                  </span>
                </div>

                {/* Bottom Prompt Bar inside Preview */}
                <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
                  <div className="p-2.5 rounded-xl bg-[#07091c]/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#818cf8] shrink-0" />
                      <span className="text-[#c7d2fe] truncate font-mono text-[11px]">
                        "{currentPresetData.prompt}"
                      </span>
                    </div>
                    <span className="text-[10px] text-[#94a3b8] shrink-0 font-medium hidden sm:inline">
                      Drag to compare
                    </span>
                  </div>
                </div>
              </div>

              {/* Mockup Lower Control Bar */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-[#94a3b8] gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#c7d2fe]">
                    <Zap className="w-3.5 h-3.5 text-[#818cf8]" />
                    <span>Latency: 1.28s</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#64748b]">|</span>
                  <span className="font-mono text-[11px] text-[#94a3b8]">Resolution: 1024 × 1024</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSliderPosition(sliderPosition === 0 ? 100 : 0)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer text-[11px] font-medium"
                  >
                    Toggle Full View
                  </button>
                  <button
                    onClick={handleActionClick}
                    className="px-3 py-1 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-colors cursor-pointer text-[11px] font-semibold"
                  >
                    Open Studio
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
