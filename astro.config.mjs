// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Graphik Semibold",
      cssVariable: "--talk-marco-graphik-semibold",
      options: {
        variants: [
          {
            src: ["./src/fonts/GraphikSemibold.otf"],
            weight: 700,
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Graphik Regular",
      cssVariable: "--talk-marco-graphik-regular",
      options: {
        variants: [
          {
            src: ["./src/fonts/GraphikRegular.otf"],
            weight: 400,
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Graphik Medium",
      cssVariable: "--talk-marco-graphik-medium",
      options: {
        variants: [
          {
            src: ["./src/fonts/GraphikMedium.otf"],
            weight: 500,
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.google(),
      name: "Google Sans Flex",
      cssVariable: "--gdg-sans",
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Google Sans Code",
      cssVariable: "--gdg-mono",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["monospace"],
    },
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          // p-slides derives event names from class names (new.target.name)
          keepNames: true,
          manualChunks: (id) => {
            if (id.includes("src/vendor")) return "vendor/[name]";
          },
        },
      },
    },
    plugins: [
      // @ts-ignore
      viteStaticCopy({
        targets: [
          {
            src: "node_modules/p-slides/css/deck.css",
            dest: "css",
            // @ts-ignore
            rename: { stripBase: 3 },
          },
        ],
      }),
    ],
  },
});
