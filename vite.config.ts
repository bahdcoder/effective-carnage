/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        app: "public/index.html",
        server: "core/entry/server.tsx",
        client: "core/entry/client.tsx",
      },
      output: {},
    },
  },
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./core/app/"),
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
    },
  },
})
