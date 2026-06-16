import type { Express } from "express";
import type { Server } from "http";

import rinksData from "../client/src/data/rinks.json";
import blogPosts from "../client/src/data/blog-posts.json";
import fs from "fs/promises";
import path from "path";

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
  const states = new Set(rinks.map((r) => r.address.state.toLowerCase()));
  return Array.from(states).sort();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = "https://iceskatingindex.com";
    const now = new Date().toISOString().split('T')[0];
    const indexableBlogPosts = (blogPosts as any[]).filter(
      (post) => post.slug !== "ice-skating-nashville"
    );

    // Build unique city pages from rinks data
    const citySet = new Set<string>();
    rinks.forEach(r => {
      const stateSlug = r.address.state.toLowerCase().replace(/\s+/g, '-');
      const citySlug = r.address.city.toLowerCase().replace(/\s+/g, '-');
      citySet.add(`${stateSlug}|${citySlug}`);
    });
    const cities = Array.from(citySet).map(entry => {
      const [state, city] = entry.split('|');
      return { state, city };
    });

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

  <!-- Static Content Pages -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/freestyle</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/learn-to-skate</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/skate-sharpening</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- State Hubs -->
${getAllStates().map(state => `  <url>
    <loc>${baseUrl}/state/${state}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}

  <!-- City Hubs -->
${cities.map(({ state, city }) => `  <url>
    <loc>${baseUrl}/city/${state}/${city}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}

  <!-- Individual Rink Pages -->
${rinks.map(rink => `  <url>
    <loc>${baseUrl}/rink/${rink.slug}</loc>
    <lastmod>${rink.last_verified || now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}

  <!-- Blog Index -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Blog Posts -->
${indexableBlogPosts.map((post: any) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.publishDate || now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  app.get("/robots.txt", (_req, res) => {
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://iceskatingindex.com/sitemap.xml

# Disallow admin areas (none currently)
`;
    
    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  app.get("/blog/ice-skating-nashville", (_req, res) => {
    res.redirect(301, "/city/tn/nashville");
  });

  app.get("/blog/ice-skating-nashville/", (_req, res) => {
    res.redirect(301, "/city/tn/nashville");
  });

  app.get("/tennessee/nashville-ice-skating", (_req, res) => {
    res.redirect(301, "/city/tn/nashville");
  });

  app.get("/tennessee/nashville-ice-skating/", (_req, res) => {
    res.redirect(301, "/city/tn/nashville");
  });

  app.get("/rink/brighton-arena-brighton-ma", (_req, res) => {
    res.redirect(301, "/rink/reilly-memorial-rink-brighton-ma");
  });

  app.get("/rink/brighton-arena-brighton-ma/", (_req, res) => {
    res.redirect(301, "/rink/reilly-memorial-rink-brighton-ma");
  });

  app.get(/^\/state\/([A-Z]{2})\/?$/, (req, res) => {
    res.redirect(301, `/state/${req.params[0].toLowerCase()}`);
  });

  app.post("/api/email-signup", async (req, res) => {
    const { email, city, date } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const dataPath = path.resolve(process.cwd(), "client/public/data/email-signups.json");
    try {
      let signups: Array<{ email: string; city?: string; date: string }> = [];
      try {
        const data = await fs.readFile(dataPath, "utf-8");
        signups = JSON.parse(data);
      } catch (e) {
        // File doesn't exist yet
      }
      signups.push({ email, city, date: date || new Date().toISOString() });
      await fs.writeFile(dataPath, JSON.stringify(signups, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving email signup:", error);
      res.status(500).json({ error: "Failed to save signup" });
    }
  });

  app.get("/api/blog/image/:slug", async (req, res) => {
    const { slug } = req.params;
    const dataPath = path.resolve(process.cwd(), "client/public/data/post-image-map.json");
    const imagesDir = path.resolve(process.cwd(), "client/public/images/skating");

    try {
      let map: Record<string, string> = {};
      try {
        const data = await fs.readFile(dataPath, "utf-8");
        map = JSON.parse(data);
      } catch (e) {
      }

      if (map[slug]) {
        return res.json({ image: map[slug] });
      }

      const files = await fs.readdir(imagesDir);
      const imageFiles = files.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
      
      const assignedImages = new Set(Object.values(map));
      const availableImages = imageFiles.filter(f => !assignedImages.has(f));
      
      let selectedImage: string;
      if (availableImages.length > 0) {
        selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
      } else {
        selectedImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
      }

      map[slug] = selectedImage;
      await fs.writeFile(dataPath, JSON.stringify(map, null, 2));

      res.json({ image: selectedImage });
    } catch (error) {
      console.error("Error assigning blog image:", error);
      res.status(500).json({ error: "Failed to assign image" });
    }
  });

  return httpServer;
}
