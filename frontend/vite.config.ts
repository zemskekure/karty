import { defineConfig, Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetPlugin(): Plugin {
  return {
    name: 'figma-asset-resolver',
    resolveId(source) {
      if (source.startsWith('figma:asset/')) {
        const filename = source.replace('figma:asset/', '');
        return path.resolve(__dirname, 'src/assets', filename);
      }
      return null;
    },
  };
}

export default defineConfig(({ command }) => ({
  // Served at https://zemskekure.github.io/karty/ in production.
  base: command === 'build' ? '/karty/' : '/',
  plugins: [
    figmaAssetPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.mp4'],
}))
