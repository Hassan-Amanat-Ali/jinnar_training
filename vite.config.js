import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    // Define process.env for browser compatibility
    "process.env": {},
    global: "globalThis",
  },
  optimizeDeps: {
    exclude: ["cloudinary"],
  },
});
