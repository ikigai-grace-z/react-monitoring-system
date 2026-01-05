import { fileURLToPath } from 'url'

import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      PUBLIC_APP_VERSION: JSON.stringify(env.npm_package_version),
    },
    optimizeDeps: {
      exclude: ['@byteplus/webar'],
    },
    plugins: [
      // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
      tanstackRouter({
        autoCodeSplitting: true,
        target: 'react',
      }),
      react(),
      tailwindcss(),
      tsconfigPaths({
        projects: ['./tsconfig.app.json'],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      allowedHosts: ['.dev'],
      open: true,
      port: 23000,
    },
  }
})
