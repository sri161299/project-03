export interface IdeaThumb {
  id: string;
  title: string;
  prompt: string;
  tag: string;
  imageUrl: string;
  category: 'image' | 'video' | 'illustration' | '3d';
}

export interface GalleryItem {
  id: string;
  title: string;
  tag: string;
  category: 'Animals' | 'Fantasy Characters' | 'Landscapes' | 'Flowers' | 'Abstract Art' | string;
  imageUrl: string;
  span?: 'tall' | 'wide' | 'normal';
  prompt: string;
  aspectRatio: string;
  seed: number;
  likes?: number;
}

export interface GenerationVariant {
  id: string;
  label: string;
  imageUrl: string;
  resolution: string;
}

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
  aspectRatio: string;
  imageSize?: string;
  isEdited?: boolean;
  originalImageUrl?: string;
  note?: string;
  provider?: string;
  model?: string;
}

