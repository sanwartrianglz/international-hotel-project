import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// BASE: "/" locally; set VITE_BASE=/international-hotel-project/ when building for GitHub Pages.
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "objects/*.png"],
      manifest: {
        name: "Cecil Housekeeping",
        short_name: "Housekeeping",
        description: "Housekeeping app for Cecil Hotels: one room at a time, icon-first, works offline.",
        theme_color: "#1e293b",
        background_color: "#f6f5f2",
        display: "standalone",
        orientation: "any",
        start_url: base,
        scope: base,
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "fonts", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
});
