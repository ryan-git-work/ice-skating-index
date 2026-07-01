import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useHead } from "@/hooks/use-head";
import { Link } from "wouter";
import { blogPostRegistry, getCategories } from "@/lib/blog";
import "@/data/blogRegistry";
import { BlogImage } from "@/components/BlogImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { buildWebPageSchema } from "@/lib/seo";

export default function BlogIndex() {
  const description = "Ice skating tips, guides, and resources. Learn about rinks, gear, skating techniques, and more.";

  useHead({
    title: "Blog",
    description,
    canonicalPath: "/blog",
    structuredData: [buildWebPageSchema("/blog", "Ice Skating Index Blog", description, "Blog")],
  });

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = getCategories();

  const filteredPosts = activeCategory
    ? blogPostRegistry.filter(p => p.category === activeCategory)
    : blogPostRegistry;

  return (
    <Layout>
      <div className="page-band border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span>Blog</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-blog-heading">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Ice skating tips, guides, and resources to help you find the right rink and get more out of every session.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10" data-testid="blog-category-filters">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
              data-testid="button-category-all"
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        <div className="grid gap-8 max-w-3xl">
          {filteredPosts.map(post => (
            <article
              key={post.slug}
              className="group border rounded-lg p-6 bg-card hover:shadow-md hover:border-primary/20 transition-all flex flex-col md:flex-row gap-6"
              data-testid={`card-blog-post-${post.slug}`}
            >
              <div className="md:w-[200px] h-[140px] flex-shrink-0 relative overflow-hidden rounded-lg">
                <BlogImage 
                  post={post} 
                  type="thumbnail"
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.publishDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`} data-testid={`link-blog-post-${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <Link href={`/blog/${post.slug}`}>
                  <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </article>
          ))}

          {filteredPosts.length === 0 && (
            <p className="text-muted-foreground text-center py-12">
              No posts found in this category.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
