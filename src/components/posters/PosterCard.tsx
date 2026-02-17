"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Eye, Heart } from "lucide-react";

import { Poster } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PosterCardProps {
  poster: Poster;
  index?: number;
}

export function PosterCard({ poster, index = 0 }: PosterCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();

  const lowestPrice = Math.min(...poster.sizes.map((s) => s.price));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(poster, poster.sizes[0], 1);
  };

  return (
    <Link
      href={`/poster/${poster.id}`}
      className={cn(
        "group block opacity-0 animate-fade-up",
        `animation-delay-${(index % 5) * 100}`
      )}
      style={{
        animationDelay: `${(index % 8) * 100}ms`,
        animationFillMode: "forwards",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-secondary aspect-[3/4]">
        {/* Image */}
        <Image
          src={poster.image}
          alt={poster.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={cn(
            "object-cover transition-transform duration-700 ease-out",
            isHovered && "scale-110"
          )}
        />

        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {poster.isNew && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              New
            </Badge>
          )}
          {poster.isFeatured && (
            <Badge variant="secondary" className="text-xs">
              Featured
            </Badge>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center transition-all duration-300 hover:bg-background z-10"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isLiked
                ? "fill-destructive text-destructive"
                : "text-foreground"
            )}
          />
        </button>

        {/* Quick Actions */}
        <div
          className={cn(
            "absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 z-10",
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          <Button
            size="sm"
            className="flex-1 btn-gold h-10"
            onClick={handleQuickAdd}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Quick Add
          </Button>

          <Button size="sm" variant="secondary" className="h-10 w-10 p-0">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
          {poster.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {poster.artist}
        </p>
        <p className="text-sm font-medium text-primary">
          From {formatPrice(lowestPrice)}
        </p>
      </div>
    </Link>
  );
}
