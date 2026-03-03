import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { rinks } from "@/lib/data";
import { RinkCard } from "@/components/RinkCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "wouter";
import { useHead } from "@/hooks/use-head";
import { blogPostRegistry } from "@/lib/blog";
import "@/data/blogRegistry";
import { BlogImage } from "@/components/BlogImage";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  useHead({
    title: "Home",
    description: "The definitive directory for ice skating rinks, schedules, and freestyle sessions."
  });

  const featuredRinks = rinks.slice(0, 3);
  const latestPosts = blogPostRegistry.slice(0, 3);

  return (
    <Layout>
      <Hero />
      
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2">Featured Rinks</h2>
              <p className="text-muted-foreground">Discover top-rated facilities near you</p>
            </div>
            <Link href="/browse">
              <Button variant="ghost" className="hidden sm:flex group">
                View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRinks.map((rink) => (
              <RinkCard key={rink.id} rink={rink} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/browse">
              <Button variant="outline" className="w-full">View All Rinks</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2">City Hubs</h2>
              <p className="text-muted-foreground">Comprehensive guides to skating in your city</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/tennessee/nashville-ice-skating">
              <div className="group h-full flex flex-col overflow-hidden border rounded-xl transition-all hover:shadow-md hover:border-primary/20 bg-card cursor-pointer">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src="/attached_assets/iceskatingindex1_1766179636449.jpg" 
                    alt="Ice skating in Nashville"
                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-serif text-2xl font-bold text-white">Nashville, TN</h3>
                    <p className="text-white/80 text-sm">3 rinks</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground">
                    Find the best rinks for public skate, lessons, freestyle, and hockey in Nashville.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2">Latest from the Blog</h2>
              <p className="text-muted-foreground">Expert tips and guides for every skater</p>
            </div>
            <Link href="/blog">
              <Button variant="ghost" className="hidden sm:flex group">
                Read All Posts <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <article
                key={post.slug}
                className="group border rounded-xl overflow-hidden bg-card hover:shadow-md hover:border-primary/20 transition-all flex flex-col"
              >
                <div className="h-48 relative overflow-hidden">
                  <BlogImage 
                    post={post} 
                    type="thumbnail"
                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.publishDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer">
                        Read more <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/blog">
              <Button variant="outline" className="w-full">View All Posts</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
               <div className="aspect-square rounded-2xl bg-secondary/30 relative overflow-hidden">
                 {/* Abstract representation of Freestyle */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                 <div className="absolute bottom-8 left-8 right-8">
                   <div className="bg-background/90 backdrop-blur p-6 rounded-xl shadow-lg border">
                     <div className="flex items-center gap-3 mb-3">
                       <div className="h-3 w-3 rounded-full bg-green-500" />
                       <span className="font-mono text-sm font-medium">Session Available</span>
                     </div>
                     <p className="font-serif text-lg font-bold">Freestyle: 6:00 AM - 8:00 AM</p>
                     <p className="text-sm text-muted-foreground">Main Rink • $15/session</p>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="font-serif text-4xl font-bold mb-6">Find Freestyle Sessions</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Stop digging through PDF schedules and outdated websites. We verify freestyle session times, costs, and coaching policies for serious figure skaters.
              </p>
              <ul className="space-y-4 mb-8">
                {["Verified Schedules", "Pricing & Package Info", "Coach Policies", "Rink Etiquette"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">✓</div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/freestyle">
                <Button size="lg">Explore Freestyle Hub</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
