import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ancient-number-converter/',
  build: {
    outDir: 'dist',
  },
  test: {
    globals: true,
  },
});
