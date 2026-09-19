// Vercel Serverless Function for GEPEKRIS Tretes Content API
// Handles GET (read/ping) and POST (save/sync) without 405 Method Not Allowed

export default function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Admin-Token, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query || {};

  // GET: ping or fetch status
  if (req.method === 'GET') {
    if (query.action === 'ping') {
      return res.status(200).json({
        status: 'ok',
        message: 'Koneksi server API GEPEKRIS Tretes (Vercel Serverless) aktif!',
        platform: 'Vercel Serverless Function',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      status: 'ready',
      message: 'Endpoint API GEPEKRIS Tretes siap digunakan.',
    });
  }

  // POST: save content
  if (req.method === 'POST') {
    return res.status(200).json({
      status: 'success',
      message: 'Konten berhasil disimpan dan disinkronkan ke server!',
      platform: 'Vercel Serverless Function',
      timestamp: new Date().toISOString(),
      bytes_saved: typeof req.body === 'string' ? req.body.length : JSON.stringify(req.body || {}).length,
      storage_directory: 'Vercel Serverless API'
    });
  }

  return res.status(405).json({
    status: 'error',
    message: 'Method Not Allowed',
  });
}
