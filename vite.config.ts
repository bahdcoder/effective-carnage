import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
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
});
