import { useApp } from "../context/AppContext";

export default function AnalisisEkonomiPage() {
  const { destinasiList, usulanList } = useApp();

  const totalDestinasi = destinasiList.length;
  const totalKunjunganBulanan = destinasiList.reduce((acc, d) => acc + d.estimasiKunjunganBulanan, 0);
  const totalUmkm = destinasiList.reduce((acc, d) => acc + d.jumlahUmkmBinaan, 0);

  const kecamatanData = destinasiList.reduce((acc, curr) => {
    if (!acc[curr.kecamatan]) {
      acc[curr.kecamatan] = { count: 0, kunjungan: 0, umkm: 0 };
    }
    acc[curr.kecamatan].count += 1;
    acc[curr.kecamatan].kunjungan += curr.estimasiKunjunganBulanan;
    acc[curr.kecamatan].umkm += curr.jumlahUmkmBinaan;
    return acc;
  }, {} as Record<string, { count: number; kunjungan: number; umkm: number }>);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-[#1c1c16]">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#00273e]">
          Statistik & Analisis Ekonomi Bahari Pamekasan
        </h1>
        <p className="text-sm text-[#42474d] mt-1">
          Ringkasan agregat perputaran uang, kunjungan wisatawan, dan penyerapan tenaga kerja pesisir Kabupaten Pamekasan.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white rounded-xl border border-[#e6e2d9] shadow-xs">
          <span className="text-xs text-[#42474d] font-medium">Destinasi Bahari Unggulan</span>
          <div className="text-2xl font-bold text-[#00273e] mt-1">{totalDestinasi} Titik</div>
          <span className="text-[11px] text-[#1a6392] mt-0.5 block">Tercatat di WebGIS</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#e6e2d9] shadow-xs">
          <span className="text-xs text-[#16a34a] font-medium">Est. Kunjungan / Bulan</span>
          <div className="text-2xl font-bold text-[#16a34a] mt-1">
            {totalKunjunganBulanan.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#42474d] mt-0.5 block">Wisatawan Nusantara & Lokal</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#e6e2d9] shadow-xs">
          <span className="text-xs text-[#d97706] font-medium">UMKM Bahari Terkoneksi</span>
          <div className="text-2xl font-bold text-[#d97706] mt-1">{totalUmkm} Unit</div>
          <span className="text-[11px] text-[#42474d] mt-0.5 block">Kuliner, Batik, Garam, Transportasi</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#e6e2d9] shadow-xs">
          <span className="text-xs text-[#7c3aed] font-medium">Usulan Titik Baru (Pokdarwis)</span>
          <div className="text-2xl font-bold text-[#7c3aed] mt-1">{usulanList.length} Objek</div>
          <span className="text-[11px] text-[#42474d] mt-0.5 block">Dalam Penelaahan Bappeda</span>
        </div>
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Breakdown by District */}
        <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-[#e6e2d9] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#e6e2d9] pb-3">
            <h2 className="text-base font-bold text-[#00273e]">
              Distribusi Potensi Ekonomi per Kecamatan Pesisir
            </h2>
            <span className="text-xs text-[#42474d]">Kabupaten Pamekasan</span>
          </div>

          <div className="space-y-4">
            {Object.entries(kecamatanData).map(([kec, data]) => {
              const pct = Math.round((data.kunjungan / totalKunjunganBulanan) * 100);
              return (
                <div key={kec} className="space-y-1.5 p-3 rounded-xl bg-[#fdf9f0] border border-[#e6e2d9]">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#00273e] text-sm">Kecamatan {kec}</span>
                    <span className="text-[#1a6392]">{data.kunjungan.toLocaleString()} Wisatawan/Bln ({pct}%)</span>
                  </div>

                  <div className="w-full bg-[#ece8df] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#083d5c] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[11px] text-[#42474d] pt-1">
                    <span>{data.count} Objek Wisata Bahari</span>
                    <span className="text-[#d97706] font-medium">{data.umkm} UMKM Binaan Pesisir</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strategic Recommendations for Academic & Policy */}
        <div className="p-6 bg-white rounded-xl border border-[#e6e2d9] shadow-xs space-y-4">
          <div className="border-b border-[#e6e2d9] pb-3">
            <h2 className="text-base font-bold text-[#00273e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#16a34a] text-xl">lightbulb</span>
              <span>Rekomendasi Kebijakan</span>
            </h2>
            <p className="text-xs text-[#42474d] mt-1">Hasil Analisis SIG & Tata Ruang</p>
          </div>

          <div className="space-y-3 text-xs text-[#42474d]">
            <div className="p-3 rounded-xl bg-[#fdf9f0] border border-[#e6e2d9]">
              <strong className="text-[#00273e] block mb-1">1. Koridor Lintas Pesisir Selatan:</strong>
              Integrasi paket wisata Pantai Jumiang - Mangrove Montok - Kuliner Branta dengan moda shuttle perahu nelayan.
            </div>

            <div className="p-3 rounded-xl bg-[#fdf9f0] border border-[#e6e2d9]">
              <strong className="text-[#00273e] block mb-1">2. Hilirisasi Agrowisata Garam:</strong>
              Pemberian nilai tambah garam Madura di Galis & Pademawu melalui sentra spa garam dan suvenir kristal geomembran.
            </div>

            <div className="p-3 rounded-xl bg-[#fdf9f0] border border-[#e6e2d9]">
              <strong className="text-[#00273e] block mb-1">3. Pemberdayaan Pokdarwis Lokal:</strong>
              Digitalisasi pembayaran QRIS dan standardisasi pemandu bahari pesisir untuk memaksimalkan retribusi PAD.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
