// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        format: 'system',
        entryFileNames: 'main.js',
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'chunks/[name].js',
      },
    },
  },
  publicDir: 'public',
  server: {
    open: false,
  },
})
