import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://copywriter.kz/local/api'),
      'process.env.VITE_API_TOKEN': JSON.stringify(env.VITE_API_TOKEN || 'ABE7142D-D8AB-76AF-8D6C-2C4FAEA9B144'),
    }
  };
}); 