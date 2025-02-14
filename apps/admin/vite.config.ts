/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join, resolve } from 'path';

// @ts-ignore
export default defineConfig(async () => {
  const { TanStackRouterVite } = await import('@tanstack/router-plugin/vite');

  return {
    root: __dirname,
    server:{
      port: 4200,
      host: 'localhost',
    },
    preview:{
      port: 4300,
      host: 'localhost',
    },
    plugins: [
      react(),
      TanStackRouterVite({
        routesDirectory: join(__dirname, 'src/routes'),
        generatedRouteTree: join(__dirname, 'src/routeTree.gen.ts'),
        routeFileIgnorePrefix: '-',
        quoteStyle: 'single',
      }),
    ],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
      outDir: '../../dist/apps/admin',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    test: {
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: './test-output/vitest/coverage',
        provider: 'v8',
      }
    },
    resolve: {
      alias: {
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
        "@admin": resolve(__dirname, "./src"),
      }
    }
  }
});
