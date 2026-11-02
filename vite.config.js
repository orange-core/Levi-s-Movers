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

export default defineConfig({
  // Relative asset URLs work on GitHub Pages project sites and custom domains.
  base: "./",
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page.replace(".html", ""), resolve(process.cwd(), page)])
      )
    }
  }
});
