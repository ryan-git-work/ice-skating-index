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

  app.use(express.static(distPath));

  // Serve pre-rendered index.html for SPA routes that have one
  app.use("*", (req, res) => {
    const reqPath = req.path;
    // Try the pre-rendered page for this exact path
    const prerenderedPath = path.join(distPath, reqPath, "index.html");
    if (fs.existsSync(prerenderedPath)) {
      res.sendFile(prerenderedPath);
    } else {
      // Fall back to root index.html for client-side routing
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
