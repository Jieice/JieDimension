/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/assets/games/battle-royale/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    minify: 'esbuild',
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
