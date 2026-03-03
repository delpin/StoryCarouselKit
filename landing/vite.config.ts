import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/StoryCarouselKit/' : '/',
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    alias: {
      '@storycarouselkit/react': path.resolve(__dirname, '../packages/react/src/index.ts'),
      '@storycarouselkit/core': path.resolve(__dirname, '../packages/native/src/index.ts'),
    },
  },
})
