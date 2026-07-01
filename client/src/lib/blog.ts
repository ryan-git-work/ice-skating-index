export interface BlogPostMeta {
  slug: string;
  title: string;
  metaDescription: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  category: string;
  publishDate: string;
  modifiedDate?: string;
  excerpt: string;
  fileName: string;
  image?: string;
  hasDynamicRinkLinks?: boolean;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

const staticPostModules = import.meta.env.SSR
  ? import.meta.glob("../../public/posts/*.md", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>
  : {};

const clientPostModules = import.meta.env.SSR
  ? {}
  : import.meta.glob("../../public/posts/*.md", {
      query: "?raw",
      import: "default",
    }) as Record<string, () => Promise<string>>;

const staticPostContent = new Map(
  Object.entries(staticPostModules).map(([filePath, content]) => {
    const fileName = filePath.split("/").pop() || filePath;
    return [fileName, content];
  }),
);

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
  const loader = clientPostModules[`../../public/posts/${fileName}`];
  if (!loader) {
    throw new Error(`Post is not included in the client build: ${fileName}`);
  }
  return loader();
}

export function getStaticPostContent(fileName: string): string | null {
  return staticPostContent.get(fileName) ?? null;
}

export function preparePostContent(raw: string, hasDynamicRinkLinks: boolean | undefined, rinks: any[]): string {
  let { content } = parseFrontMatter(raw);
  content = content.replace(/^\s*#\s+[^\r\n]+(?:\r?\n)+/, "");
  if (hasDynamicRinkLinks) {
    content = replaceRinkPlaceholders(content, rinks);
  }
  return content;
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

export function extractFaqItems(content: string): Array<{ question: string; answer: string }> {
  const faqStart = content.search(/^##\s+Frequently Asked Questions\s*$/im);
  if (faqStart === -1) return [];

  const faqSection = content.slice(faqStart);
  const items: Array<{ question: string; answer: string }> = [];
  const matches = Array.from(
    faqSection.matchAll(/^###\s+(.+?)\s*\n+([\s\S]*?)(?=^###\s+|^##\s+|(?![\s\S]))/gm),
  );

  for (const match of matches) {
    const answer = match[2]
      .trim()
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ");
    if (answer) items.push({ question: match[1].trim(), answer });
  }

  return items;
}

export async function getPostImage(slug: string): Promise<string> {
  try {
    const response = await fetch(`/api/blog/image/${slug}`);
    if (!response.ok) return "/images/skating/1_1772560369651.png";
    const data = await response.json();
    return `/images/skating/${data.image}`;
  } catch (e) {
    return "/images/skating/1_1772560369651.png";
  }
}

export function getImageAlt(filename: string): string {
  if (!filename) return "Ice skating";
  const name = filename.split('/').pop() || filename;
  return name.split('.')[0].replace(/[_-]/g, ' ');
}

export function replaceRinkPlaceholders(content: string, rinks: any[]): string {
  const rinkMap = new Map(rinks.map(r => [r.slug, r.name]));
  
  return content.replace(/\[RINK: ([^\]]+)\]/g, (match, slug) => {
    const rinkName = rinkMap.get(slug);
    if (rinkName) {
      return `<a href="/rink/${slug}">${rinkName}</a>`;
    } else {
      if (typeof window !== 'undefined' && window.console) {
        console.warn(`[Ice Skating Index] Rink slug not found in database: "${slug}". Link will render as plain text.`);
      }
      return slug;
    }
  });
}
