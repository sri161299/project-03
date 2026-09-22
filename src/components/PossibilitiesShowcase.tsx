import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Sliders,
  Maximize2,
  RefreshCw,
  Cpu,
  Download,
  Wand2,
  Sparkles,
  ArrowRight,
  Split,
  Eye,
  Check,
  AlertCircle,
  Copy,
  Plus,
  Layers,
  Camera,
} from 'lucide-react';
import { DEFAULT_GENERATION_VARIANTS } from '../data/mockData';
import { GenerationVariant, GeneratedImage } from '../types';

interface PossibilitiesShowcaseProps {
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: (prompt: string, aspectRatio?: string, imageSize?: string) => Promise<void>;
  onEditImage: (prompt: string, imageBase64: string, mimeType?: string) => Promise<void>;
  activeGeneratedImage: GeneratedImage | null;
  generatedHistory: GeneratedImage[];
  onSelectHistoryImage: (img: GeneratedImage) => void;
  error: string | null;
  onClearError: () => void;
  onInspectVariant: (variant: GenerationVariant | GeneratedImage) => void;
  onOpenUpload: () => void;
  activeProvider?: string;
  activeModel?: string;
  onOpenSettings?: () => void;
  onSwitchToLocal?: () => void;
}

export const PossibilitiesShowcase: React.FC<PossibilitiesShowcaseProps> = ({
  currentPrompt,
  setCurrentPrompt,
  isGenerating,
  onGenerate,
  onEditImage,
  activeGeneratedImage,
  generatedHistory,
  onSelectHistoryImage,
  error,
  onClearError,
  onInspectVariant,
  onOpenUpload,
  activeProvider = 'huggingface',
  activeModel = 'black-forest-labs/FLUX.1-schnell',
  onOpenSettings,
  onSwitchToLocal,
}) => {
  const [activeAspect, setActiveAspect] = useState<string>('1:1');
  const [activeImageSize, setActiveImageSize] = useState<string>('1K');
  const [showEditInput, setShowEditInput] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'focused'>('grid');

  // Generation telemetry animation
  const [telemetryStep, setTelemetryStep] = useState(0);
  const telemetrySteps =
    activeProvider === 'gemini'
      ? [
          'Initializing Gemini multimodal latent vectors...',
          'Tokenizing prompt vectors & synthesis graph...',
          'Rendering neural diffusion layers...',
          'Applying lossless color grading...',
        ]
      : activeProvider === 'local'
      ? [
          'Initializing local generative geometry...',
          'Computing spatial vectors and chromatic gradients...',
          'Synthesizing procedural cyberpunk artwork...',
        ]
      : activeProvider === 'pollinations'
      ? [
          'Connecting to Pollinations.AI API...',
          'Dispatching prompt to FLUX.1 Schnell engine...',
          'Synthesizing latent neural diffusion steps...',
          'Encoding lossless high-fidelity raster output...',
        ]
      : [
          'Connecting to image generation API...',
          'Dispatching request to FLUX.1-schnell...',
          'Denoising diffusion latents (4-step fast sampling)...',
          'Encoding lossless high-fidelity raster output...',
        ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setTelemetryStep(0);
      interval = setInterval(() => {
        setTelemetryStep((prev) => (prev + 1) % telemetrySteps.length);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleDownload = (imgUrl: string, filename = 'archai-creation.png') => {
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExecuteEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim() || !activeGeneratedImage) return;
    await onEditImage(editPrompt.trim(), activeGeneratedImage.imageUrl);
    setShowEditInput(false);
    setEditPrompt('');
  };

  // Preset quick edit suggestions
  const editSuggestions = [
    'Transform into futuristic cyberpunk neon with glowing rain reflections',
    'Change time to magical sunset golden hour with volumetric god rays',
    'Add bioluminescent glowing butterfly wings and ethereal floating embers',
    'Convert to an ultra-detailed cinematic oil painting with rich textures',
  ];

  return (
    <section id="generate" className="relative py-20 sm:py-32">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] bg-[radial-gradient(circle,rgba(117,104,255,0.13)_0%,rgba(85,69,255,0.04)_50%,transparent_75%)] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5545ff]/15 border border-[#7568ff]/30 text-xs font-semibold text-[#c4bdff] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#9f94ff]" />
            <span>
              Powered by{' '}
              {activeProvider === 'pollinations'
                ? 'Pollinations.AI'
                : activeProvider === 'gemini'
                ? 'Google Gemini'
                : activeProvider === 'local'
                ? 'Local Synthesizer'
                : 'Pollinations.AI'}
            </span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-5xl md:text-6xl font-normal text-white leading-[1.15] mb-4">
            Live AI Studio &<br />
            <span className="text-[#e2ddff]">Creative Image Engine</span>
          </h2>
          <p className="text-base sm:text-lg text-[#c5c3e6] max-w-2xl mx-auto font-light leading-relaxed">
            Generate new visuals from text prompts or transform existing images with provider-agnostic inference.
          </p>
        </div>

        {/* Studio Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Main Studio Canvas (Left, 8 cols) */}
          <div className="lg:col-span-8 bg-[#12142e]/80 backdrop-blur-2xl border border-[#7864ff]/25 rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(85,69,255,0.18)] relative">
            
            {/* Top Bar with Status Badge & Model Information */}
            <div className="flex items-center justify-between border-b border-[#7864ff]/15 pb-4 mb-5 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-xs font-mono text-[#8b8ea8]">arch-ai://engine/{activeProvider}</span>
              </div>

              <div className="flex items-center gap-2">
                {onOpenSettings && (
                  <button
                    onClick={onOpenSettings}
                    className="p-1 rounded-lg text-[#8b8ea8] hover:text-[#c4bdff] hover:bg-[#5545ff]/20 transition-colors"
                    title="Change Provider"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#5545ff]/20 border border-[#7568ff]/35 text-xs font-medium text-[#c4bdff]">
                  <span className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-[#ffb443] animate-ping' : 'bg-[#7568ff] shadow-[0_0_8px_#7568ff]'}`} />
                  <span className="font-mono text-[11px]">
                    {isGenerating
                      ? `Synthesizing with ${activeProvider}...`
                      : `Ready • ${activeModel.split('/').pop() || activeModel}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Banner if any */}
            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-[#260f1b]/95 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-3 animate-fade-in shadow-lg">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-red-300 mb-1 flex items-center gap-2">
                    <span>Provider Notice</span>
                    {error.includes('credits have been exhausted') && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-[10px] text-red-300 border border-red-500/30">
                        Credits Exhausted
                      </span>
                    )}
                    {(error.includes('authentication is missing') ||
                      error.includes('authentication is required') ||
                      error.includes('authentication')) && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] text-amber-300 border border-amber-500/30">
                        Authentication Required
                      </span>
                    )}
                    {error.includes('temporarily unavailable') && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] text-amber-300 border border-amber-500/30">
                        Service Unavailable
                      </span>
                    )}
                    {error.includes('editing is not supported') && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-[10px] text-blue-300 border border-blue-500/30">
                        Text-to-Image Only
                      </span>
                    )}
                  </div>
                  <div className="text-red-200/90 leading-relaxed mb-3">{error}</div>

                  {/* Quick Action Helpers */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {onSwitchToLocal && activeProvider !== 'local' && (
                      <button
                        type="button"
                        onClick={onSwitchToLocal}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#5545ff] hover:bg-[#6c5eff] text-white transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(85,69,255,0.4)] cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Switch to Local Synthesizer (Instant Demo)</span>
                      </button>
                    )}
                    {onOpenSettings && (
                      <button
                        type="button"
                        onClick={onOpenSettings}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#1a1c3d] hover:bg-[#252854] text-[#c4bdff] border border-[#7864ff]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5 text-[#8c78ff]" />
                        <span>Configure Providers</span>
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClearError}
                  className="text-red-300 hover:text-white text-xs underline cursor-pointer shrink-0 ml-2"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Active Prompt & Generator Input */}
            <div className="bg-[#090a18]/85 border border-[#7864ff]/25 rounded-2xl p-4 sm:p-5 mb-5 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7568ff] flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  Active Prompt
                </span>
                <span className="text-[10px] font-mono text-[#8c8fa9]">Model: {activeModel}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  placeholder="Describe an image to generate..."
                  className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-[#f1efff] placeholder:text-[#555873] focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => onGenerate(currentPrompt, activeAspect, activeImageSize)}
                  disabled={isGenerating || !currentPrompt.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#5545ff] to-[#7568ff] hover:from-[#6555ff] hover:to-[#8578ff] text-white shadow-[0_0_15px_rgba(85,69,255,0.4)] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {/* Generating Live Feedback State */}
            {isGenerating && (
              <div className="mb-6 p-5 rounded-2xl bg-[#090b1c]/90 border border-[#7864ff]/35 animate-fade-in shadow-[0_0_30px_rgba(85,69,255,0.25)]">
                <div className="flex justify-between text-xs text-[#c5c2ee] mb-2 font-mono">
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#8c7bff] animate-spin" />
                    <span className="font-semibold text-[#dedbff]">{telemetrySteps[telemetryStep]}</span>
                  </span>
                  <span className="text-[#a79cff]">Processing...</span>
                </div>

                <div className="w-full h-2 bg-[#1e2044] rounded-full overflow-hidden p-0.5 border border-[#7864ff]/30">
                  <div className="h-full bg-gradient-to-r from-[#5545ff] via-[#9b8eff] to-[#7568ff] rounded-full shadow-[0_0_15px_rgba(117,104,255,0.9)] animate-pulse" style={{ width: '85%' }} />
                </div>
              </div>
            )}

            {/* VIEW MODE TOGGLE (When an image has been generated) */}
            {activeGeneratedImage && (
              <div className="flex items-center justify-between gap-2 mb-3 px-1">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090b1c] border border-[#7864ff]/25 text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-[#5545ff] text-white shadow-sm'
                        : 'text-[#c5c2ee] hover:text-white'
                    }`}
                  >
                    1 Variant
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('focused')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                      viewMode === 'focused'
                        ? 'bg-[#5545ff] text-white shadow-sm'
                        : 'text-[#c5c2ee] hover:text-white'
                    }`}
                  >
                    Focused View
                  </button>
                </div>
                <div className="text-[11px] text-[#9a97c4] hidden sm:block">
                  Click any variant to inspect in full resolution
                </div>
              </div>
            )}

            {/* MAIN IMAGE DISPLAY AREA */}
            <div className="relative rounded-2xl overflow-hidden border border-[#7864ff]/30 bg-[#070817] mb-5 group min-h-[320px] flex items-center justify-center">
              {activeGeneratedImage && viewMode === 'focused' ? (
                // REAL GENERATED / EDITED IMAGE DISPLAY (FOCUSED)
                <div className="relative w-full h-full flex flex-col items-center">
                  <div className="relative w-full max-h-[500px] flex items-center justify-center bg-black/40">
                    <img
                      src={showOriginal && activeGeneratedImage.originalImageUrl ? activeGeneratedImage.originalImageUrl : activeGeneratedImage.imageUrl}
                      alt={activeGeneratedImage.prompt}
                      className="max-h-[480px] w-auto object-contain rounded-xl shadow-2xl transition-all"
                    />

                    {/* Badge: Generated vs Edited */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#050611]/80 backdrop-blur-md text-[11px] font-semibold text-[#dedbff] border border-[#7864ff]/40 flex items-center gap-1.5 shadow-lg">
                        {activeGeneratedImage.isEdited ? (
                          <>
                            <Sparkles className="w-3 h-3 text-[#ffbd2e]" />
                            <span>AI Edited {showOriginal ? '(Original)' : '(Gemini)'}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-[#7568ff]" />
                            <span>
                              {activeGeneratedImage.provider === 'pollinations'
                                ? 'Generated with Pollinations (FLUX.1)'
                                : activeGeneratedImage.provider === 'local'
                                ? 'Generated by Local Synthesizer'
                                : activeGeneratedImage.provider === 'gemini'
                                ? 'Generated by Gemini 3.1'
                                : 'Generated with AI'}
                            </span>
                          </>
                        )}
                      </span>

                      {activeGeneratedImage.isEdited && activeGeneratedImage.originalImageUrl && (
                        <button
                          type="button"
                          onClick={() => setShowOriginal(!showOriginal)}
                          className="px-2.5 py-1 rounded-full bg-[#181a38]/90 text-[10px] font-mono text-[#c4bdff] hover:text-white border border-[#7864ff]/40 flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Split className="w-3 h-3" />
                          <span>{showOriginal ? 'View Edited' : 'View Original'}</span>
                        </button>
                      )}
                    </div>

                    {/* Quick action overlay buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(activeGeneratedImage.prompt)}
                        title="Copy prompt"
                        className="p-2 rounded-xl bg-[#090b1c]/80 backdrop-blur-md text-[#d6d5ef] hover:text-white border border-white/10 hover:border-[#7864ff]/50 transition-all cursor-pointer"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(activeGeneratedImage.imageUrl, `archai-${activeGeneratedImage.id}.png`)}
                        title="Download full resolution"
                        className="p-2 rounded-xl bg-[#090b1c]/80 backdrop-blur-md text-[#d6d5ef] hover:text-white border border-white/10 hover:border-[#7864ff]/50 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onInspectVariant(activeGeneratedImage)}
                        title="Fullscreen view"
                        className="p-2 rounded-xl bg-[#5545ff] text-white shadow-[0_0_12px_rgba(85,69,255,0.6)] hover:bg-[#6859ff] transition-all cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata & Edit Toolbar */}
                  <div className="w-full p-4 bg-[#090a1c] border-t border-[#7864ff]/20 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-[#a9a7c9] max-w-md truncate">
                      <span className="font-semibold text-white">Prompt: </span>
                      "{activeGeneratedImage.prompt}"
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowEditInput(!showEditInput)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#5545ff]/25 hover:bg-[#5545ff]/40 text-[#dedbff] hover:text-white border border-[#7864ff]/40 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-[#9f94ff]" />
                        <span>{showEditInput ? 'Cancel Edit' : 'Edit This Image'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // SINGLE VARIANT PREVIEW
                <div className="w-full p-3 sm:p-5 flex justify-center">
                  <div className="w-full max-w-2xl">
                    {[
                      {
                        id: generatedHistory[0]?.id || DEFAULT_GENERATION_VARIANTS[0].id,
                        label: generatedHistory[0] ? 'Generated Output' : DEFAULT_GENERATION_VARIANTS[0].label,
                        imageUrl: generatedHistory[0]?.imageUrl || DEFAULT_GENERATION_VARIANTS[0].imageUrl,
                        resolution: generatedHistory[0]
                          ? `${generatedHistory[0].aspectRatio || activeAspect} · ${generatedHistory[0].imageSize || activeImageSize}`
                          : DEFAULT_GENERATION_VARIANTS[0].resolution,
                        isGenerated: Boolean(generatedHistory[0]),
                      },
                    ].map((variant, index) => (
                      <div
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariantIndex(index);
                          if (generatedHistory[index]) {
                            onSelectHistoryImage(generatedHistory[index]);
                          } else {
                            onInspectVariant(variant);
                          }
                        }}
                        className={`group relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                          selectedVariantIndex === index
                            ? 'border-[#7568ff] shadow-[0_0_28px_rgba(117,104,255,0.45)]'
                            : 'border-[#7864ff]/25 hover:border-[#8c78ff]/60'
                        }`}
                      >
                        <img
                          src={variant.imageUrl}
                          alt={variant.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-[#050611]/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#dedbff] border border-white/10 flex items-center gap-1.5 shadow-md">
                          {variant.isGenerated && <Sparkles className="w-3 h-3 text-[#8c78ff]" />}
                          <span>{variant.label}</span>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-[#03040d]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                          <span className="text-xs text-[#d6d5ef] font-mono">{variant.resolution}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onInspectVariant(variant);
                            }}
                            className="p-1.5 rounded-lg bg-[#5545ff] text-white hover:bg-[#6859ff] transition-all cursor-pointer shadow-lg"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* INLINE IMAGE EDITING INTERFACE */}
            {showEditInput && activeGeneratedImage && (
              <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-[#10122e] border border-[#7864ff]/40 animate-fade-in shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#8c78ff]" />
                  <h4 className="text-sm font-semibold text-white">
                    Edit Image with gemini-3.1-flash-image-preview
                  </h4>
                </div>
                <p className="text-xs text-[#9d9bb8] mb-3">
                  Describe the modifications you want to apply to this image. Gemini will synthesize the edited result while preserving key composition.
                </p>

                <form onSubmit={handleExecuteEdit} className="space-y-3">
                  <div className="flex items-center gap-2 bg-[#08091a] border border-[#7864ff]/30 rounded-xl px-3 py-2">
                    <input
                      type="text"
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="e.g. Add glowing neon violet wings, change background to a futuristic skyline..."
                      className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder:text-[#555873]"
                    />
                    <button
                      type="submit"
                      disabled={isGenerating || !editPrompt.trim()}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#5545ff] to-[#7568ff] text-white shadow disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply Edit</span>
                    </button>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEditPrompt(sug)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#090b1c] hover:bg-[#1a1d3f] border border-white/10 text-[#b5b3d6] hover:text-white transition-colors cursor-pointer text-left truncate max-w-full"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </form>
              </div>
            )}

            {/* Session Generation History Carousel */}
            {generatedHistory.length > 0 && (
              <div className="pt-4 border-t border-[#7864ff]/15">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold text-[#8c8fa9] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Session Generations ({generatedHistory.length})
                  </span>
                  <span className="text-[10px] text-[#6e718d]">Click to view & edit</span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {generatedHistory.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectHistoryImage(item)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                        activeGeneratedImage?.id === item.id
                          ? 'border-[#7568ff] ring-2 ring-[#7568ff]/40 scale-105'
                          : 'border-white/10 opacity-70 hover:opacity-100 hover:border-[#7864ff]/60'
                      }`}
                    >
                      <img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-cover" />
                      {item.isEdited && (
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#7568ff] shadow-[0_0_6px_#7568ff]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Showcase Card: Engine Tuning & Instant Controls (4 cols) */}
          <div className="lg:col-span-4 bg-[#12142e]/80 backdrop-blur-2xl border border-[#7864ff]/25 rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(85,69,255,0.18)] flex flex-col justify-between space-y-6">
            
            <div>
              {/* Feature Icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5545ff]/30 to-[#7568ff]/10 border border-[#7864ff]/40 flex items-center justify-center text-[#9f94ff] shadow-[0_0_20px_rgba(85,69,255,0.3)] mb-5">
                <Zap className="w-6 h-6 stroke-[2]" />
              </div>

              {/* Title & Description */}
              <h3 className="font-serif-display text-2xl sm:text-3xl font-medium text-white mb-2">
                Instant Results
              </h3>
              <p className="text-sm text-[#c4c2e6] leading-relaxed mb-6 font-light">
                Direct generation powered by Google's native Gemini image engine with multi-modal editing capabilities.
              </p>

              {/* Engine Tuning Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#8c8fa9]">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#7568ff]" />
                    Engine Parameters
                  </span>
                  <span className="font-mono text-[#a79cff]">gemini-3.1-flash</span>
                </div>

                {/* Aspect Ratio Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#8c8fa9] uppercase mb-1.5">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {['1:1', '16:9', '9:16', '3:4', '4:3'].map((asp) => (
                      <button
                        key={asp}
                        type="button"
                        onClick={() => setActiveAspect(asp)}
                        className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                          activeAspect === asp
                            ? 'bg-[#5545ff]/35 border-[#7568ff] text-white shadow-[0_0_10px_rgba(85,69,255,0.4)]'
                            : 'bg-[#090b1c]/60 border-white/10 text-[#8b8ea8] hover:text-white'
                        }`}
                      >
                        {asp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resolution / Image Size */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#8c8fa9] uppercase mb-1.5">
                    Image Resolution
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['1K', '2K'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setActiveImageSize(size)}
                        className={`py-2 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                          activeImageSize === size
                            ? 'bg-[#5545ff]/35 border-[#7568ff] text-white shadow-[0_0_10px_rgba(85,69,255,0.4)]'
                            : 'bg-[#090b1c]/60 border-white/10 text-[#8b8ea8] hover:text-white'
                        }`}
                      >
                        {size} Ultra-HD
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload & Edit Reference Shortcut */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenUpload}
                    className="w-full py-2.5 rounded-xl border border-dashed border-[#7864ff]/40 hover:border-[#8c78ff] bg-[#121430]/60 hover:bg-[#1a1c44]/80 text-xs font-medium text-[#d6d5ef] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#a79cff]" />
                    <span>Upload & Edit Reference Photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-[#7864ff]/15">
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  &lt; 1.2<span className="text-[#7568ff] text-base">s</span>
                </div>
                <div className="text-xs text-[#8c8fa9] mt-0.5">Flash Latency</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {activeImageSize}<span className="text-[#7568ff] text-base">+</span>
                </div>
                <div className="text-xs text-[#8c8fa9] mt-0.5">Native Output</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
