"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Eye, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";

interface Poster {
  id: string;
  title: string;
  artist: string;
  description: string;
  category_id: string;
  image_url: string;
  is_featured: boolean;
  is_new: boolean;
  status: string;
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
}

export default function AdminPostersPage() {
  const { user, session: authSession, isAdmin, loading: authLoading } = useAuth();
  // authSession is the session stored in AuthContext (more reliable than calling getSession())
  const router = useRouter();
  const [posters, setPosters] = useState<Poster[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [deletePosterId, setDeletePosterId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    description: "",
    category_id: "",
    image_url: "",
    is_featured: false,
    is_new: false,
    status: "active",
    sizes: [
      { name: "Small", dimensions: "30 × 40 cm", price: 0 },
      { name: "Medium", dimensions: "50 × 70 cm", price: 0 },
      { name: "Large", dimensions: "70 × 100 cm", price: 0 },
    ],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (!authLoading && !isAdmin) {
      router.push("/");
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchPosters();
      fetchCategories();
    }
  }, [isAdmin]);

  const fetchPosters = async () => {
    try {
      const { data, error } = await supabase
        .from("posters")
        .select(`
          *,
          sizes:poster_sizes(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosters(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch posters: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Admins can see all categories (active and inactive)
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories: " + error.message);
    }
  };

  const handleOpenDialog = (poster?: Poster) => {
    console.log('[admin/posters] handleOpenDialog', { posterId: poster?.id, isEdit: !!poster });
    if (poster) {
      setSelectedPoster(poster);
      setFormData({
        title: poster.title,
        artist: poster.artist,
        description: poster.description || "",
        category_id: poster.category_id || "",
        image_url: poster.image_url,
        is_featured: poster.is_featured,
        is_new: poster.is_new,
        status: poster.status,
        sizes: poster.sizes.map((s) => ({
          name: s.name,
          dimensions: s.dimensions,
          price: s.price,
        })),
      });
    } else {
      setSelectedPoster(null);
      setFormData({
        title: "",
        artist: "",
        description: "",
        category_id: "",
        image_url: "",
        is_featured: false,
        is_new: false,
        status: "active",
        sizes: [
          { name: "Small", dimensions: "30 × 40 cm", price: 0 },
          { name: "Medium", dimensions: "50 × 70 cm", price: 0 },
          { name: "Large", dimensions: "70 × 100 cm", price: 0 },
        ],
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    console.log('[admin/posters] handleSubmit start', { selectedPoster: !!selectedPoster, title: formData.title });
    try {
      console.log('[admin/posters] immediate log after start');
      toast.info('Submitting poster...');
      console.log('[admin/posters] after toast.info');
      if (!formData.title || !formData.artist || !formData.image_url) {
        console.log('[admin/posters] validation failed', { title: formData.title, artist: formData.artist, image_url: formData.image_url });
        toast.error("Please fill in all required fields");
        return;
      }

      // Safely get session (avoid destructuring errors when response shape is unexpected)
      // Prefer session from AuthContext when available
      let session = authSession ?? null;
      if (session) {
        console.log('[admin/posters] using session from AuthContext', { userId: session.user?.id });
      } else {
        try {
          console.log('[admin/posters] no session in context, calling supabase.auth.getSession (with timeout)');
          const getSessionPromise = supabase.auth.getSession();
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('getSession timed out after 5000ms')), 5000));
          const sessionRes = await Promise.race([getSessionPromise, timeoutPromise]);
          session = sessionRes?.data?.session ?? null;
          console.log('[admin/posters] session fetched via getSession', { sessionRes, hasSession: !!session, userId: session?.user?.id });
          toast.info(session ? 'Session found' : 'No session');
        } catch (sessionErr) {
          console.error('[admin/posters] getSession threw error or timed out', sessionErr);
          toast.error('Error reading session: ' + (sessionErr?.message || 'unknown'));
          return;
        }
      }

      if (!session) {
        console.log('[admin/posters] missing session, aborting create');
        toast.error("Not authenticated");
        return;
      }

      if (selectedPoster) {
        console.log('[admin/posters] updating poster', { id: selectedPoster.id });
        toast.info('Updating poster...');
        // Update existing poster
        const { error: posterError } = await supabase
          .from("posters")
          .update({
            title: formData.title,
            artist: formData.artist,
            description: formData.description,
            category_id: formData.category_id || null,
            image_url: formData.image_url,
            is_featured: formData.is_featured,
            is_new: formData.is_new,
            status: formData.status,
          })
          .eq("id", selectedPoster.id);

        if (posterError) throw posterError;

        // Update sizes
        console.log('[admin/posters] deleting old sizes for poster', selectedPoster.id);
        await supabase.from("poster_sizes").delete().eq("poster_id", selectedPoster.id);

        const sizesData = formData.sizes
          .filter((s) => s.price > 0)
          .map((size) => ({
            poster_id: selectedPoster.id,
            name: size.name,
            dimensions: size.dimensions,
            price: size.price,
            is_available: true,
            display_order: size.name === "Small" ? 1 : size.name === "Medium" ? 2 : 3,
          }));

        console.log('[admin/posters] inserting sizes', sizesData);
        if (sizesData.length > 0) {
          await supabase.from("poster_sizes").insert(sizesData);
        }

        console.log('[admin/posters] poster updated');
        toast.success("Poster updated successfully!");
      } else {
        // Create new poster via server API (ensures admin role & RLS pass)
        const slug = formData.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

        const payload = {
          title: formData.title,
          slug,
          artist: formData.artist,
          description: formData.description,
          category_id: formData.category_id || null,
          image_url: formData.image_url,
          is_featured: formData.is_featured,
          is_new: formData.is_new,
          status: formData.status,
          sizes: formData.sizes
            .filter((s) => s.price > 0)
            .map((size) => ({
              name: size.name,
              dimensions: size.dimensions,
              price: size.price,
              is_available: true,
              display_order: size.name === "Small" ? 1 : size.name === "Medium" ? 2 : 3,
            })),
        };

        console.log('[admin/posters] creating poster via API', { title: payload.title, sizesCount: payload.sizes.length });
        toast.info('Sending create request to server...');

        const res = await fetch("/api/posters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        });

        console.log('[admin/posters] /api/posters response status', res.status);
        toast.info(`Server responded ${res.status}`);
        const result = await res.json();
        console.log('[admin/posters] /api/posters response body', result);
        if (!res.ok) {
          toast.error(`Server error: ${result?.error || res.status}`);
          throw new Error(result?.error || "Failed to create poster");
        }

        const newPoster = result.data;
        console.log('[admin/posters] poster created', newPoster?.id);
        toast.success("Poster created successfully!");
      }

      setDialogOpen(false);
      fetchPosters();
    } catch (error: any) {
      console.error('[admin/posters] handleSubmit error', error);
      toast.error("Failed to save poster: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!deletePosterId) return;

    try {
      const { error } = await supabase.from("posters").delete().eq("id", deletePosterId);
      if (error) throw error;

      toast.success("Poster deleted successfully!");
      setDeleteDialogOpen(false);
      setDeletePosterId(null);
      fetchPosters();
    } catch (error: any) {
      toast.error("Failed to delete poster: " + error.message);
    }
  };

  const updateSizePrice = (index: number, price: number) => {
    const newSizes = [...formData.sizes];
    newSizes[index].price = price;
    setFormData({ ...formData, sizes: newSizes });
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl lg:text-4xl font-medium mb-2">Manage Posters</h1>
          <p className="text-muted-foreground">Add, edit, or delete posters from your collection</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="btn-gold">
          <Plus className="mr-2 h-4 w-4" />
          Add New Poster
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No posters found. Click "Add New Poster" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                posters.map((poster) => {
                  const prices = poster.sizes?.map((s) => s.price) || [];
                  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

                  return (
                    <TableRow key={poster.id}>
                      <TableCell>
                        <div className="h-16 w-16 rounded overflow-hidden bg-secondary">
                          {poster.image_url ? (
                            <img
                              src={poster.image_url}
                              alt={poster.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{poster.title}</TableCell>
                      <TableCell>{poster.artist}</TableCell>
                      <TableCell>
                        {categories.find((c) => c.id === poster.category_id)?.name || "—"}
                      </TableCell>
                      <TableCell>
                        {minPrice > 0 ? (
                          <span>
                            {formatPrice(minPrice)}
                            {maxPrice > minPrice ? ` - ${formatPrice(maxPrice)}` : ""}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={poster.status === "active" ? "default" : "secondary"}
                        >
                          {poster.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(poster)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletePosterId(poster.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>{selectedPoster ? "Edit Poster" : "Add New Poster"}</DialogTitle>
            <DialogDescription>
              Fill in the details below. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">
                  Poster Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Golden Waves"
                />
              </div>
              <div>
                <Label htmlFor="artist">
                  Artist Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  placeholder="e.g., Posters Hous Studio"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image_url">
                Image URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste the full image URL here. You can use Unsplash, Imgur, or any image hosting
                service.
              </p>
              {formData.image_url && (
                <div className="mt-2 h-32 w-32 rounded overflow-hidden bg-secondary">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the poster..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded"
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Featured
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_new"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  className="h-4 w-4 rounded"
                />
                <Label htmlFor="is_new" className="cursor-pointer">
                  New Arrival
                </Label>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="text-base font-medium mb-4 block">Pricing & Sizes</Label>
              <div className="space-y-3">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="grid grid-cols-4 gap-3 items-end">
                    <div>
                      <Label>{size.name}</Label>
                      <Input value={size.dimensions} disabled className="bg-muted" />
                    </div>
                    <div>
                      <Label>Price (₹)</Label>
                      <Input
                        type="number"
                        value={size.price || ""}
                        onChange={(e) =>
                          updateSizePrice(index, parseFloat(e.target.value) || 0)
                        }
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Set price to 0 if you don't want to offer that size.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log('[admin/posters] action button clicked', { mode: selectedPoster ? 'update' : 'create' });
                handleSubmit();
              }}
              className="btn-gold"
            >
              {selectedPoster ? "Update Poster" : "Create Poster"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the poster and all its
              sizes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

