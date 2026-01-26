import { fileURLToPath } from 'url'

import * as transformer from '@libmedia/cheap/build/transformer'
import typescript from '@rollup/plugin-typescript'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      PUBLIC_APP_VERSION: JSON.stringify(env.npm_package_version),
    },
    optimizeDeps: {
      exclude: ['@byteplus/webar', '@libmedia/avplayer'],
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
      typescript({
        tsconfig: './tsconfig.json',
        transformers: {
          before: [
            {
              type: 'program',
              factory: (program) => {
                return transformer.before(program)
              },
            },
          ],
        },
        include: [
          '@libmedia/cheap/heap',
          '@libmedia/cheap/symbol',
          '@libmedia/cheap/ctypeEnumRead',
          '@libmedia/cheap/ctypeEnumWrite',
          '@libmedia/cheap/thread/atomics',
        ],
      }),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/@libmedia/avplayer/dist/esm/[0-9]*.avplayer.js',
            dest:
              command === 'serve' ? './node_modules/.vite/deps/' : './assets/',
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      allowedHosts: ['.dev'],
      open: true,
      port: 23000,
    },
    base: '/monitor-system/',
  }
})
