import Link from "next/link";
import { ArrowRight, Truck, Shield, Award } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PosterGrid } from "@/components/posters/PosterGrid";
import { Button } from "@/components/ui/button";
import { getFeaturedPosters, categories } from "@/lib/data";
import heroImage from "@/assets/hero-gallery.jpg";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over ₹2,999" },
  { icon: Shield, title: "Secure Payment", desc: "100% protected checkout" },
  { icon: Award, title: "Premium Quality", desc: "Museum-grade prints" },
];

export default function Index() {
  const featuredPosters = getFeaturedPosters();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage.src}
            alt="Luxury art gallery"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <div
              className="divider-gold opacity-0 animate-fade-up"
              style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
            />
            <h1
              className="font-serif text-5xl lg:text-7xl font-medium leading-tight opacity-0 animate-fade-up"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              Curated Art for <span className="gold-gradient-text">Discerning</span>{" "}
              Collectors
            </h1>
            <p
              className="text-lg text-muted-foreground max-w-lg opacity-0 animate-fade-up"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              Discover museum-quality posters from world-class artists. Transform your
              space with art that inspires.
            </p>

            <div
              className="flex flex-wrap gap-4 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <Button asChild size="lg" className="btn-gold h-12 px-8">
                <Link href="/gallery">
                  Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 border-foreground/20 hover:bg-foreground/5"
              >
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-y border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="divider-gold mx-auto mb-4" />
            <h2 className="font-serif text-4xl lg:text-5xl font-medium">
              Featured Collection
            </h2>
            <p className="text-muted-foreground mt-3">
              Hand-picked pieces by our curators
            </p>
          </div>

          <PosterGrid posters={featuredPosters} columns={4} />

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="h-12 px-8">
              <Link href="/gallery">
                View All Posters <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="divider-gold mx-auto mb-4" />
            <h2 className="font-serif text-4xl lg:text-5xl font-medium">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/gallery?category=${cat.slug}`}
                className="group p-6 bg-secondary/50 rounded-lg text-center hover:bg-secondary transition-colors"
              >
                <h3 className="font-serif text-lg font-medium group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
