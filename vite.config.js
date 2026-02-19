import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/ancient-number-converter/',
  define: {
    __BUILD_DATE__: JSON.stringify(
      new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    ),
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        volume: resolve(__dirname, 'volume.html'),
      },
    },
  },
  test: {
    globals: true,
  },
});
