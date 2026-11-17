# BahariMap Pamekasan (WebGIS)

**Perancangan & Manajemen Sistem Informasi Geospasial (WebGIS) untuk Pemetaan dan Optimasi Potensi Ekonomi Pariwisata Bahari Kabupaten Pamekasan**

Platform WebGIS terintegrasi yang dirancang untuk mendukung penelitian, perencanaan daerah, pemetaan spasial objek pariwisata bahari, serta optimasi klaster ekonomi UMKM pesisir (kuliner laut, industri garam rakyat, batik pesisir, dan ekowisata mangrove) di Kabupaten Pamekasan, Madura, Jawa Timur.

---

## 🌟 Fitur & Modul Utama

1. **Peta Geospasial Interaktif Pesisir Pamekasan (`/`)**
   - Menampilkan bentang spasial perairan Selat Madura (selatan) dan Laut Jawa (pantura).
   - Layer tematik: Destinasi Bahari Unggulan, Sentra UMKM Pesisir, Kawasan Garam Rakyat (KIGR Galis & Pademawu), Sabuk Mangrove, dan Koridor Wisata.
   - Panel detail kartu potensi ekonomi untuk tiap objek wisata (estimasi perputaran uang, kunjungan bulanan, jumlah UMKM terhubung, dan tenaga kerja).

2. **Formulir Usul Potensi Baru Pokdarwis & Warga (`/usul-potensi`)**
   - Fasilitas *participatory GIS* bagi Kelompok Sadar Wisata (Pokdarwis) dan warga untuk mengajukan calon destinasi bahari baru dengan geolokasi GPS presisi.

3. **Panel Telaah Bappeda & Disporapar (`/telaah-bappeda`)**
   - Dasbor penelaahan usulan warga bagi dinas teknis pemerintah daerah (Bappeda/Dinas Pariwisata) untuk validasi kelayakan dan penjadwalan survei lapangan.

4. **Analisis & Nilai Ekonomi Spasial (`/analisis-ekonomi`)**
   - Agregasi data perputaran ekonomi, kunjungan per kecamatan (Tlanakan, Pademawu, Galis, Pasean), dan rekomendasi tata ruang berbasis GIS.

5. **Katalog Data Spasial Open Data (`/katalog-data-spasial`)**
   - Ekspor dataset standar GeoJSON (EPSG:4326 WGS 84) untuk kebutuhan analisis lanjutan di software GIS (QGIS, ArcGIS).

---

## 🚀 Cara Menjalankan

```bash
# Install dependencies
npm install

# Jalankan server development
npm run dev

# Jalankan typecheck & build production
npm run typecheck
npm run build
npm start
```
