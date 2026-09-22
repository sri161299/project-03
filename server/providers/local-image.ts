import {
  GenerateImageOptions,
  GenerateImageResult,
  ImageGenerationProvider,
  ProviderUnsupportedError,
} from "./types";

export class LocalProvider implements ImageGenerationProvider {
  id = "local";
  name = "Local Synthesizer";
  supportsEditing = false;

  async generateImage(options: GenerateImageOptions): Promise<GenerateImageResult> {
    const prompt = options.prompt || "Abstract Neon Visual";
    const aspectRatio = options.aspectRatio || "1:1";

    let width = 1024;
    let height = 1024;
    if (aspectRatio === "16:9") {
      height = 576;
    } else if (aspectRatio === "9:16") {
      width = 576;
    } else if (aspectRatio === "4:3") {
      height = 768;
    } else if (aspectRatio === "3:4") {
      width = 768;
    }

    // Generate procedural cyberpunk/futuristic SVG data URI
    const seed = Math.abs(
      prompt.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    );
    const hue1 = seed % 360;
    const hue2 = (hue1 + 60) % 360;
    const hue3 = (hue1 + 180) % 360;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="hsl(${hue1}, 75%, 20%)" />
            <stop offset="50%" stop-color="hsl(${hue2}, 60%, 10%)" />
            <stop offset="100%" stop-color="#03040d" />
          </radialGradient>
          <linearGradient id="neonBeam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="hsl(${hue1}, 95%, 65%)" stop-opacity="0.8" />
            <stop offset="50%" stop-color="hsl(${hue2}, 95%, 70%)" stop-opacity="0.9" />
            <stop offset="100%" stop-color="hsl(${hue3}, 95%, 60%)" stop-opacity="0.6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="25" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bgGlow)" />
        
        <!-- Abstract geometric cybernetic forms -->
        <circle cx="${width * 0.5}" cy="${height * 0.45}" r="${Math.min(width, height) * 0.28}" fill="none" stroke="url(#neonBeam)" stroke-width="3" filter="url(#glow)" stroke-dasharray="16 8" />
        <circle cx="${width * 0.5}" cy="${height * 0.45}" r="${Math.min(width, height) * 0.22}" fill="hsl(${hue1}, 80%, 15%)" fill-opacity="0.4" stroke="hsl(${hue2}, 90%, 65%)" stroke-width="1.5" />
        <polygon points="${width * 0.5},${height * 0.22} ${width * 0.68},${height * 0.55} ${width * 0.32},${height * 0.55}" fill="none" stroke="url(#neonBeam)" stroke-width="2" />
        
        <!-- Ambient Grid lines -->
        <line x1="0" y1="${height * 0.8}" x2="${width}" y2="${height * 0.8}" stroke="hsl(${hue2}, 60%, 30%)" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="${width * 0.2}" y1="0" x2="${width * 0.2}" y2="${height}" stroke="hsl(${hue1}, 50%, 25%)" stroke-width="1" stroke-opacity="0.3" />
        <line x1="${width * 0.8}" y1="0" x2="${width * 0.8}" y2="${height}" stroke="hsl(${hue3}, 50%, 25%)" stroke-width="1" stroke-opacity="0.3" />
        
        <!-- Bottom overlay text bar -->
        <rect x="${width * 0.08}" y="${height * 0.72}" width="${width * 0.84}" height="${height * 0.18}" rx="16" fill="#060714" fill-opacity="0.75" stroke="hsl(${hue2}, 50%, 35%)" stroke-width="1" />
        <text x="${width * 0.12}" y="${height * 0.79}" fill="#f8f8fc" font-family="system-ui, sans-serif" font-weight="600" font-size="${Math.max(16, Math.floor(width * 0.024))}px">ARCHAI // LOCAL SYNTHESIS</text>
        <text x="${width * 0.12}" y="${height * 0.85}" fill="#9d9cb8" font-family="system-ui, sans-serif" font-size="${Math.max(13, Math.floor(width * 0.016))}px">${escapeXml(prompt.slice(0, 70))}${prompt.length > 70 ? "..." : ""}</text>
      </svg>
    `.trim();

    const base64Data = Buffer.from(svg).toString("base64");
    const imageUrl = `data:image/svg+xml;base64,${base64Data}`;

    return {
      imageUrl,
      provider: "local",
      model: "archai-local-vector-synth",
      aspectRatio,
      note: "Synthesized via offline LocalProvider",
    };
  }

  async editImage(_options: GenerateImageOptions): Promise<GenerateImageResult> {
    throw new ProviderUnsupportedError(
      "Image editing is not available with the current free provider. Please use text-to-image or connect an image-editing provider."
    );
  }
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
