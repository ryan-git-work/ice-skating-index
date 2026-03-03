export interface BlogPostMeta {
  slug: string;
  title: string;
  metaDescription: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  category: string;
  publishDate: string;
  excerpt: string;
  fileName: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export const blogPostRegistry: BlogPostMeta[] = [];

export function registerPost(meta: BlogPostMeta) {
  blogPostRegistry.push(meta);
  blogPostRegistry.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

export function getCategories(): string[] {
  const cats = new Set(blogPostRegistry.map(p => p.category));
  return Array.from(cats).sort();
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPostMeta[] {
  return blogPostRegistry
    .filter(p => p.slug !== currentSlug && p.category === category)
    .slice(0, limit);
}

export function parseFrontMatter(raw: string): { meta: Record<string, string>; content: string } {
  const meta: Record<string, string> = {};
  let content = raw;

  if (raw.startsWith("---")) {
    const end = raw.indexOf("---", 3);
    if (end !== -1) {
      const frontMatter = raw.slice(3, end).trim();
      content = raw.slice(end + 3).trim();

      for (const line of frontMatter.split("\n")) {
        const colonIndex = line.indexOf(":");
        if (colonIndex !== -1) {
          const key = line.slice(0, colonIndex).trim();
          const value = line.slice(colonIndex + 1).trim();
          meta[key] = value;
        }
      }
    }
  }

  return { meta, content };
}

export async function fetchPost(fileName: string): Promise<string> {
  const response = await fetch(`/posts/${fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to load post: ${fileName}`);
  }
  return response.text();
}

export function extractExcerpt(content: string, maxLength = 160): string {
  const withoutHeaders = content.replace(/^#{1,6}\s+.+$/gm, "").trim();
  const firstParagraph = withoutHeaders.split("\n\n")[0] || "";
  const plainText = firstParagraph.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "");
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : "Untitled Post";
}
