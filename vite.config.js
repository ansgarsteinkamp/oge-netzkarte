import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
   plugins: [react(), tailwindcss()],
   // Keep production assets portable for GitHub Pages and other subpath/static deployments.
   base: "./",
   resolve: {
      alias: {
         "@": fileURLToPath(new URL("./src", import.meta.url))
      }
   }
});
