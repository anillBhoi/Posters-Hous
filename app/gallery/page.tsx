"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PosterGrid } from "@/components/posters/PosterGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Filter, Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface Poster {
  id: string;
  title: string;
  artist: string;
  description: string;
  category_id: string;
  image_url: string;
  tags: string[];
  is_featured: boolean;
  is_new: boolean;
  sizes: Array<{
    id: string;
    name: string;
    dimensions: string;
    price: number;
  }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const [posters, setPosters] = useState<Poster[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosters();
  }, [search, selectedCategory, sortBy, sortOrder, priceRange, featuredOnly]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPosters = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);
      params.append("minPrice", priceRange[0].toString());
      params.append("maxPrice", priceRange[1].toString());
      if (featuredOnly) params.append("featured", "true");

      const res = await fetch(`/api/posters?${params.toString()}`);
      const data = await res.json();
      setPosters(data.data || []);
    } catch (error) {
      console.error("Error fetching posters:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSortBy("created_at");
    setSortOrder("desc");
    setPriceRange([0, 10000]);
    setFeaturedOnly(false);
  };

  const hasActiveFilters = search || selectedCategory || priceRange[0] > 0 || priceRange[1] < 10000 || featuredOnly;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <div className="divider-gold mb-4" />
        <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-2">Gallery</h1>
        <p className="text-muted-foreground">Discover our curated collection of premium art posters</p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posters, artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Latest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="views_count">Most Viewed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>

          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={(v) => setPriceRange(v as [number, number])}
                    max={10000}
                    min={0}
                    step={100}
                    className="mt-4"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured Only
                  </Label>
                </div>

                {hasActiveFilters && (
                  <>
                    <Separator />
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {search && (
            <Badge variant="secondary" className="gap-2">
              Search: {search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearch("")}
              />
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-2">
              {categories.find((c) => c.id === selectedCategory)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSelectedCategory("")}
              />
            </Badge>
          )}
          {featuredOnly && (
            <Badge variant="secondary" className="gap-2">
              Featured
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFeaturedOnly(false)}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading posters...</p>
        </div>
      ) : posters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No posters found</p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <PosterGrid
          posters={posters.map((p) => ({
            id: p.id,
            title: p.title,
            artist: p.artist,
            description: p.description,
            category: p.category_id,
            image: p.image_url,
            sizes: p.sizes.map((s) => ({
              name: s.name,
              dimensions: s.dimensions,
              price: parseFloat(s.price.toString()),
            })),
            tags: p.tags || [],
            isFeatured: p.is_featured,
            isNew: p.is_new,
          }))}
          columns={4}
        />
      )}
    </div>
  );
}

