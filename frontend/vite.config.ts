import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173, // 기본 vite 포트
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true, // 내가 localhost:8080 출신이라고 속이는것
      },
    },
  },
});
