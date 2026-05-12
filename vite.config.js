import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

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
