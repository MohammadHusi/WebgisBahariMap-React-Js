import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function SpatialDataCatalogPage() {
  const { layers, destinasiList } = useApp();
  const [query, setQuery] = useState("");

  const filtered = layers.filter(
    (l) =>
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleDownloadGeoJSON = (layerName: string) => {
    const features = destinasiList.map((d) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [d.longitude, d.latitude],
      },
      properties: {
        id: d.id,
        nama: d.nama,
        kategori: d.kategori,
        kecamatan: d.kecamatan,
        lokasi: d.lokasi,
        perputaranUangBulanan: d.perputaranUangBulanan,
        kunjunganBulanan: d.estimasiKunjunganBulanan,
        umkmBinaan: d.jumlahUmkmBinaan,
        rating: d.rating,
      },
    }));

    const geojson = {
      type: "FeatureCollection",
      name: `Pamekasan_${layerName.replace(/[^a-zA-Z0-9]/g, "_")}`,
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features,
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/geo+json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pamekasan_${layerName.toLowerCase().replace(/[^a-z0-9]/g, "_")}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-[#1c1c16]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#00273e]">
            Katalog Data Spasial Bahari & Ekonomi
          </h1>
          <p className="text-sm text-[#42474d] mt-1">
            Daftar lapisan peta spasial pariwisata bahari Kabupaten Pamekasan dalam format standar GeoJSON.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari dataset..."
            className="px-3.5 py-2 bg-white border border-[#e6e2d9] rounded-lg text-xs text-[#1c1c16] placeholder-[#42474d] focus:outline-none focus:border-[#1a6392] w-full sm:w-64 shadow-xs"
          />
        </div>
      </div>

      {/* Layers List */}
      <div className="bg-white rounded-xl border border-[#e6e2d9] divide-y divide-[#e6e2d9] overflow-hidden shadow-xs">
        {filtered.map((layer) => (
          <div
            key={layer.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fdf9f0] transition-colors"
          >
            <div className="flex items-start gap-3">
              <span
                className="material-symbols-outlined text-[24px] mt-0.5"
                style={{ color: layer.color }}
              >
                {layer.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#00273e]">{layer.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#ece8df] text-[#42474d]">
                    {layer.type}
                  </span>
                </div>
                <p className="text-xs text-[#42474d] mt-0.5">{layer.description}</p>
                <span className="text-[11px] font-mono text-[#72787e] mt-1 block">
                  Datum EPSG:4326 (WGS 84) • Wilayah Kab. Pamekasan
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => handleDownloadGeoJSON(layer.name)}
                className="px-3 py-1.5 rounded-lg bg-[#00273e] hover:bg-[#083d5c] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-[#82f5ef]">download</span>
                <span>Unduh GeoJSON</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-[#42474d]">
            Tidak ada dataset yang sesuai dengan pencarian Anda.
          </div>
        )}
      </div>

      {/* Academic Citation Box */}
      <div className="mt-8 p-4 bg-[#f7f3ea] rounded-xl border border-[#e6e2d9] text-xs text-[#42474d] space-y-1.5">
        <div className="font-bold text-[#00273e] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#1a6392] text-base">school</span>
          <span>Pedoman Sitasi / Referensi Akademik Tugas Kuliah:</span>
        </div>
        <p className="font-mono bg-white p-3 rounded-lg border border-[#e6e2d9] text-[#1c1c16] leading-relaxed">
          BahariMap Pamekasan (2026). Perancangan & Manajemen Sistem Informasi Geospasial (WebGIS) untuk Pemetaan dan
          Optimasi Potensi Ekonomi Pariwisata Bahari Kabupaten Pamekasan. Basis Data SIG Skripsi/Tugas Akhir.
        </p>
      </div>
    </div>
  );
}
