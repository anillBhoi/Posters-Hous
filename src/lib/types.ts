export interface PosterSize {
  name: string;
  dimensions: string;
  price: number;
}

export interface Poster {
  id: string;
  title: string;
  artist: string;
  description: string;
  category: string;
  image: string;
  sizes: PosterSize[];
  tags: string[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  poster: Poster;
  selectedSize: PosterSize;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
}
