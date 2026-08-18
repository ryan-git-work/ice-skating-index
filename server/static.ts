import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, {
    redirect: false,
    setHeaders(res, filePath) {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }));

  // Serve pre-rendered index.html for SPA routes that have one
  app.use("*", (req, res) => {
    const reqPath = req.originalUrl.split("?")[0];
    // Try the pre-rendered page for this exact path
    const prerenderedPath = path.join(distPath, reqPath, "index.html");
    if (fs.existsSync(prerenderedPath)) {
      res.sendFile(prerenderedPath);
    } else {
      res.status(404).sendFile(path.resolve(distPath, "404.html"));
    }
  });
}
