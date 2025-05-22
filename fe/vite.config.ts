// fe/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Force Three.js resolution
      'three': path.resolve('./node_modules/three'),
    },
  },
  optimizeDeps: {
    include: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'react-konva',
      'konva'
    ],
    exclude: [
      'three-mesh-bvh' // Exclude problematic packages
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'konva-vendor': ['react-konva', 'konva'],
          'ui-vendor': ['antd', 'react-router-dom']
        }
      },
      external: [
        // Externalize problematic packages
        'three-mesh-bvh'
      ]
    },
    // Increase chunk size warning limit for 3D assets
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      // Handle CommonJS modules
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: false
    }
  },
  define: {
    // Define global constants for Three.js
    __THREE_DEVTOOLS__: JSON.stringify({
      dispatchEvent: () => {},
      addEventListener: () => {},
      removeEventListener: () => {}
    }),
    global: 'globalThis'
  },
  esbuild: {
    // Handle import errors
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'import-is-undefined': 'silent'
    }
  }
})