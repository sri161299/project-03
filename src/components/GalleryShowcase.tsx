import React, { useState } from 'react';
import { Sparkles, Maximize2, Copy, Check, ArrowRight, Wand2 } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/mockData';
import { GalleryItem } from '../types';

interface GalleryShowcaseProps {
  onSelectPrompt: (prompt: string) => void;
  onOpenLightbox: (item: GalleryItem) => void;
}

export const GalleryShowcase: React.FC<GalleryShowcaseProps> = ({
  onSelectPrompt,
  onOpenLightbox,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Animals',
    'Fantasy Characters',
    'Landscapes',
    'Flowers',
    'Abstract Art',
  ];

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const handleCopyPrompt = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.prompt);
    setCopiedId(item.id);
    onSelectPrompt(item.prompt);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(168,85,247,0.06)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111438]/80 border border-[#6366f1]/30 text-xs font-semibold text-[#c7d2fe] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
            <span>Community Creations</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5 leading-tight" id="gallery-heading">
            Stunning Gallery of AI Masterpieces
          </h2>

          <p className="text-base sm:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Browse through community generations across diverse visual aesthetics, prompt architectures, and photorealistic lighting conditions.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap mt-8" id="gallery-filter-chips">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white shadow-[0_0_18px_rgba(99,102,241,0.5)] border border-white/20'
                    : 'bg-[#0d102e]/80 text-[#94a3b8] hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Uniform Symmetrical Grid Arrangement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5" id="gallery-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenLightbox(item)}
              className="group relative rounded-2xl overflow-hidden bg-[#0a0d24] border border-white/10 hover:border-[#818cf8]/50 shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.8),0_0_24px_rgba(99,102,241,0.3)] transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full aspect-square"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-90 group-hover:brightness-105 group-hover:scale-105 transition-all duration-500"
                loading="lazy"
              />

                {/* Permanent subtle tag */}
                <div className="absolute top-3 left-3 bg-[#07091c]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-[#c7d2fe] border border-white/10">
                  {item.tag}
                </div>

                {/* Hover Caption Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050718] via-[#050718]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5">
                  <span className="text-sm sm:text-base font-semibold text-white mb-1 drop-shadow">
                    {item.title}
                  </span>
                  <p className="text-xs text-[#c7d2fe] line-clamp-2 mb-3 font-normal leading-relaxed">
                    "{item.prompt}"
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                    <span className="text-[11px] font-mono text-[#a5b4fc]">Seed: #{item.seed}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleCopyPrompt(e, item)}
                        title="Remix this prompt"
                        className="px-2.5 py-1 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[11px] font-medium transition-colors flex items-center gap-1 shadow-sm"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Loaded</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Remix</span>
                          </>
                        )}
                      </button>
                      <span className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20">
                        <Maximize2 className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

      </div>
    </section>
  );
};
