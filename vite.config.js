import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ancient-number-converter/',
  define: {
    __BUILD_DATE__: JSON.stringify(
      new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    ),
  },
  build: {
    outDir: 'dist',
  },
  test: {
    globals: true,
  },
});
