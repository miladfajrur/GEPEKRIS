#!/usr/bin/env python3
import os
import zipfile

dist_dir = 'dist'
public_dir = 'public'

if not os.path.exists(dist_dir):
    print(f"Directory {dist_dir} does not exist. Skipping zip creation.")
    exit(0)

readme_content = """============================================================
PANDUAN CEPAT DEPLOY KE CPANEL - GEPEKRIS TRETES
============================================================

1. Login ke cPanel Anda (contoh: https://namadomain.com:2083)
2. Buka File Manager -> masuk ke folder public_html/
3. Upload file 'cpanel_deploy.zip' ini ke dalam folder public_html/
4. Klik kanan pada file 'cpanel_deploy.zip' di File Manager cPanel -> pilih 'Extract' (ekstrak di dalam public_html/)
5. Pastikan folder data/ memiliki permission/CHMOD 755 (atau 777)
6. Buka website di domain Anda.
7. Login Admin di menu 'Akses Pengurus' paling bawah footer (kata sandi bawaan: admin123).
8. Klik tombol hijau 'Publikasikan ke Hosting' di atas panel admin untuk memastikan sinkronisasi.

Selesai! Seluruh konten website kini tersimpan permanen di server hosting cPanel Anda dan dapat dilihat oleh semua orang secara real-time.
"""

# Ensure README_CPANEL.txt is in dist/
with open(os.path.join(dist_dir, 'README_CPANEL.txt'), 'w', encoding='utf-8') as f:
    f.write(readme_content)

# Target zip files
zip_targets = [
    os.path.join(public_dir, 'cpanel_deploy.zip'),
    os.path.join(dist_dir, 'cpanel_deploy.zip')
]

for target in zip_targets:
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                if file.endswith('.zip'):
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, dist_dir)
                zipf.write(file_path, rel_path)
    print(f"Created {target} ({os.path.getsize(target)} bytes)")
