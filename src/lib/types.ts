// src/lib/types.ts
import type { StaticImageData } from "next/image";

export type PosterImage = string | StaticImageData;

export type PosterSize = {
  name: string;
  dimensions: string;
  price: number;
};

export type Poster = {
  id: string;
  title: string;
  artist: string;
  description: string;
  category: string;
  image: PosterImage; // ✅ supports local imports + URL strings
  sizes: PosterSize[];
  tags: string[];
  isFeatured?: boolean;
  isNew?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
};

export type CartItem = {
  poster: Poster;
  selectedSize: PosterSize;
  quantity: number;
};
