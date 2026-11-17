import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function TelaahBappedaPage() {
  const { usulanList, updateUsulanStatus } = useApp();
  const [filter, setFilter] = useState<
    "Semua" | "Menunggu Telaah" | "Disetujui Masuk Rencana" | "Perlu Survei Lapangan"
  >("Menunggu Telaah");
  const [catatan, setCatatan] = useState<{ [id: string]: string }>({});

  const filtered = usulanList.filter((u) => {
    if (filter === "Semua") return true;
    return u.status === filter;
  });

  const handleApprove = (id: string) => {
    updateUsulanStatus(
      id,
      "Disetujui Masuk Rencana",
      catatan[id] || "Disetujui untuk diintegrasikan dalam Rencana Induk Pariwisata Bahari (RIPPARKAB) Pamekasan."
    );
    alert("Usulan berhasil disetujui dan ditandai masuk Rencana Pengembangan!");
  };

  const handleSurvey = (id: string) => {
    updateUsulanStatus(
      id,
      "Perlu Survei Lapangan",
      catatan[id] || "Dijadwalkan untuk survei lapangan bersama Tim Teknis Disporapar & Bappeda."
    );
    alert("Status diubah ke Perlu Survei Lapangan.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#00273e]">
            Panel Telaah Bappeda & Disporapar
          </h1>
          <p className="text-sm text-[#42474d] mt-1">
            Penelaahan kelayakan spasial, dampak ekonomi lokal, dan fasilitas pendukung untuk pengembangan pariwisata bahari.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#ffffff] p-1 rounded-xl border border-[#e6e2d9] shadow-xs">
          {(["Semua", "Menunggu Telaah", "Disetujui Masuk Rencana", "Perlu Survei Lapangan"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab
                    ? "bg-[#083d5c] text-white shadow-sm"
                    : "text-[#42474d] hover:text-[#1c1c16] hover:bg-[#ece8df]"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* List of Proposals */}
      <div className="space-y-4">
        {filtered.map((usul) => (
          <div
            key={usul.id}
            className="p-6 rounded-2xl bg-white border border-[#e6e2d9] text-[#1c1c16] shadow-xs space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6e2d9] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1a6392]">
                    {usul.ticketNumber}
                  </span>
                  <span className="text-[#e6e2d9]">•</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[#ece8df] font-semibold text-[#083d5c]">
                    Kategori: {usul.kategori}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[#ece8df] font-semibold text-[#42474d]">
                    Kec. {usul.kecamatan} ({usul.desa})
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#00273e] mt-1">{usul.namaObjek}</h3>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 inline-flex items-center gap-1.5 ${
                  usul.status === "Disetujui Masuk Rencana"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : usul.status === "Perlu Survei Lapangan"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-[#ece8df] text-[#42474d]"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {usul.status}
              </span>
            </div>

            {/* Description & Impact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2 space-y-2">
                <div>
                  <span className="font-bold text-[#42474d] block mb-0.5">Deskripsi Potensi:</span>
                  <p className="text-[#1c1c16] leading-relaxed">{usul.deskripsi}</p>
                </div>
                <div>
                  <span className="font-bold text-[#16a34a] block mb-0.5">Analisis Dampak Ekonomi:</span>
                  <p className="text-[#42474d] leading-relaxed">{usul.potensiEkonomi}</p>
                </div>
                <div>
                  <span className="font-bold text-[#42474d] block mb-0.5">Fasilitas yang Dibutuhkan:</span>
                  <p className="text-[#42474d] leading-relaxed">{usul.kebutuhanFasilitas}</p>
                </div>
              </div>

              {/* Spatial and submitter metadata */}
              <div className="p-3 bg-[#f7f3ea] rounded-xl border border-[#e6e2d9] space-y-2">
                <div>
                  <span className="text-[10px] text-[#42474d] block">Pengusul / Lembaga:</span>
                  <span className="font-semibold text-[#00273e]">{usul.namaPengusul}</span>
                  <div className="text-[11px] text-[#42474d]">{usul.kontakPengusul}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#42474d] block">Koordinat SIG:</span>
                  <span className="font-mono text-[#083d5c] text-[11px]">
                    Lat: {usul.latitude}, Lng: {usul.longitude}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#42474d] block">Estimasi Serapan Kerja:</span>
                  <span className="font-bold text-[#d97706] text-xs">
                    {usul.estimasiSerapanKerja} Pekerja Lokal
                  </span>
                </div>
              </div>
            </div>

            {/* Existing notes */}
            {usul.catatanDinas && (
              <div className="p-3 rounded-xl bg-[#ece8df] border border-[#e6e2d9] text-xs text-[#083d5c]">
                <span className="font-bold block mb-0.5">Catatan Tim Penelaah:</span>
                <p>{usul.catatanDinas}</p>
              </div>
            )}

            {/* Review Form & Action Buttons */}
            {usul.status === "Menunggu Telaah" && (
              <div className="pt-3 border-t border-[#e6e2d9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Beri catatan hasil telaah teknis..."
                  value={catatan[usul.id] || ""}
                  onChange={(e) => setCatatan({ ...catatan, [usul.id]: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#fdf9f0] border border-[#e6e2d9] rounded-lg text-xs text-[#1c1c16] placeholder-[#42474d] focus:outline-none focus:border-[#1a6392]"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSurvey(usul.id)}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Jadwalkan Survei
                  </button>
                  <button
                    onClick={() => handleApprove(usul.id)}
                    className="px-4 py-2 rounded-lg bg-[#00273e] hover:bg-[#083d5c] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Setujui Rencana
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white border border-[#e6e2d9] rounded-2xl text-[#42474d] text-sm">
            Tidak ada usulan potensi wisata pada kategori filter ini.
          </div>
        )}
      </div>
    </div>
  );
}
