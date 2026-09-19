import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'mock-php-api-dev',
        configureServer(server) {
          const apiMiddleware = (req: any, res: any, next: any) => {
            if (req.url && (req.url.startsWith('/api/content.php') || req.url.startsWith('/api/content'))) {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', '*');
              res.setHeader('Content-Type', 'application/json; charset=utf-8');

              if (req.method === 'OPTIONS') {
                res.statusCode = 200;
                res.end();
                return;
              }

              if (req.method === 'GET') {
                if (req.url.includes('action=ping')) {
                  res.statusCode = 200;
                  res.end(JSON.stringify({ 
                    status: 'ok', 
                    message: 'Koneksi server API GEPEKRIS Tretes aktif dan siap digunakan',
                    platform: 'Integrated Dev/Preview API'
                  }));
                  return;
                }
                res.statusCode = 200;
                res.end(JSON.stringify({ status: 'ready', message: 'Endpoint preview aktif' }));
                return;
              }

              if (req.method === 'POST') {
                let body = '';
                req.on('data', (chunk: any) => {
                  body += chunk;
                });
                req.on('end', () => {
                  res.statusCode = 200;
                  res.end(JSON.stringify({
                    status: 'success',
                    message: 'Konten berhasil disimpan ke server hosting!',
                    bytes_saved: body.length,
                    last_updated: new Date().toLocaleTimeString('id-ID')
                  }));
                });
                return;
              }
            }
            next();
          };

          server.middlewares.use(apiMiddleware);
        },
        configurePreviewServer(server) {
          server.middlewares.use((req: any, res: any, next: any) => {
            if (req.url && (req.url.startsWith('/api/content.php') || req.url.startsWith('/api/content'))) {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', '*');
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              if (req.method === 'OPTIONS') {
                res.statusCode = 200;
                res.end();
                return;
              }
              res.statusCode = 200;
              res.end(JSON.stringify({
                status: 'success',
                message: 'Konten berhasil disimpan ke server!',
              }));
              return;
            }
            next();
          });
        }
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
