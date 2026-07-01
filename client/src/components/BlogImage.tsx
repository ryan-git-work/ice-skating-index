import { useState, useEffect } from "react";
import { BlogPostMeta, getPostImage, getImageAlt } from "@/lib/blog";
import { cn } from "@/lib/utils";

export function BlogImage({ post, className, type = 'thumbnail' }: { post: BlogPostMeta, className?: string, type?: 'thumbnail' | 'hero' }) {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    getPostImage(post.slug).then(setImageSrc);
  }, [post.slug]);

  if (!imageSrc) return <div className={cn("bg-muted animate-pulse", className)} />;

  return (
    <img
      src={imageSrc}
      alt={getImageAlt(imageSrc)}
      className={cn(
        "transition-opacity duration-700",
        type === 'hero' ? "w-full h-full object-cover" : "w-full h-full object-cover rounded-lg",
        className
      )}
      loading="lazy"
    />
  );
}

export function RandomSkatingImage({ post, className }: { post?: BlogPostMeta, className?: string }) {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    if (post) {
      getPostImage(post.slug).then(setImageSrc);
    }
  }, [post]);

  if (!imageSrc) return null;

  return (
    <div className={cn("overflow-hidden rounded-lg border bg-card", className)}>
      <img
        src={imageSrc}
        alt={getImageAlt(imageSrc)}
        className="w-full h-auto object-cover"
      />
    </div>
  );
}
