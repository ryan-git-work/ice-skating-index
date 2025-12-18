import type { Express } from "express";
import type { Server } from "http";

// Import rinks data for sitemap generation
import rinksData from "../client/src/data/rinks.json";

interface Rink {
  id: string;
  slug: string;
  name: string;
  address: {
    state: string;
    city: string;
  };
  last_verified: string;
}

const rinks = rinksData as Rink[];

function getAllStates(): string[] {
  const states = new Set(rinks.map((r) => r.address.state));
  return Array.from(states).sort();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Sitemap.xml - Dynamically generate sitemap for SEO
  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = "https://iceskatingindex.com";
    const now = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Browse Page -->
  <url>
    <loc>${baseUrl}/browse</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Freestyle Hub -->
  <url>
    <loc>${baseUrl}/freestyle</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- State Hubs -->
${getAllStates().map(state => `  <url>
    <loc>${baseUrl}/state/${state}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
  
  <!-- Individual Rink Pages -->
${rinks.map(rink => `  <url>
    <loc>${baseUrl}/rink/${rink.slug}</loc>
    <lastmod>${rink.last_verified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Robots.txt - Allow all crawlers
  app.get("/robots.txt", (_req, res) => {
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://iceskatingindex.com/sitemap.xml

# Disallow admin areas (none currently)
`;
    
    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  return httpServer;
}
