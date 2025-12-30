"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Share2, ZoomIn, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import { Poster, PosterSize } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function PosterDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [poster, setPoster] = useState<Poster | null>(null);
  const [selectedSize, setSelectedSize] = useState<PosterSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchPoster();
    }
  }, [id]);

  const fetchPoster = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posters/${id}`);
      const data = await res.json();
      
      if (data.data) {
        const posterData = data.data;
        const poster: Poster = {
          id: posterData.id,
          title: posterData.title,
          artist: posterData.artist,
          description: posterData.description || "",
          category: posterData.category_id,
          image: posterData.image_url,
          sizes: (posterData.sizes || []).map((s: any) => ({
            name: s.name,
            dimensions: s.dimensions,
            price: parseFloat(s.price.toString()),
          })),
          tags: posterData.tags || [],
          isFeatured: posterData.is_featured,
          isNew: posterData.is_new,
        };
        setPoster(poster);
        if (poster.sizes.length > 0) {
          setSelectedSize(poster.sizes[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching poster:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!poster || !selectedSize) return;
    addToCart(poster, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!poster || !selectedSize) return;
    addToCart(poster, selectedSize, quantity);
    // Redirect to checkout
    window.location.href = "/checkout";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!poster) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12 text-center min-h-[60vh]">
        <h2 className="text-2xl font-serif mb-4">Poster not found</h2>
        <Button asChild>
          <Link href="/gallery">Browse Gallery</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-secondary rounded-lg overflow-hidden group cursor-zoom-in" onClick={() => setImageZoomOpen(true)}>
            <Image
              src={poster.image}
              alt={poster.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {poster.isNew && (
                <Badge className="bg-primary text-primary-foreground">New</Badge>
              )}
              {poster.isFeatured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-medium mb-2">{poster.title}</h1>
            <p className="text-lg text-muted-foreground">by {poster.artist}</p>
          </div>

          {selectedSize && (
            <div>
              <p className="text-3xl font-serif font-medium text-primary mb-2">
                {formatPrice(selectedSize.price)}
              </p>
              <p className="text-sm text-muted-foreground">{selectedSize.dimensions}</p>
            </div>
          )}

          <Separator />

          {/* Size Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Size</Label>
            <div className="grid grid-cols-3 gap-3">
              {poster.sizes.map((size) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedSize?.name === size.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-medium">{size.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{size.dimensions}</div>
                  <div className="text-sm font-medium text-primary mt-2">{formatPrice(size.price)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quantity</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1 btn-gold h-12 text-base"
              disabled={!selectedSize}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="flex-1 h-12 text-base"
              disabled={!selectedSize}
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Tags */}
          {poster.tags.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {poster.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p className="text-muted-foreground leading-relaxed">{poster.description}</p>
            </TabsContent>
            <TabsContent value="specs" className="mt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Artist</span>
                  <span className="font-medium">{poster.artist}</span>
                </div>
                {selectedSize && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-medium">{selectedSize.dimensions}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium">{formatPrice(selectedSize.price)}</span>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Image Zoom Dialog */}
      <Dialog open={imageZoomOpen} onOpenChange={setImageZoomOpen}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={poster.image}
              alt={poster.title}
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}

