/**
 * Zero-dependency static file server for the AI Fitness Coach app.
 *
 * Usage:  npm start        (or: node server.js)
 *         PORT=4000 npm start   to use a different port
 *
 * Serves everything in ./public over HTTP so that ES modules
 * (import/export) load correctly — opening index.html via file://
 * would break module loading, which is why this server exists.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "public");
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Cache-Control": "no-cache", ...headers });
  res.end(body);
}

const server = http.createServer((req, res) => {
  // Strip query string and decode, then normalise
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    return send(res, 400, "Bad request", { "Content-Type": "text/plain" });
  }

  if (urlPath === "/") urlPath = "/index.html";

  // Resolve inside PUBLIC_DIR only — blocks path traversal (../../etc/passwd)
  const requested = path.join(PUBLIC_DIR, urlPath);
  const resolved = path.resolve(requested);
  if (resolved !== PUBLIC_DIR && !resolved.startsWith(PUBLIC_DIR + path.sep)) {
    return send(res, 403, "Forbidden", { "Content-Type": "text/plain" });
  }

  fs.stat(resolved, (err, stats) => {
    if (err || !stats.isFile()) {
      // Single-page app fallback: unknown paths return index.html
      const fallback = path.join(PUBLIC_DIR, "index.html");
      return fs.readFile(fallback, (fbErr, data) => {
        if (fbErr) return send(res, 404, "Not found", { "Content-Type": "text/plain" });
        send(res, 200, data, { "Content-Type": MIME_TYPES[".html"] });
      });
    }

    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(resolved, (readErr, data) => {
      if (readErr) return send(res, 500, "Server error", { "Content-Type": "text/plain" });
      send(res, 200, data, { "Content-Type": contentType });
    });
  });
});

server.listen(PORT, () => {
  console.log("");
  console.log("  AI Fitness Coach is running");
  console.log(`  ->  http://localhost:${PORT}`);
  console.log("");
  console.log("  Press Ctrl+C to stop.");
  console.log("");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  Port ${PORT} is already in use.`);
    console.error(`  Try a different port:  PORT=4000 npm start\n`);
    process.exit(1);
  }
  throw err;
});
