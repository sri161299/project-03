import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { PossibilitiesShowcase } from './components/PossibilitiesShowcase';
import { GalleryShowcase } from './components/GalleryShowcase';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { UploadModal, AuthModal, LightboxModal, SettingsModal } from './components/Modals';
import { GalleryItem, GenerationVariant, GeneratedImage } from './types';
import {
  generateImageApi,
  editImageApi,
  fetchProviderInfo,
  switchProvider,
  ProviderInfo,
} from './services/imageService';

export default function App() {
  const [activePrompt, setActivePrompt] = useState<string>(
    'Cinematic editorial portrait in glowing neon violet lighting, hyper-realistic, 8k'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Real generated images state
  const [activeGeneratedImage, setActiveGeneratedImage] = useState<GeneratedImage | null>(null);
  const [generatedHistory, setGeneratedHistory] = useState<GeneratedImage[]>([]);

  // Provider configuration state
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
  }>({
    isOpen: false,
    mode: 'signup',
  });
  const [inspectItem, setInspectItem] = useState<GalleryItem | GenerationVariant | GeneratedImage | null>(null);

  // Fetch initial provider information from the server
  useEffect(() => {
    fetchProviderInfo()
      .then((info) => setProviderInfo(info))
      .catch((err) => console.warn('Could not load provider info:', err));
  }, []);

  const handleSelectProvider = async (providerId: string) => {
    const updated = await switchProvider(providerId);
    setProviderInfo(updated);
  };

  // Core Real Image Generation Handler using provider abstraction
  const handleGenerateImage = async (
    promptText: string,
    aspectRatio: string = '1:1',
    imageSize: string = '1K'
  ) => {
    const text = promptText.trim();
    if (!text) return;

    setActivePrompt(text);
    setIsGenerating(true);
    setGenerationError(null);

    // Scroll smoothly to studio section
    const generateElement = document.getElementById('generate');
    if (generateElement) {
      generateElement.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const generated = await generateImageApi({
        prompt: text,
        aspectRatio,
        imageSize,
        provider: providerInfo?.activeProvider,
      });

      setActiveGeneratedImage(generated);
      setGeneratedHistory((prev) => [generated, ...prev]);
    } catch (err: any) {
      console.warn('Image generation error:', err);
      const msg = err?.message || '';

      if (err?.isAuthMissing || msg.includes('authentication') || msg.includes('API key')) {
        setGenerationError(
          msg.includes('Pollinations')
            ? 'Pollinations authentication is required.'
            : (msg || 'Pollinations authentication is required.')
        );
      } else if (err?.isQuotaExceeded || msg.includes('credits have been exhausted') || msg.includes('rate limit')) {
        setGenerationError(
          'Free image-generation credits have been exhausted. Try again later or connect a paid provider.'
        );
      } else if (err?.isUnavailable || msg.includes('temporarily unavailable') || msg.includes('timed out')) {
        setGenerationError('Image generation is temporarily unavailable.');
      } else {
        setGenerationError(msg || 'Image generation is temporarily unavailable.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Switch to local provider and trigger generation immediately
  const handleSwitchToLocalAndGenerate = async () => {
    try {
      setGenerationError(null);
      const updated = await switchProvider('local');
      setProviderInfo(updated);
      // Generate with local provider
      setIsGenerating(true);
      const generated = await generateImageApi({
        prompt: activePrompt.trim(),
        aspectRatio: '1:1',
        imageSize: '1K',
        provider: 'local',
      });
      setActiveGeneratedImage(generated);
      setGeneratedHistory((prev) => [generated, ...prev]);
    } catch (e) {
      console.warn('Failed to switch to local provider:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Core Real Image-to-Image Editing Handler using provider abstraction
  const handleEditImage = async (
    promptText: string,
    imageBase64: string,
    mimeType: string = 'image/png'
  ) => {
    const text = promptText.trim();
    if (!text || !imageBase64) return;

    // Check if current provider supports image editing
    const currentProvider = providerInfo?.activeProvider || 'huggingface';
    if (currentProvider === 'huggingface' || currentProvider === 'local') {
      setGenerationError(
        'Image editing is not available with the current free provider. Please use text-to-image or connect an image-editing provider.'
      );
      const featuresElement = document.getElementById('features');
      if (featuresElement) {
        featuresElement.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    // Scroll smoothly to studio section
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const edited = await editImageApi({
        prompt: text,
        imageBase64,
        mimeType,
        provider: providerInfo?.activeProvider,
      });

      setActiveGeneratedImage(edited);
      setGeneratedHistory((prev) => [edited, ...prev]);
    } catch (err: any) {
      console.warn('Image editing error:', err);
      const msg = err?.message || '';

      if (err?.isEditUnsupported || msg.includes('editing is not supported') || msg.includes('not available')) {
        setGenerationError(
          'Image editing is not supported by the current provider. Please use text-to-image or connect an image-editing provider.'
        );
      } else if (err?.isAuthMissing || msg.includes('authentication is missing')) {
        setGenerationError('Image provider authentication is missing.');
      } else if (err?.isQuotaExceeded || msg.includes('credits have been exhausted')) {
        setGenerationError(
          'Free image-generation credits have been exhausted. Try again later or connect a paid provider.'
        );
      } else {
        setGenerationError(msg || 'Image editing failed.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartCreating = () => {
    const generateElement = document.getElementById('generate') || document.getElementById('demo');
    if (generateElement) {
      generateElement.scrollIntoView({ behavior: 'smooth' });
      const input = generateElement.querySelector('textarea') || generateElement.querySelector('input');
      if (input) {
        input.focus();
      }
    } else {
      setAuthModalState({ isOpen: true, mode: 'signup' });
    }
  };

  return (
    <div className="min-h-screen bg-[#03040d] text-[#f8f8fc] relative overflow-x-hidden selection:bg-[#5545ff]/40 selection:text-white">
      
      {/* Ambient Neon Beams & Glow Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Top radial violet glow */}
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(85,69,255,0.24)_0%,rgba(117,104,255,0.08)_45%,transparent_70%)] blur-[90px]" />

        {/* Mid-right ambient violet orb */}
        <div className="absolute top-[40%] -right-40 w-[750px] h-[750px] bg-[radial-gradient(circle,rgba(117,104,255,0.13)_0%,rgba(35,25,120,0.05)_50%,transparent_75%)] blur-[110px]" />

        {/* Lower-left ambient deep glow */}
        <div className="absolute bottom-[20%] -left-32 w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(85,69,255,0.1)_0%,transparent_70%)] blur-[100px]" />

        {/* Diagonal neon light beams */}
        <div className="absolute top-[16%] -left-[15%] w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#7568ff]/30 to-transparent rotate-[22deg] blur-[1px]" />
        <div className="absolute top-[58%] -right-[15%] w-[75%] h-[1px] bg-gradient-to-r from-transparent via-[#5545ff]/25 to-transparent -rotate-[16deg] blur-[1px]" />
      </div>

      {/* Floating Compact Navigation */}
      <Header
        onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
        onOpenSettings={() => setSettingsModalOpen(true)}
        activeProvider={providerInfo?.activeProvider}
      />

      <main className="relative z-10">
        {/* Hero Section with Prompt Card & Idea Thumbnails */}
        <HeroSection
          onGenerate={(prompt) => handleGenerateImage(prompt)}
          onOpenUpload={() => setUploadModalOpen(true)}
          activePrompt={activePrompt}
          setActivePrompt={setActivePrompt}
        />

        {/* Features Section: 4 feature cards */}
        <FeaturesSection />

        {/* Live Studio Showcase: Generate & Edit Images with provider router */}
        <PossibilitiesShowcase
          currentPrompt={activePrompt}
          setCurrentPrompt={setActivePrompt}
          isGenerating={isGenerating}
          onGenerate={handleGenerateImage}
          onEditImage={handleEditImage}
          activeGeneratedImage={activeGeneratedImage}
          generatedHistory={generatedHistory}
          onSelectHistoryImage={(img) => setActiveGeneratedImage(img)}
          error={generationError}
          onClearError={() => setGenerationError(null)}
          onInspectVariant={(variant) => setInspectItem(variant)}
          onOpenUpload={() => setUploadModalOpen(true)}
          activeProvider={providerInfo?.activeProvider || 'huggingface'}
          activeModel={providerInfo?.model || 'black-forest-labs/FLUX.1-schnell'}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onSwitchToLocal={handleSwitchToLocalAndGenerate}
        />

        {/* Gallery Showcase Masonry Collage */}
        <GalleryShowcase
          onSelectPrompt={(prompt) => {
            setActivePrompt(prompt);
            handleGenerateImage(prompt);
          }}
          onOpenLightbox={(item) => setInspectItem(item)}
        />

        {/* Horizontal Dark-Purple Gradient CTA Section */}
        <CtaSection onStartCreating={handleStartCreating} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onEditImage={handleEditImage}
        onApplyPhotoPrompt={(prompt) => {
          setActivePrompt(prompt);
        }}
      />

      <AuthModal
        isOpen={authModalState.isOpen}
        mode={authModalState.mode}
        onClose={() => setAuthModalState((prev) => ({ ...prev, isOpen: false }))}
        onSwitchMode={(mode) => setAuthModalState({ isOpen: true, mode })}
      />

      <LightboxModal
        item={inspectItem}
        onClose={() => setInspectItem(null)}
        onUsePrompt={(prompt) => {
          setActivePrompt(prompt);
          setInspectItem(null);
          handleGenerateImage(prompt);
        }}
        onEditInStudio={(item) => {
          if ('createdAt' in item) {
            setActiveGeneratedImage(item as GeneratedImage);
          } else {
            setActivePrompt(('prompt' in item ? (item as any).prompt : ''));
          }
          const features = document.getElementById('features');
          features?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        providerInfo={providerInfo}
        onSelectProvider={handleSelectProvider}
      />

    </div>
  );
}
