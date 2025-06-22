import fs from 'node:fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';
import path from 'node:path';

export default defineConfig(() => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@tools': path.resolve(__dirname, 'src/lib/tools'),
      '@router': path.resolve(__dirname, 'src/router'),
      '@public': path.resolve(__dirname, 'public'),
      '@database': path.resolve(__dirname, 'database'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [vue()],
}));
