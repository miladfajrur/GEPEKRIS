<?php
/**
 * GEPEKRIS Tretes - Server Directory Storage API
 * File: public_html/api/content.php
 * 
 * Script ini digunakan untuk menyimpan dan membaca data konten website gereja
 * langsung di direktori hosting gepekristretes.org.
 */

// 1. Izinkan CORS agar CMS dan website dapat mengakses API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Content-Type: application/json; charset=UTF-8");

// Tangani Preflight OPTIONS request dari browser
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Kunci Keamanan API (Dapat Anda sesuaikan sesuai kebutuhan)
define('API_SECRET_KEY', 'gepekristretes2025');

// 3. Konfigurasi Direktori Penyimpanan di Hosting
$baseDir = dirname(__DIR__);
$storageDir = $baseDir . '/data';
$backupDir = $storageDir . '/backups';
$dataFile = $storageDir . '/church_content.json';

// Buat direktori otomatis jika belum ada
if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0755, true);
}
if (!is_dir($backupDir)) {
    @mkdir($backupDir, 0755, true);
}

$action = isset($_GET['action']) ? trim($_GET['action']) : '';

// 4. Endpoint Pengujian / Ping Status
if ($action === 'ping' || $action === 'status') {
    $isWritable = is_writable($storageDir) || (!file_exists($storageDir) && is_writable($baseDir));
    echo json_encode([
        'status' => 'ok',
        'message' => 'Koneksi ke server gepekristretes.org berhasil!',
        'server_time' => date('Y-m-d H:i:s'),
        'php_version' => PHP_VERSION,
        'storage_directory' => $storageDir,
        'directory_writable' => $isWritable,
        'content_file_exists' => file_exists($dataFile),
        'file_size_bytes' => file_exists($dataFile) ? filesize($dataFile) : 0,
        'last_updated' => file_exists($dataFile) ? date('Y-m-d H:i:s', filemtime($dataFile)) : null,
        'total_backups' => is_dir($backupDir) ? count(glob($backupDir . '/*.json')) : 0
    ]);
    exit();
}

// 5. METODE GET: Mengambil Data Konten dari Direktori Hosting
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($dataFile)) {
        http_response_code(404);
        echo json_encode([
            'status' => 'not_found',
            'message' => 'Berkas data belum dibuat di direktori gepekristretes.org. Simpan konten pertama kali melalui Admin CMS.',
            'storage_path' => $dataFile
        ]);
        exit();
    }

    $rawContent = file_get_contents($dataFile);
    if ($rawContent === false) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal membaca berkas konten dari direktori server.'
        ]);
        exit();
    }

    // Output langsung JSON konten
    echo $rawContent;
    exit();
}

// 6. METODE POST: Menyimpan Data Konten ke Direktori Hosting
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil Token / Kunci Keamanan dari Header atau Body
    $headers = getallheaders();
    $providedToken = '';

    if (isset($headers['X-Admin-Token'])) {
        $providedToken = trim($headers['X-Admin-Token']);
    } elseif (isset($headers['x-admin-token'])) {
        $providedToken = trim($headers['x-admin-token']);
    } elseif (isset($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
        $providedToken = trim($_SERVER['HTTP_X_ADMIN_TOKEN']);
    }

    // Baca data body
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true);

    if (empty($providedToken) && isset($inputData['api_secret'])) {
        $providedToken = trim($inputData['api_secret']);
    }

    // Validasi token
    if ($providedToken !== API_SECRET_KEY) {
        http_response_code(401);
        echo json_encode([
            'status' => 'unauthorized',
            'message' => 'Akses ditolak: Kunci API rahasia (API Secret Key) tidak sesuai.'
        ]);
        exit();
    }

    // Ekstrak konten yang akan disimpan
    $contentToSave = null;
    if (isset($inputData['content'])) {
        $contentToSave = $inputData['content'];
    } elseif (isset($inputData['info']) && isset($inputData['hero'])) {
        $contentToSave = $inputData;
    }

    if (!$contentToSave || !is_array($contentToSave)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'bad_request',
            'message' => 'Format JSON tidak valid atau struktur konten tidak lengkap.'
        ]);
        exit();
    }

    // Format JSON yang rapi
    $jsonToSave = json_encode($contentToSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    // Buat cadangan (backup) jika file lama sudah ada
    if (file_exists($dataFile)) {
        $backupFilename = $backupDir . '/content_' . date('Ymd_His') . '.json';
        @copy($dataFile, $backupFilename);

        // Batasi jumlah backup maksimal 20 file terakhir
        $backups = glob($backupDir . '/*.json');
        if (count($backups) > 20) {
            usort($backups, function($a, $b) { return filemtime($a) - filemtime($b); });
            while (count($backups) > 20) {
                @unlink(array_shift($backups));
            }
        }
    }

    // Simpan ke berkas utama secara aman dengan penguncian berkas (LOCK_EX)
    $bytes = file_put_contents($dataFile, $jsonToSave, LOCK_EX);

    if ($bytes === false) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal menulis ke berkas ' . $dataFile . '. Pastikan izin folder (CHMOD) adalah 755 atau 777.'
        ]);
        exit();
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Konten berhasil disimpan ke direktori hosting gepekristretes.org!',
        'storage_file' => $dataFile,
        'bytes_saved' => $bytes,
        'saved_at' => date('Y-m-d H:i:s'),
        'server' => 'gepekristretes.org'
    ]);
    exit();
}

http_response_code(405);
echo json_encode(['status' => 'method_not_allowed', 'message' => 'Metode HTTP tidak didukung.']);
