<?php
/**
 * GEPEKRIS TRETES - Web Application Entry Point (PHP)
 * 
 * File ini berfungsi sebagai entry point di server hosting cPanel / Apache / PHP.
 * File ini menyajikan file HTML utama aplikasi React GEPEKRIS Tretes secara dinamis
 * serta memastikan kompatibilitas penuh dengan server web berbasis PHP.
 */

// Set header keamanan dan hindari caching berlebih untuk file loader utama
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// Cek keberadaan index.html di root atau di dalam folder dist/
$indexPath = __DIR__ . '/index.html';
if (!file_exists($indexPath)) {
    $indexPath = __DIR__ . '/dist/index.html';
}

// 1. Jika index.html ditemukan, sajikan langsung
if (file_exists($indexPath)) {
    header("Content-Type: text/html; charset=UTF-8");
    readfile($indexPath);
    exit;
}

// 2. Jika diakses sebelum proses 'npm run build' diupload, tampilkan panduan informatif
header("Content-Type: text/html; charset=UTF-8");
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GEPEKRIS Tretes - Server Hosting Siap</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #faf8f5;
            color: #292524;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 24px;
        }
        .container {
            background: #ffffff;
            border: 1px solid #e7e5e4;
            border-radius: 20px;
            max-width: 600px;
            width: 100%;
            padding: 40px 32px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
            text-align: center;
        }
        .badge {
            display: inline-block;
            background-color: #fef3c7;
            color: #92400e;
            font-size: 13px;
            font-weight: 600;
            padding: 6px 14px;
            border-radius: 9999px;
            margin-bottom: 20px;
            letter-spacing: 0.5px;
        }
        h1 {
            font-size: 26px;
            font-weight: 800;
            color: #1c1917;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
        }
        p {
            color: #57534e;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .step-box {
            background: #f5f5f4;
            border: 1px solid #e7e5e4;
            border-radius: 12px;
            padding: 20px;
            text-align: left;
            margin-bottom: 24px;
        }
        .step-title {
            font-weight: 700;
            font-size: 14px;
            color: #44403c;
            margin-bottom: 10px;
        }
        .code {
            background: #292524;
            color: #a7f3d0;
            padding: 10px 14px;
            border-radius: 8px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 13px;
            display: block;
            margin: 8px 0;
            overflow-x: auto;
        }
        .footer {
            font-size: 13px;
            color: #a8a29e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="badge">HOSTING PHP AKTIF</div>
        <h1>GEPEKRIS TRETES</h1>
        <p>File <strong>index.php</strong> berhasil terpasang di direktori hosting Anda.</p>
        
        <div class="step-box">
            <div class="step-title">Langkah Terakhir untuk Memunculkan Website:</div>
            <p style="margin-bottom: 8px; font-size: 14px;">1. Jalankan build di terminal komputer Anda:</p>
            <span class="code">npm run build</span>
            <p style="margin-bottom: 0; font-size: 14px; margin-top: 12px;">2. Upload seluruh berkas di dalam folder <strong>dist/</strong> ke folder <strong>public_html/</strong> di cPanel Anda.</p>
        </div>

        <div class="footer">
            Gereja Persekutuan Kristen (GEPEKRIS) Tretes, Prigen, Pasuruan
        </div>
    </div>
</body>
</html>
