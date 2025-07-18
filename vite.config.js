import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 👇 This ensures Vite dev server handles client-side routes too
    historyApiFallback: true
  },
  build: {
    outDir: 'dist',
  },
  base: './', // 👈 important for relative paths when deployed
});
