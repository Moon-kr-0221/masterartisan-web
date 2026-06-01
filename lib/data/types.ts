import type { WorkCategory } from '@/data/works';

export type { WorkCategory };

export type Artisan = {
  generation: number;
  generationEn: string;
  name: string;
  title: string;
  role: string;
  description: string;
  highlights: string[];
  image: string;
};

export type Work = {
  id: string;
  title: string;
  category: WorkCategory;
  year: string;
  description: string;
  image: string;
  featured: boolean;
  featuredOrder: number;
};

// Shape consumed by the home "작업 사례" featured showcase.
export type FeaturedWork = {
  title: string;
  cat: string;
  year: string;
  bg: string;
  color: string;
};

export type HistoryMedia = {
  id?: string;
  image_url: string;
  caption: string | null;
};

export type HistoryWorkItem = {
  id: string;
  year: number;
  title: string;
  hasMedia: boolean;
  media: HistoryMedia[];
};

export type HistoryEraGroup = {
  era: string;
  works: HistoryWorkItem[];
};
