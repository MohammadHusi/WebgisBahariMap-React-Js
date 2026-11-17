import { useState } from "react";
import { Link } from "react-router";
import { useApp } from "../context/AppContext";

export default function DashboardBappedaPage() {
  const { destinasiList, usulanList, updateUsulanStatus } = useApp();

  // Statistics
  const totalDestinasi = destinasiList.length;
  const totalKunjungan = destinasiList.reduce((acc, d) => acc + d.estimasiKunjunganBulanan, 0);
  const totalUmkm = destinasiList.reduce((acc, d) => acc + d.jumlahUmkmBinaan, 0);
  const totalTenagaKerja = destinasiList.reduce(
    (acc, d) => acc + d.pelakuEkonomi.reduce((sub, p) => sub + p.tenagaKerja, 0),
    0
  );

  const pendingUsulan = usulanList.filter((u) => u.status === "Menunggu Telaah").length;
  const approvedUsulan = usulanList.filter((u) => u.status === "Disetujui Masuk Rencana").length;
  const surveyUsulan = usulanList.filter((u) => u.status === "Perlu Survei Lapangan").length;

  const [activeTab, setActiveTab] = useState<"ringkasan" | "usulan" | "destinasi" | "umkm">("ringkasan");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner Executive Dashboard */}
      <div className="bg-[#00273e] text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#1a6392]/30 to-transparent pointer-events-none hidden md:block"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a6392] to-[#083d5c] border border-cyan-400/30 flex items-center justify-center font-extrabold text-white text-xl shadow-lg">
              PMK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/20 text-[#82f5ef] font-semibold border border-cyan-400/30">
                  Executive Dashboard
                </span>
                <span className="text-xs text-slate-300">Pemerintah Kabupaten Pamekasan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                Dasbor Pengambil Keputusan Bappeda & Disporapar
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Pemantauan Terpadu Rencana Tata Ruang Pariwisata Bahari, Hilirisasi Garam Rakyat, dan Pemberdayaan Ekonomi Pesisir.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/20"
            >
              <span className="material-symbols-outlined text-[18px] text-[#82f5ef]">map</span>
              <span>Buka WebGIS</span>
            </Link>
            <Link
              to="/telaah-bappeda"
              className="px-4 py-2.5 rounded-xl bg-[#82f5ef] hover:bg-[#56e8e0] text-[#00273e] text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
              <span>Telaah Usulan ({pendingUsulan})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-[#e6e2d9] shadow-xs">
          <div className="flex items-center justify-between text-[#42474d] text-xs font-medium">
            <span>Destinasi Terverifikasi</span>
            <span className="material-symbols-outlined text-[#1a6392] text-xl">beach_access</span>
          </div>
          <div className="text-3xl font-bold text-[#00273e] mt-2">{totalDestinasi} Objek</div>
          <div className="mt-2 text-[11px] text-[#16a34a] font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Masuk Masterplan RIPPARKAB</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e2d9] shadow-xs">
          <div className="flex items-center justify-between text-[#42474d] text-xs font-medium">
            <span>Estimasi Kunjungan / Bln</span>
            <span className="material-symbols-outlined text-[#16a34a] text-xl">groups</span>
          </div>
          <div className="text-3xl font-bold text-[#16a34a] mt-2">
            {totalKunjungan.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-[#42474d] flex items-center gap-1">
            <span>Perputaran Uang: ~Rp 1,94 M/bln</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e2d9] shadow-xs">
          <div className="flex items-center justify-between text-[#42474d] text-xs font-medium">
            <span>Sentra UMKM Binaan Pesisir</span>
            <span className="material-symbols-outlined text-[#d97706] text-xl">storefront</span>
          </div>
          <div className="text-3xl font-bold text-[#d97706] mt-2">{totalUmkm} Unit</div>
          <div className="mt-2 text-[11px] text-[#42474d]">
            Kuliner lorjuk, garam, batik & perahu
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e2d9] shadow-xs">
          <div className="flex items-center justify-between text-[#42474d] text-xs font-medium">
            <span>Usulan Pokdarwis Masuk</span>
            <span className="material-symbols-outlined text-[#7c3aed] text-xl">mark_email_unread</span>
          </div>
          <div className="text-3xl font-bold text-[#7c3aed] mt-2">{usulanList.length} Usulan</div>
          <div className="mt-2 text-[11px] text-amber-700 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>{pendingUsulan} Menunggu Telaah Teknis</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Program Prioritas & Status Penelaahan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Progress Program Kerja Daerah */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e6e2d9] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#e6e2d9] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#00273e]">
                Program Strategis Pariwisata Bahari & UMKM Pesisir Pamekasan
              </h2>
              <p className="text-xs text-[#42474d] mt-0.5">
                Target RPJMD & Integrasi Tata Ruang Wilayah Pesisir (RZWP-3-K)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
              Tahun Anggaran 2026
            </span>
          </div>

          <div className="space-y-4">
            {/* Program 1 */}
            <div className="p-4 rounded-xl bg-[#fdf9f0] border border-[#e6e2d9] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#00273e]">
                  1. Pengembangan Koridor Bahari Tlanakan - Pademawu (Branta & Jumiang)
                </span>
                <span className="text-[#1a6392]">85% Terlaksana</span>
              </div>
              <div className="w-full bg-[#ece8df] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1a6392] h-full rounded-full" style={{ width: "85%" }}></div>
              </div>
              <p className="text-[11px] text-[#42474d]">
                Pembangunan dermaga pendaratan perahu wisata dan fasilitas kuliner higienis hasil tangkapan nelayan.
              </p>
            </div>

            {/* Program 2 */}
            <div className="p-4 rounded-xl bg-[#fdf9f0] border border-[#e6e2d9] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#00273e]">
                  2. Agrowisata Edukasi Garam Geomembran Galis
                </span>
                <span className="text-[#d97706]">65% Terlaksana</span>
              </div>
              <div className="w-full bg-[#ece8df] h-2 rounded-full overflow-hidden">
                <div className="bg-[#d97706] h-full rounded-full" style={{ width: "65%" }}></div>
              </div>
              <p className="text-[11px] text-[#42474d]">
                Pemberdayaan kelompok petambak garam rakyat menjadi destinasi edukasi sains kristalisasi garam.
              </p>
            </div>

            {/* Program 3 */}
            <div className="p-4 rounded-xl bg-[#fdf9f0] border border-[#e6e2d9] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#00273e]">
                  3. Konservasi & Ekowisata Mangrove Talang Siring & Montok
                </span>
                <span className="text-[#16a34a]">90% Terlaksana</span>
              </div>
              <div className="w-full bg-[#ece8df] h-2 rounded-full overflow-hidden">
                <div className="bg-[#16a34a] h-full rounded-full" style={{ width: "90%" }}></div>
              </div>
              <p className="text-[11px] text-[#42474d]">
                Perluasan titian boardwalk kayu mangrove dan pusat riset pembibitan bakau bekerjasama dengan Pokdarwis.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Status Antrean Usulan Warga */}
        <div className="bg-white rounded-2xl border border-[#e6e2d9] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#e6e2d9] pb-3">
              <h2 className="text-base font-bold text-[#00273e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a6392]">inbox</span>
                <span>Antrean Telaah Usulan</span>
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ece8df] text-[#00273e]">
                {usulanList.length} Total
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-bold text-amber-900">Menunggu Telaah</span>
                </div>
                <span className="text-sm font-extrabold text-amber-900">{pendingUsulan}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-bold text-blue-900">Perlu Survei Lapangan</span>
                </div>
                <span className="text-sm font-extrabold text-blue-900">{surveyUsulan}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs font-bold text-green-900">Disetujui Masuk Rencana</span>
                </div>
                <span className="text-sm font-extrabold text-green-900">{approvedUsulan}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e6e2d9]">
            <Link
              to="/telaah-bappeda"
              className="w-full py-2.5 rounded-xl bg-[#00273e] hover:bg-[#083d5c] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Buka Meja Verifikasi Bappeda</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix for Field Officers */}
      <div className="bg-[#f7f3ea] border border-[#e6e2d9] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-[#00273e] mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1a6392]">bolt</span>
          <span>Akses Cepat Dokumen & Alat Kerja Perencanaan</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/analisis-ekonomi"
            className="p-3 bg-white rounded-xl border border-[#e6e2d9] hover:border-[#1a6392] transition-colors flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-[#1a6392]">query_stats</span>
            <div>
              <div className="text-xs font-bold text-[#00273e]">Laporan Ekonomi</div>
              <div className="text-[10px] text-[#42474d]">Agregat per Kecamatan</div>
            </div>
          </Link>

          <Link
            to="/katalog-data-spasial"
            className="p-3 bg-white rounded-xl border border-[#e6e2d9] hover:border-[#1a6392] transition-colors flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-[#16a34a]">download</span>
            <div>
              <div className="text-xs font-bold text-[#00273e]">Ekspor Data Spasial</div>
              <div className="text-[10px] text-[#42474d]">GeoJSON untuk QGIS/ArcGIS</div>
            </div>
          </Link>

          <Link
            to="/usul-potensi"
            className="p-3 bg-white rounded-xl border border-[#e6e2d9] hover:border-[#1a6392] transition-colors flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-[#d97706]">add_location_alt</span>
            <div>
              <div className="text-xs font-bold text-[#00273e]">Input Titik Lapangan</div>
              <div className="text-[10px] text-[#42474d]">Survei Lokasi Baru</div>
            </div>
          </Link>

          <Link
            to="/"
            className="p-3 bg-white rounded-xl border border-[#e6e2d9] hover:border-[#1a6392] transition-colors flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-[#7c3aed]">satellite_alt</span>
            <div>
              <div className="text-xs font-bold text-[#00273e]">Peta Geospasial</div>
              <div className="text-[10px] text-[#42474d]">Citra Satelit & Koridor</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
