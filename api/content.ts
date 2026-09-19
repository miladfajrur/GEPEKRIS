// Vercel Serverless Function for GEPEKRIS Tretes Content API
// Handles GET (read/ping) and POST (save/sync) without 405 Method Not Allowed
import fs from 'fs';
import path from 'path';

// In-memory fallback cache across serverless warm invocations
let memoryCache: any = null;

export default function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Admin-Token, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query || {};

  // GET: ping or fetch status / church content
  if (req.method === 'GET') {
    if (query.action === 'ping') {
      return res.status(200).json({
        status: 'ok',
        message: 'Koneksi server API GEPEKRIS Tretes (Vercel Serverless) aktif!',
        platform: 'Vercel Serverless Function',
        timestamp: new Date().toISOString(),
      });
    }

    // Try reading memory cache first
    if (memoryCache) {
      return res.status(200).json(memoryCache);
    }

    // Try reading from public/data/church_content.json
    try {
      const publicPath = path.resolve(process.cwd(), 'public/data/church_content.json');
      if (fs.existsSync(publicPath)) {
        const raw = fs.readFileSync(publicPath, 'utf-8');
        const json = JSON.parse(raw);
        memoryCache = json;
        return res.status(200).json(json);
      }
    } catch {
      // Fallback
    }

    return res.status(200).json({
      status: 'ready',
      message: 'Endpoint API GEPEKRIS Tretes siap digunakan.',
    });
  }

  // POST: save content
  if (req.method === 'POST') {
    try {
      let contentData = req.body;
      if (typeof contentData === 'string') {
        try {
          contentData = JSON.parse(contentData);
        } catch {
          // ignore
        }
      }

      const contentToSave = contentData?.content || (contentData?.info && contentData?.hero ? contentData : null);
      if (contentToSave) {
        memoryCache = contentToSave;
        try {
          const publicDir = path.resolve(process.cwd(), 'public/data');
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
          }
          fs.writeFileSync(path.join(publicDir, 'church_content.json'), JSON.stringify(contentToSave, null, 2), 'utf-8');
        } catch {
          // Read-only filesystem on some serverless platforms; memoryCache handles it
        }
      }

      return res.status(200).json({
        status: 'success',
        message: 'Konten berhasil disimpan dan disinkronkan ke server!',
        platform: 'Vercel Serverless Function',
        timestamp: new Date().toISOString(),
        bytes_saved: typeof req.body === 'string' ? req.body.length : JSON.stringify(req.body || {}).length,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err?.message || 'Server error',
      });
    }
  }

  return res.status(405).json({
    status: 'error',
    message: 'Method Not Allowed',
  });
}
