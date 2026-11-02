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
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page.replace(".html", ""), resolve(process.cwd(), page)])
      )
    }
  }
});