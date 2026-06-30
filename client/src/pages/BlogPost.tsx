import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useHead } from "@/hooks/use-head";
import { Link, useParams } from "wouter";
import {
  blogPostRegistry,
  getRelatedPosts,
  fetchPost,
  extractFaqItems,
  getStaticPostContent,
  preparePostContent,
} from "@/lib/blog";
import "@/data/blogRegistry";
import { BlogImage } from "@/components/BlogImage";
import { rinks } from "@/lib/data";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, ArrowRight, User } from "lucide-react";
import { SITE_URL } from "@/lib/seo";
import { getLatestStatusUpdated } from "@/lib/skateStatus";
import { SharpeningConnector } from "@/components/SharpeningConnector";

function trimExcerpt(text: string, max = 155) {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function formatPublishDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const parsed = year && month && day
    ? new Date(year, month - 1, day)
    : new Date(date);

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const postMeta = blogPostRegistry.find(p => p.slug === slug);
  const initialContent = postMeta
    ? getStaticPostContent(postMeta.fileName)
    : null;
  const renderedInitialContent = initialContent
    ? preparePostContent(initialContent, postMeta?.hasDynamicRinkLinks, rinks)
    : null;
  const [content, setContent] = useState<string | null>(renderedInitialContent);
  const [loading, setLoading] = useState(!renderedInitialContent);
  const [error, setError] = useState(false);
  const latestStatusDate = postMeta?.slug === "ice-skating-nashville-this-weekend"
    ? getLatestStatusUpdated()
    : undefined;
  const modifiedDate = [postMeta?.publishDate, postMeta?.modifiedDate, latestStatusDate]
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
  const faqItems = renderedInitialContent ? extractFaqItems(renderedInitialContent) : [];

  const articleSchema = postMeta
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: postMeta.title,
        description: postMeta.excerpt,
        datePublished: postMeta.publishDate,
        dateModified: modifiedDate,
        author: {
          "@type": "Organization",
          name: "Ice Skating Index",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Ice Skating Index",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/favicon.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/blog/${postMeta.slug}`,
        },
      }
    : null;

  const faqSchema = postMeta && faqItems.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE_URL}/blog/${postMeta.slug}#faq`,
        url: `${SITE_URL}/blog/${postMeta.slug}`,
        dateModified: modifiedDate,
        mainEntity: faqItems.map(item => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  const breadcrumbSchema = postMeta
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: postMeta.title, item: `${SITE_URL}/blog/${postMeta.slug}` },
        ],
      }
    : null;

  useHead({
    title: postMeta?.title || "Blog Post",
    description: postMeta ? trimExcerpt(postMeta.excerpt) : "",
    canonicalPath: postMeta ? `/blog/${postMeta.slug}` : undefined,
    structuredData: [articleSchema, breadcrumbSchema, faqSchema].filter(Boolean) as object[],
  });

  useEffect(() => {
    if (!postMeta) {
      setLoading(false);
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    if (renderedInitialContent) {
      setContent(renderedInitialContent);
      setLoading(false);
      return;
    }
    fetchPost(postMeta.fileName)
      .then(raw => {
        setContent(preparePostContent(raw, postMeta.hasDynamicRinkLinks, rinks));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug, postMeta, renderedInitialContent]);

  if (!postMeta || error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you are looking for does not exist.</p>
          <Link href="/blog" className="text-primary hover:underline">Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  const relatedPosts = getRelatedPosts(postMeta.slug, postMeta.category);
  const title = postMeta.title;

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/"><span className="hover:text-primary cursor-pointer">Home</span></Link>
            <span>/</span>
            <Link href="/blog"><span className="hover:text-primary cursor-pointer">Blog</span></Link>
            <span>/</span>
            <span className="truncate max-w-[200px]">{title}</span>
          </div>
          <Badge variant="secondary" className="mb-3 text-xs font-normal">
            {postMeta.category}
          </Badge>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-post-title">
            {title}
          </h1>
          
          <div className="w-full h-[400px] mb-8 relative overflow-hidden rounded-xl animate-in fade-in duration-700">
            <BlogImage 
              post={postMeta} 
              type="hero"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Published by Ice Skating Index
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatPublishDate(postMeta.publishDate)}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          ) : content ? (
            <article className="prose prose-slate max-w-none prose-headings:font-serif prose-h1:hidden prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:text-left prose-th:font-semibold prose-th:border-b prose-th:pb-2 prose-th:pr-4 prose-td:py-2 prose-td:pr-4 prose-td:border-b prose-td:border-muted">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {content}
              </ReactMarkdown>
            </article>
          ) : null}

          {postMeta.slug === "skate-sharpening-nashville" && (
            <div className="mt-10">
              <SharpeningConnector />
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-10 border-t">
              <h2 className="font-serif text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid gap-4">
                {relatedPosts.map(related => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group flex items-center justify-between p-4 border rounded-lg hover:border-primary/20 hover:shadow-sm transition-all"
                    data-testid={`link-related-post-${related.slug}`}
                  >
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{related.excerpt}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-4 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t">
            <Link href="/blog" className="text-primary hover:underline flex items-center gap-2 text-sm font-medium" data-testid="link-back-to-blog">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
