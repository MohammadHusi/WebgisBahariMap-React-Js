import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

const CATEGORIES = [
  "Spot Wisata Baru",
  "Sentra UMKM Bahari",
  "Ekowisata Konservasi",
  "Event Budaya Bahari",
] as const;

const KECAMATAN_PAMEKASAN = [
  "Tlanakan",
  "Pademawu",
  "Galis",
  "Pasean",
  "Batu Marmar",
  "Kadur",
  "Waru",
];

export default function UsulPotensiPage() {
  const navigate = useNavigate();
  const { addUsulan } = useApp();

  const [namaPengusul, setNamaPengusul] = useState("");
  const [kontakPengusul, setKontakPengusul] = useState("");
  const [namaObjek, setNamaObjek] = useState("");
  const [kategori, setKategori] = useState<typeof CATEGORIES[number]>(CATEGORIES[0]);
  const [kecamatan, setKecamatan] = useState(KECAMATAN_PAMEKASAN[0]);
  const [desa, setDesa] = useState("");
  const [latitude, setLatitude] = useState("-7.221500");
  const [longitude, setLongitude] = useState("113.512400");
  const [deskripsi, setDeskripsi] = useState("");
  const [potensiEkonomi, setPotensiEkonomi] = useState("");
  const [kebutuhanFasilitas, setKebutuhanFasilitas] = useState("");
  const [estimasiSerapanKerja, setEstimasiSerapanKerja] = useState<number>(15);

  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaPengusul || !namaObjek || !deskripsi || !potensiEkonomi) {
      alert("Harap lengkapi semua kolom bertanda wajib (*)");
      return;
    }

    const created = addUsulan({
      namaPengusul,
      kontakPengusul: kontakPengusul || "0812-xxxx-xxxx",
      namaObjek,
      kategori,
      kecamatan,
      desa: desa || "Desa Pesisir",
      latitude: parseFloat(latitude) || -7.22,
      longitude: parseFloat(longitude) || 113.51,
      deskripsi,
      potensiEkonomi,
      kebutuhanFasilitas: kebutuhanFasilitas || "Akses jalan dan sarana sanitasi dasar",
      estimasiSerapanKerja: Number(estimasiSerapanKerja) || 10,
    });

    setSubmittedTicket(created.ticketNumber);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Banner */}
      <div className="mb-6 bg-white p-6 rounded-2xl border border-[#e6e2d9] shadow-xs">
        <div className="flex items-center gap-2 text-[#1a6392] text-xs font-bold uppercase tracking-wider mb-1">
          <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
          <span>Partisipasi Masyarakat & Pokdarwis Pamekasan</span>
        </div>
        <h1 className="text-2xl font-bold text-[#00273e]">
          Formulir Usulan Titik Potensi Wisata & Ekonomi Bahari
        </h1>
        <p className="text-sm text-[#42474d] mt-1.5 leading-relaxed">
          Sistem integrasi usulan dari kelompok sadar wisata (Pokdarwis), pegiat UMKM, dan masyarakat pesisir
          untuk dimasukkan ke dalam basis data spasial perencanaan Pemkab Pamekasan.
        </p>
      </div>

      {submittedTicket ? (
        <div className="bg-white border border-green-200 rounded-2xl p-8 text-center text-[#1c1c16] space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-[#00273e]">Usulan Berhasil Terdaftar!</h2>
          <p className="text-sm text-[#42474d] max-w-lg mx-auto">
            Terima kasih atas partisipasi Anda dalam memetakan potensi wisata bahari Pamekasan. Usulan telah
            masuk ke antrean telaah teknis Bappeda & Disporapar.
          </p>

          <div className="inline-block bg-[#f7f3ea] px-6 py-3 rounded-xl border border-[#e6e2d9] font-mono text-[#00273e] text-base font-bold">
            Nomor Registrasi: {submittedTicket}
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setNamaObjek("");
                setDeskripsi("");
                setPotensiEkonomi("");
              }}
              className="px-4 py-2 rounded-xl bg-[#ece8df] hover:bg-[#e6e2d9] text-sm font-semibold transition-all text-[#1c1c16]"
            >
              Kirim Usulan Lain
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 rounded-xl bg-[#00273e] hover:bg-[#083d5c] text-white text-sm font-bold transition-all shadow-sm"
            >
              Lihat di Peta WebGIS
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#e6e2d9] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Section 1: Profil Pengusul */}
          <div>
            <h3 className="text-xs font-bold text-[#00273e] uppercase tracking-wider mb-3">
              1. Identitas Pengusul / Komunitas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Nama Lengkap / Lembaga / Pokdarwis *
                </label>
                <input
                  type="text"
                  required
                  value={namaPengusul}
                  onChange={(e) => setNamaPengusul(e.target.value)}
                  placeholder="Contoh: Pokdarwis Pesisir Branta"
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm text-[#1c1c16] focus:outline-none focus:border-[#1a6392]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Nomor Kontak / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={kontakPengusul}
                  onChange={(e) => setKontakPengusul(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm text-[#1c1c16] focus:outline-none focus:border-[#1a6392]"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e6e2d9]"></div>

          {/* Section 2: Objek & Lokasi Spasial */}
          <div>
            <h3 className="text-xs font-bold text-[#00273e] uppercase tracking-wider mb-3">
              2. Data Objek & Koordinat Geospasial
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Nama Calon Objek / Destinasi / Sentra *
                </label>
                <input
                  type="text"
                  required
                  value={namaObjek}
                  onChange={(e) => setNamaObjek(e.target.value)}
                  placeholder="Contoh: Wisata Perahu Kano Mangrove Bunder"
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm text-[#1c1c16] focus:outline-none focus:border-[#1a6392]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Kategori Objek *
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm text-[#1c1c16] focus:outline-none focus:border-[#1a6392]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Kecamatan Pesisir *
                </label>
                <select
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm text-[#1c1c16] focus:outline-none focus:border-[#1a6392]"
                >
                  {KECAMATAN_PAMEKASAN.map((kec) => (
                    <option key={kec} value={kec}>
                      Kec. {kec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Nama Desa / Dusun *
                </label>
                <input
                  type="text"
                  required
                  value={desa}
                  onChange={(e) => setDesa(e.target.value)}
                  placeholder="Contoh: Desa Bunder"
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm text-[#1c1c16] focus:outline-none focus:border-[#1a6392]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Estimasi Serapan Kerja Lokal (Jiwa)
                </label>
                <input
                  type="number"
                  min="1"
                  value={estimasiSerapanKerja}
                  onChange={(e) => setEstimasiSerapanKerja(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm text-[#1c1c16] focus:outline-none focus:border-[#1a6392]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Koordinat Latitude (Lintang)
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-7.221500"
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm font-mono text-[#00273e] focus:outline-none focus:border-[#1a6392]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Koordinat Longitude (Bujur)
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="113.512400"
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm font-mono text-[#00273e] focus:outline-none focus:border-[#1a6392]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setLatitude((-7.20 - Math.random() * 0.05).toFixed(6));
                    setLongitude((113.50 + Math.random() * 0.08).toFixed(6));
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#ece8df] hover:bg-[#e6e2d9] text-xs font-semibold text-[#00273e] transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">my_location</span>
                  <span>Ambil GPS Pesisir</span>
                </button>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#e6e2d9]"></div>

          {/* Section 3: Justifikasi Potensi Ekonomi */}
          <div>
            <h3 className="text-xs font-bold text-[#00273e] uppercase tracking-wider mb-3">
              3. Deskripsi & Optimasi Nilai Ekonomi
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Deskripsi Keunikan & Daya Tarik Wisata Bahari *
                </label>
                <textarea
                  required
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Uraikan bentang alam, potensi terumbu karang, hutan mangrove, atau tradisi bahari yang ingin dikembangkan..."
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm text-[#1c1c16] focus:outline-none focus:border-[#1a6392]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Dampak Ekonomi Masyarakat & Sinergi UMKM *
                </label>
                <textarea
                  required
                  rows={2}
                  value={potensiEkonomi}
                  onChange={(e) => setPotensiEkonomi(e.target.value)}
                  placeholder="Bagaimana objek ini meningkatkan pendapatan nelayan, perajin batik pesisir, atau pedagang olahan hasil laut sekitar?"
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm text-[#1c1c16] focus:outline-none focus:border-[#1a6392]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#42474d] block mb-1">
                  Kebutuhan Fasilitas & Dukungan Pemerintah Daerah
                </label>
                <input
                  type="text"
                  value={kebutuhanFasilitas}
                  onChange={(e) => setKebutuhanFasilitas(e.target.value)}
                  placeholder="Contoh: Dermaga apung, pavingisasi jalan masuk, pelatihan pemandu wisata Pokdarwis"
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border border-[#e6e2d9] rounded-xl text-sm text-[#1c1c16] focus:outline-none focus:border-[#1a6392]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl bg-[#ece8df] hover:bg-[#e6e2d9] text-[#42474d] text-sm font-semibold transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00273e] hover:bg-[#083d5c] text-white text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px] text-[#82f5ef]">send</span>
              <span>Kirim Usulan ke Bappeda</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
