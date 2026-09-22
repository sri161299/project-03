import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-b from-transparent via-[#060718]/80 to-[#03040d] border-t border-[#7864ff]/15 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid: Left brand + 3/4 navigation columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">
          
          {/* Brand Info (takes 2 cols on lg) */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <a href="#home" className="flex items-center gap-3 mb-4 group text-decoration-none">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.5)]">
                <div className="w-3.5 h-3.5 rounded-full bg-[#070919] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                </div>
              </div>
              <span className="font-bold text-lg tracking-wider text-white">
                SS <span className="font-extrabold text-[#818cf8] tracking-widest text-xs px-1.5 py-0.5 rounded bg-[#4f46e5]/20 border border-[#6366f1]/30 ml-0.5">AI</span>
              </span>
            </a>

            <p className="text-sm text-[#94a3b8] max-w-sm leading-relaxed mb-6 font-normal">
              Next-generation generative studio powered by state-of-the-art neural diffusion models.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              
              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#7864ff]/20 hover:border-[#8c78ff] hover:bg-[#5545ff] text-[#d6d5ef] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#7864ff]/20 hover:border-[#8c78ff] hover:bg-[#5545ff] text-[#d6d5ef] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#7864ff]/20 hover:border-[#8c78ff] hover:bg-[#5545ff] text-[#d6d5ef] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 1: Product */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#changelog" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Changelog
                </a>
              </li>
              <li>
                <a href="#api" className="text-[#8c8fa9] hover:text-white transition-colors">
                  API Access
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#docs" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#prompts" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Prompt Guide
                </a>
              </li>
              <li>
                <a href="#community" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#blog" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#status" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Status
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="text-[#8c8fa9] hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#careers" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#8c8fa9] hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
          <p>© 2025 SS AI Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#security" className="hover:text-white transition-colors">
              Security
            </a>
            <a href="#cookies" className="hover:text-white transition-colors">
              Cookies
            </a>
            <a href="#preferences" className="hover:text-white transition-colors">
              Preferences
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
