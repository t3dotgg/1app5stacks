import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import codegen from "vite-plugin-graphql-codegen";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), codegen()],
});
