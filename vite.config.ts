import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function getStoredContent(): string | null {
  const publicPath = path.resolve(process.cwd(), 'public/data/church_content.json');
  if (fs.existsSync(publicPath)) {
    try {
      return fs.readFileSync(publicPath, 'utf-8');
    } catch {
      return null;
    }
  }
  return null;
}

function saveStoredContent(contentData: any): { success: boolean; bytes: number } {
  const publicDir = path.resolve(process.cwd(), 'public/data');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicPath = path.join(publicDir, 'church_content.json');
  const jsonStr = JSON.stringify(contentData, null, 2);
  fs.writeFileSync(publicPath, jsonStr, 'utf-8');

  // Also update dist directory if it has already been built
  const distDir = path.resolve(process.cwd(), 'dist/data');
  if (fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    fs.writeFileSync(path.join(distDir, 'church_content.json'), jsonStr, 'utf-8');
  }

  return { success: true, bytes: Buffer.byteLength(jsonStr, 'utf-8') };
}

function handleApiRequest(req: any, res: any, next: any) {
  if (req.url && (req.url.startsWith('/api/content.php') || req.url.startsWith('/api/content'))) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      res.end();
      return;
    }

    if (req.method === 'GET') {
      if (req.url.includes('action=ping')) {
        const fileContent = getStoredContent();
        res.statusCode = 200;
        res.end(JSON.stringify({ 
          status: 'ok', 
          message: 'Koneksi server API GEPEKRIS Tretes aktif dan siap digunakan',
          platform: 'Integrated Dev/Preview API',
          content_file_exists: !!fileContent,
          file_size_bytes: fileContent ? Buffer.byteLength(fileContent, 'utf-8') : 0,
          server_time: new Date().toISOString()
        }));
        return;
      }

      // Return stored content directly
      const rawContent = getStoredContent();
      if (rawContent) {
        res.statusCode = 200;
        res.end(rawContent);
        return;
      }

      res.statusCode = 404;
      res.end(JSON.stringify({ status: 'not_found', message: 'Berkas data belum dibuat di server.' }));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const contentToSave = parsed.content || (parsed.info && parsed.hero ? parsed : null);

          if (!contentToSave) {
            res.statusCode = 400;
            res.end(JSON.stringify({
              status: 'bad_request',
              message: 'Format data tidak valid. Struktur konten gereja tidak lengkap.'
            }));
            return;
          }

          // Persist directly to public/data/church_content.json on the server disk!
          const result = saveStoredContent(contentToSave);

          res.statusCode = 200;
          res.end(JSON.stringify({
            status: 'success',
            message: 'Konten dan gambar berhasil disimpan ke server hosting!',
            bytes_saved: result.bytes,
            saved_at: new Date().toISOString(),
            last_updated: new Date().toLocaleTimeString('id-ID')
          }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({
            status: 'error',
            message: 'Gagal memproses data JSON: ' + (err?.message || 'Unknown error')
          }));
        }
      });
      return;
    }
  }
  next();
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'php-api-middleware',
        configureServer(server) {
          server.middlewares.use(handleApiRequest);
        },
        configurePreviewServer(server) {
          server.middlewares.use(handleApiRequest);
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
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
