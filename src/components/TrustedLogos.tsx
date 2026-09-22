import React from 'react';

export const TrustedLogos: React.FC = () => {
  return (
    <section className="relative py-12 border-b border-[#7864ff]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        
        <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.1em] text-[#8386a3] mb-8">
          Trusted by 5 million users at leading companies
        </p>

        <div className="flex items-center justify-center gap-8 sm:gap-14 md:gap-20 flex-wrap opacity-60 hover:opacity-90 transition-opacity duration-300">
          
          {/* Netdot */}
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#b4b6d4] tracking-tight group">
            <svg className="w-5 h-5 fill-current text-[#7568ff]/70 group-hover:text-[#7568ff]" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>Netdot</span>
          </div>

          {/* Sparkweb */}
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#b4b6d4] tracking-tight group">
            <svg className="w-5 h-5 fill-current text-[#7568ff]/70 group-hover:text-[#7568ff]" viewBox="0 0 24 24">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Sparkweb</span>
          </div>

          {/* BrandBee */}
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#b4b6d4] tracking-tight group">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2 text-[#7568ff]/70 group-hover:text-[#7568ff]" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="m4.93 4.93 4.24 4.24" />
              <path d="m14.83 9.17 4.24-4.24" />
              <path d="m14.83 14.83 4.24 4.24" />
              <path d="m9.17 14.83-4.24 4.24" />
            </svg>
            <span>BrandBee</span>
          </div>

          {/* Digitech */}
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#b4b6d4] tracking-tight group">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2 text-[#7568ff]/70 group-hover:text-[#7568ff]" viewBox="0 0 24 24">
              <rect width="18" height="18" x="3" y="3" rx="3" />
              <path d="M9 3v18" />
              <path d="m14 9 3 3-3 3" />
            </svg>
            <span>Digitech</span>
          </div>

          {/* Codelink */}
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#b4b6d4] tracking-tight group">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2 text-[#7568ff]/70 group-hover:text-[#7568ff]" viewBox="0 0 24 24">
              <path d="m7 8-4 4 4 4" />
              <path d="m17 8 4 4-4 4" />
              <line x1="14" x2="10" y1="4" y2="20" />
            </svg>
            <span>Codelink</span>
          </div>

        </div>
      </div>
    </section>
  );
};
