import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Configures the dev server to run on http://localhost:5173
    host: true  // Allows access over local networks (e.g. mobile testing)
  }
});
