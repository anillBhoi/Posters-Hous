import { Poster, Category } from "./types";

import goldenWaves from "@/assets/posters/golden-waves.jpg";
import zenMountains from "@/assets/posters/zen-mountains.jpg";
import geometricHarmony from "@/assets/posters/geometric-harmony.jpg";
import botanicalDreams from "@/assets/posters/botanical-dreams.jpg";
import stormySeas from "@/assets/posters/stormy-seas.jpg";
import linePortrait from "@/assets/posters/line-portrait.jpg";
import spiralStairs from "@/assets/posters/spiral-stairs.jpg";
import celestialNight from "@/assets/posters/celestial-night.jpg";

export const categories: Category[] = [
  { 
    id: "1", 
    name: "Abstract", 
    slug: "abstract", 
    description: "Bold abstract expressions",
    image_url: "https://i.redd.it/axzni0zgj5d41.jpg"
  },
  { 
    id: "2", 
    name: "Nature", 
    slug: "nature", 
    description: "Serene natural landscapes",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
  },
  { 
    id: "3", 
    name: "Minimalist", 
    slug: "minimalist", 
    description: "Clean & modern designs",
    image_url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop"
  },
  { 
    id: "4", 
    name: "Botanical", 
    slug: "botanical", 
    description: "Elegant floral art",
    image_url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop"
  },
  { 
    id: "5", 
    name: "Architecture", 
    slug: "architecture", 
    description: "Structural beauty",
    image_url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop"
  },
  { 
    id: "6", 
    name: "Celestial", 
    slug: "celestial", 
    description: "Cosmic wonders",
    image_url: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop"
  },
];

export const posters: Poster[] = [
  {
    id: "1",
    title: "Golden Waves",
    artist: "Posters Hous Studio",
    description: "A mesmerizing abstract piece featuring flowing gold and copper metallic waves against a deep charcoal backdrop. This artwork brings a sense of luxury and movement to any space.",
    category: "abstract",
    image: goldenWaves,
    sizes: [
      { name: "Small", dimensions: "30 × 40 cm", price: 1299 },
      { name: "Medium", dimensions: "50 × 70 cm", price: 2499 },
      { name: "Large", dimensions: "70 × 100 cm", price: 3999 },
    ],
    tags: ["gold", "abstract", "luxury", "metallic"],
    isFeatured: true,
  },
  {
    id: "2",
    title: "Zen Mountains",
    artist: "Hikari Tanaka",
    description: "A serene Japanese ink wash landscape featuring misty mountains and a lone pine tree. Inspired by traditional sumi-e painting techniques, this piece evokes tranquility and contemplation.",
    category: "nature",
    image: zenMountains,
    sizes: [
      { name: "Small", dimensions: "30 × 40 cm", price: 1199 },
      { name: "Medium", dimensions: "50 × 70 cm", price: 2299 },
      { name: "Large", dimensions: "70 × 100 cm", price: 3699 },
    ],
    tags: ["japanese", "mountains", "zen", "ink wash"],
    isFeatured: true,
    isNew: true,
  },
  {
    id: "3",
    title: "Geometric Harmony",
    artist: "Marcus Weber",
    description: "Bold geometric forms in warm terracotta, burnt orange, and sage green create a mid-century modern masterpiece. Inspired by Bauhaus principles of form and color.",
    category: "abstract",
    image: geometricHarmony,
    sizes: [
      { name: "Small", dimensions: "30 × 40 cm", price: 1099 },
      { name: "Medium", dimensions: "50 × 70 cm", price: 2199 },
      { name: "Large", dimensions: "70 × 100 cm", price: 3499 },
    ],
    tags: ["geometric", "bauhaus", "mid-century", "colorful"],
  },
  {
    id: "4",
    title: "Botanical Dreams",
    artist: "Elena Flores",
    description: "Ethereal watercolor botanicals featuring delicate wildflowers and grasses in soft, muted tones. A feminine and elegant piece that brings natural beauty indoors.",
    category: "botanical",
    image: botanicalDreams,
    sizes: [
      { name: "Small", dimensions: "30 × 40 cm", price: 999 },
      { name: "Medium", dimensions: "50 × 70 cm", price: 1999 },
      { name: "Large", dimensions: "70 × 100 cm", price: 3299 },
    ],
    tags: ["botanical", "watercolor", "flowers", "feminine"],
    isNew: true,
  },
  {
    id: "5",
    title: "Stormy Seas",
    artist: "James Morrison",
    description: "A dramatic seascape capturing the raw power of nature. Deep navy waters and crashing waves create a moody, atmospheric piece with cinematic presence.",
    category: "nature",
    image: stormySeas,
    sizes: [
      { name: "Small", dimensions: "30 × 40 cm", price: 1399 },
      { name: "Medium", dimensions: "50 × 70 cm", price: 2699 },
      { name: "Large", dimensions: "70 × 100 cm", price: 4299 },
    ],
    tags: ["ocean", "dramatic", "moody", "seascape"],
    isFeatured: true,
  },
  {
    id: "6",
    title: "Line Portrait",
    artist: "Sofia Laurent",
    description: "A sophisticated continuous line drawing capturing the essence of feminine elegance. Minimalist yet expressive, this piece makes a refined statement.",
    category: "minimalist",
    image: linePortrait,
    sizes: [
      { name: "Small", dimensions: "30 × 40 cm", price: 899 },
      { name: "Medium", dimensions: "50 × 70 cm", price: 1799 },
      { name: "Large", dimensions: "70 × 100 cm", price: 2999 },
    ],
    tags: ["line art", "portrait", "minimal", "modern"],
  },
  {
    id: "7",
    title: "Spiral Ascent",
    artist: "David Chen",
    description: "A stunning architectural photograph of a spiral staircase, shot from below. The dramatic black and white tones and geometric patterns create a hypnotic visual experience.",
    category: "architecture",
    image: spiralStairs,
    sizes: [
      { name: "Small", dimensions: "30 × 40 cm", price: 1499 },
      { name: "Medium", dimensions: "50 × 70 cm", price: 2899 },
      { name: "Large", dimensions: "70 × 100 cm", price: 4599 },
    ],
    tags: ["architecture", "black and white", "spiral", "geometric"],
    isNew: true,
  },
  {
    id: "8",
    title: "Celestial Dreams",
    artist: "Aurora Night",
    description: "A mystical crescent moon glowing through cosmic clouds and stars. This ethereal piece brings the magic of the night sky into your space.",
    category: "celestial",
    image: celestialNight,
    sizes: [
      { name: "Small", dimensions: "30 × 40 cm", price: 1199 },
      { name: "Medium", dimensions: "50 × 70 cm", price: 2399 },
      { name: "Large", dimensions: "70 × 100 cm", price: 3899 },
    ],
    tags: ["moon", "celestial", "night", "mystical"],
    isFeatured: true,
  },
];

export const getFeaturedPosters = () => posters.filter(p => p.isFeatured);
export const getNewArrivals = () => posters.filter(p => p.isNew);
export const getPostersByCategory = (category: string) => 
  posters.filter(p => p.category === category);
export const getPosterById = (id: string) => posters.find(p => p.id === id);
