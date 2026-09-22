import React, { useState } from 'react';
import { Menu, X, ArrowRight, Sliders, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenSettings?: () => void;
  onScrollToGenerate?: () => void;
  activeProvider?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenSettings,
  onScrollToGenerate,
  activeProvider = 'pollinations',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGenerateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onScrollToGenerate) {
      onScrollToGenerate();
    } else {
      const el = document.getElementById('generate') || document.getElementById('demo') || document.getElementById('showcase');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div className="w-full max-w-6xl bg-[#090b1c]/85 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.7),0_0_24px_-8px_rgba(99,102,241,0.35)] transition-all duration-300 hover:border-white/20 pointer-events-auto flex items-center justify-between">
        
        {/* Circular Logo + MAGE PRO */}
        <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group text-decoration-none shrink-0" id="brand-logo">
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.5)] transition-transform duration-300 group-hover:scale-105">
            <div className="w-3.5 h-3.5 rounded-full bg-[#070919] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
            </div>
            <span className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-20" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-wider text-white group-hover:text-[#e0e7ff] transition-colors">
            SS <span className="font-extrabold text-[#818cf8] tracking-widest text-xs sm:text-sm px-1.5 py-0.5 rounded bg-[#4f46e5]/20 border border-[#6366f1]/30 ml-0.5">AI</span>
          </span>
        </a>

        {/* Desktop Navigation Links (Combining previous & current menus) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-7">
          <a
            href="#home"
            className="text-xs lg:text-sm font-medium text-[#c7d2fe] hover:text-white transition-colors duration-200"
            id="nav-link-home"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-xs lg:text-sm font-medium text-[#c7d2fe] hover:text-white transition-colors duration-200"
            id="nav-link-features"
          >
            Features
          </a>
          <a
            href="#generate"
            onClick={handleGenerateClick}
            className="text-xs lg:text-sm font-medium text-[#c7d2fe] hover:text-white transition-colors duration-200"
            id="nav-link-generate"
          >
            Generate
          </a>
          <a
            href="#gallery"
            className="text-xs lg:text-sm font-medium text-[#c7d2fe] hover:text-white transition-colors duration-200"
            id="nav-link-gallery"
          >
            Gallery
          </a>
          <a
            href="#pricing"
            className="text-xs lg:text-sm font-medium text-[#c7d2fe] hover:text-white transition-colors duration-200"
            id="nav-link-pricing"
          >
            Pricing
          </a>
          <button
            onClick={() => onOpenAuth('login')}
            className="text-xs lg:text-sm font-medium text-[#c7d2fe] hover:text-white transition-colors duration-200 cursor-pointer"
            id="nav-link-login"
          >
            Log in
          </button>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-[#c7d2fe] bg-[#111430] hover:bg-[#1e224e] border border-white/10 transition-colors cursor-pointer"
              title="Inference Engine Settings"
              id="header-provider-settings"
            >
              <Sliders className="w-3.5 h-3.5 text-[#818cf8]" />
              <span className="hidden xl:inline capitalize font-mono text-[11px]">{activeProvider}</span>
            </button>
          )}

          {/* Primary CTA button: Create free account */}
          <button
            onClick={() => onOpenAuth('signup')}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full text-white bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] border border-white/20 shadow-[0_4px_18px_rgba(99,102,241,0.45)] hover:shadow-[0_6px_25px_rgba(124,58,237,0.65)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-95"
            id="btn-create-free-account"
          >
            <span>Create free account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#c7d2fe] hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle Menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 bg-[#090b1c]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 shadow-2xl pointer-events-auto flex flex-col gap-3 text-center animate-fade-in" id="mobile-menu-drawer">
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-[#c7d2fe] hover:text-white"
          >
            Home
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-[#c7d2fe] hover:text-white"
          >
            Features
          </a>
          <a
            href="#generate"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleGenerateClick(e);
            }}
            className="py-2 text-sm font-medium text-[#c7d2fe] hover:text-white"
          >
            Generate
          </a>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-[#c7d2fe] hover:text-white"
          >
            Gallery
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-[#c7d2fe] hover:text-white"
          >
            Pricing (Go Pro)
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAuth('login');
            }}
            className="py-2 text-sm font-medium text-[#c7d2fe] hover:text-white cursor-pointer"
          >
            Log in
          </button>
          
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth('signup');
              }}
              className="py-3 text-sm font-semibold rounded-full text-white bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] shadow-[0_4px_18px_rgba(99,102,241,0.5)] cursor-pointer"
            >
              Create free account →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
