
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // We use an object to provide a default value ('') if the environment variable is missing.
    // This prevents the "API_KEY environment variable is undefined" error during local development.
    EnvironmentPlugin({
      API_KEY: '',
    }, { defineOn: 'process.env' })
  ],
  base: './', // Ensures assets load correctly on GitHub Pages
  build: {
    outDir: 'dist',
  },
});
