export interface GenerateImageOptions {
  prompt: string;
  referenceImages?: string[];
  imageBase64?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  negativePrompt?: string;
  imageSize?: string;
  model?: string;
}

export interface GenerateImageResult {
  imageUrl: string;
  provider: string;
  model?: string;
  note?: string;
  aspectRatio?: string;
}

export interface ImageGenerationProvider {
  id: string;
  name: string;
  supportsEditing: boolean;
  generateImage(options: GenerateImageOptions): Promise<GenerateImageResult>;
  editImage?(options: GenerateImageOptions): Promise<GenerateImageResult>;
}

export class ProviderAuthError extends Error {
  constructor(message: string = "Image provider authentication is missing.") {
    super(message);
    this.name = "ProviderAuthError";
  }
}

export class ProviderQuotaError extends Error {
  constructor(
    message: string = "Free image-generation credits have been exhausted. Try again later or connect a paid provider."
  ) {
    super(message);
    this.name = "ProviderQuotaError";
  }
}

export class ProviderUnsupportedError extends Error {
  constructor(message: string = "Image editing is not supported by the current provider.") {
    super(message);
    this.name = "ProviderUnsupportedError";
  }
}

export class ProviderUnavailableError extends Error {
  constructor(message: string = "Image generation is temporarily unavailable.") {
    super(message);
    this.name = "ProviderUnavailableError";
  }
}
