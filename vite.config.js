import { defineConfig } from "vite";
import { resolve } from "node:path";

const pages = [
  "index.html",
  "about.html",
  "local-moving.html",
  "long-distance.html",
  "packing-services.html",
  "commercial-moving.html",
  "service-areas.html",
  "contact.html",
  "privacy.html"
];

// GitHub Pages serves this project from /Levi-s-Movers/, while local development uses the root path.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? "/Levi-s-Movers/" : "/",
  // Relative asset paths keep CSS and JS working on GitHub Pages project URLs.
  base: "./",
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page.replace(".html", ""), resolve(process.cwd(), page)])
      )
    }
  }
});