import { GeneratedImage } from '../types';

export interface GenerateImageParams {
  prompt: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
  imageSize?: string;
  negativePrompt?: string;
  provider?: string;
  model?: string;
}

export interface EditImageParams {
  prompt: string;
  imageBase64: string;
  mimeType?: string;
  aspectRatio?: string;
  provider?: string;
}

export interface ProviderInfo {
  activeProvider: string;
  model: string;
  hasPollinationsKey?: boolean;
  hasHfToken: boolean;
  hasGeminiKey: boolean;
  availableProviders: {
    id: string;
    name: string;
    description: string;
    model: string;
    supportsEditing: boolean;
  }[];
}

export class ImageApiError extends Error {
  code?: string;
  isAuthMissing?: boolean;
  isQuotaExceeded?: boolean;
  isEditUnsupported?: boolean;
  isUnavailable?: boolean;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ImageApiError';
    this.code = code;
    this.isAuthMissing =
      code === 'AUTH_MISSING' ||
      message.includes('authentication is missing') ||
      message.includes('authentication is required') ||
      message.includes('API key');
    this.isQuotaExceeded =
      code === 'QUOTA_EXHAUSTED' ||
      message.includes('credits have been exhausted') ||
      message.includes('rate limit');
    this.isEditUnsupported =
      code === 'EDIT_UNSUPPORTED' || message.includes('editing is not supported');
    this.isUnavailable =
      code === 'UNAVAILABLE' ||
      message.includes('temporarily unavailable') ||
      message.includes('timed out');
  }
}

export async function fetchProviderInfo(): Promise<ProviderInfo> {
  try {
    const res = await fetch('/api/images/provider');
    if (!res.ok) throw new Error('Failed to fetch provider info');
    return await res.json();
  } catch (err) {
    return {
      activeProvider: 'pollinations',
      model: 'flux',
      hasPollinationsKey: false,
      hasHfToken: false,
      hasGeminiKey: false,
      availableProviders: [
        {
          id: 'pollinations',
          name: 'Pollinations.AI',
          description: 'FLUX.1 Schnell text-to-image engine',
          model: 'flux',
          supportsEditing: false,
        },
        {
          id: 'gemini',
          name: 'Google Gemini',
          description: 'High-resolution generative & conversational image editing',
          model: 'gemini-3.1-flash-image',
          supportsEditing: true,
        },
        {
          id: 'local',
          name: 'Local Synthesizer',
          description: 'Offline algorithmic vector & geometric synthesizer',
          model: 'archai-local-vector-synth',
          supportsEditing: false,
        },
        {
          id: 'huggingface',
          name: 'Hugging Face',
          description: 'Alternative inference provider',
          model: 'black-forest-labs/FLUX.1-schnell',
          supportsEditing: false,
        },
      ],
    };
  }
}

export async function switchProvider(provider: string): Promise<ProviderInfo> {
  const res = await fetch('/api/images/provider', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new ImageApiError(data.error || 'Failed to switch provider');
  }
  return data;
}

export async function generateImageApi(params: GenerateImageParams): Promise<GeneratedImage> {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new ImageApiError(
      data.error || 'Image generation failed',
      data.code
    );
  }

  return {
    id: `gen-${Date.now()}`,
    imageUrl: data.imageUrl,
    prompt: data.prompt,
    createdAt: data.createdAt || new Date().toISOString(),
    aspectRatio: data.aspectRatio || params.aspectRatio || '1:1',
    imageSize: data.imageSize || params.imageSize || '1K',
    provider: data.provider,
    model: data.model,
    note: data.note,
  };
}

export async function editImageApi(params: EditImageParams): Promise<GeneratedImage> {
  const response = await fetch('/api/images/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new ImageApiError(
      data.error || 'Failed to edit image',
      data.code
    );
  }

  return {
    id: `edit-${Date.now()}`,
    imageUrl: data.imageUrl,
    prompt: data.prompt,
    createdAt: data.createdAt || new Date().toISOString(),
    aspectRatio: params.aspectRatio || '1:1',
    isEdited: true,
    originalImageUrl: params.imageBase64.startsWith('data:')
      ? params.imageBase64
      : `data:${params.mimeType || 'image/png'};base64,${params.imageBase64}`,
    provider: data.provider,
    model: data.model,
    note: data.note,
  };
}
