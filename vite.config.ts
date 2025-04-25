/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
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
	test: {
		environment: "node",
	},
});
