import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useApp } from "../context/AppContext";
import type { DestinasiWisata, UsulanPotensiWisata } from "../data/types";

type BasemapType = "osm" | "satellite" | "ocean";

export default function InteractiveMap() {
  const { layers, toggleLayer, destinasiList, usulanList } = useApp();

  const [basemap, setBasemap] = useState<BasemapType>("osm");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("Semua");
  const [selectedKategori, setSelectedKategori] = useState<string>("Semua");

  const [selectedDestinasi, setSelectedDestinasi] = useState<DestinasiWisata | null>(destinasiList[0]);
  const [selectedUsulan, setSelectedUsulan] = useState<UsulanPotensiWisata | null>(null);

  const [showLayerPanel, setShowLayerPanel] = useState(false);

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersLayerGroupRef = useRef<any>(null);
  const polygonsLayerGroupRef = useRef<any>(null);

  const isLayerVisible = (id: string) => {
    return layers.find((l) => l.id === id)?.visible ?? true;
  };

  const filteredDestinasi = useMemo(() => {
    return destinasiList.filter((d) => {
      const matchSearch =
        d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchKecamatan = selectedKecamatan === "Semua" || d.kecamatan === selectedKecamatan;
      const matchKategori = selectedKategori === "Semua" || d.kategori === selectedKategori;
      return matchSearch && matchKecamatan && matchKategori;
    });
  }, [destinasiList, searchQuery, selectedKecamatan, selectedKategori]);

  // Initialize Leaflet Map (Client Side)
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Center on Pamekasan, Madura: lat -7.15, lng 113.55
      const map = L.map(mapContainerRef.current, {
        center: [-7.16, 113.53],
        zoom: 11,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomleft" }).addTo(map);

      // Default OpenStreetMap Tile
      const tile = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tile;
      markersLayerGroupRef.current = L.layerGroup().addTo(map);
      polygonsLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Basemap Tiles
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return;

    import("leaflet").then((module) => {
      const L = module.default;
      if (!mapInstanceRef.current) return;

      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }

      let newTileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

      if (basemap === "satellite") {
        newTileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        attribution = "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
      } else if (basemap === "ocean") {
        newTileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}";
        attribution = "Tiles &copy; Esri &mdash; GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri";
      }

      const newTile = L.tileLayer(newTileUrl, { attribution, maxZoom: 19 }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newTile;
    });
  }, [basemap]);

  // Update Markers & Polygons when layers, destinations, or usulan change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current || typeof window === "undefined") return;

    import("leaflet").then((module) => {
      const L = module.default;
      const markersGroup = markersLayerGroupRef.current;
      const polyGroup = polygonsLayerGroupRef.current;

      markersGroup.clearLayers();
      polyGroup.clearLayers();

      // 1. Poligon Garam Rakyat (Kec. Galis & Pademawu - Kawasan Tambak Pesisir)
      if (isLayerVisible("layer-garam")) {
        const garamCoords: [number, number][] = [
          [-7.175, 113.555],
          [-7.172, 113.578],
          [-7.195, 113.582],
          [-7.198, 113.558],
        ];
        L.polygon(garamCoords, {
          color: "#d97706",
          fillColor: "#f59e0b",
          fillOpacity: 0.25,
          weight: 2,
          dashArray: "5, 5",
        })
          .bindTooltip("<b>Kawasan Industri Garam Rakyat (KIGR)</b><br>Sentra Tambak Garam Geomembran Galis & Pademawu", {
            sticky: true,
          })
          .addTo(polyGroup);
      }

      // 2. Poligon Sabuk Mangrove (Pesisir Montok - Tanjung)
      if (isLayerVisible("layer-mangrove")) {
        const mangroveCoords: [number, number][] = [
          [-7.192, 113.588],
          [-7.191, 113.596],
          [-7.205, 113.594],
          [-7.204, 113.586],
        ];
        L.polygon(mangroveCoords, {
          color: "#16a34a",
          fillColor: "#10b981",
          fillOpacity: 0.3,
          weight: 2,
        })
          .bindTooltip("<b>Sabuk Konservasi Mangrove</b><br>Ekowisata Mangrove Montok & Pesisir Timur", {
            sticky: true,
          })
          .addTo(polyGroup);
      }

      // 3. Koridor Wisata Bahari Pesisir Selatan (Mengikuti Jalan Pesisir Branta - Tlanakan - Pademawu - Galis)
      if (isLayerVisible("layer-koridor")) {
        const koridorCoords: [number, number][] = [
          [-7.2185, 113.4862], // Pantai & Pelabuhan Branta
          [-7.2142, 113.5024], // Kramat / Baddurih
          [-7.2135, 113.5350], // Akses Pesisir Selatan
          [-7.2348, 113.5684], // Pantai Jumiang (Tanjung)
          [-7.2148, 113.5852], // Pantai The Legend
          [-7.1952, 113.5912], // Talang Siring & Mangrove Montok
          [-7.1852, 113.5654], // Sentra Garam Galis
        ];
        L.polyline(koridorCoords, {
          color: "#4f46e5",
          weight: 3.5,
          dashArray: "8, 6",
          opacity: 0.8,
        })
          .bindTooltip("<b>Jalur Koridor Wisata Bahari</b><br>Lintas Pesisir Tlanakan - Pademawu - Galis", {
            sticky: true,
          })
          .addTo(polyGroup);
      }

      // 4. Marker Destinasi Wisata Bahari
      if (isLayerVisible("layer-destinasi")) {
        filteredDestinasi.forEach((item) => {
          const isSelected = selectedDestinasi?.id === item.id;
          const markerColor =
            item.kategori === "Ekowisata Mangrove"
              ? "#16a34a"
              : item.kategori === "Sentra Budaya & Batik Garam"
              ? "#d97706"
              : item.kategori === "Dermaga Wisata & Kuliner"
              ? "#ba1a1a"
              : "#0284c7";

          // Custom HTML Pin Marker
          const icon = L.divIcon({
            className: "custom-div-icon",
            html: `
              <div style="
                background-color: ${markerColor};
                width: ${isSelected ? "22px" : "18px"};
                height: ${isSelected ? "22px" : "18px"};
                border: 2.5px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
              ">
                <div style="width: 5px; height: 5px; background: #ffffff; border-radius: 50%;"></div>
              </div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

          const marker = L.marker([item.latitude, item.longitude], { icon })
            .bindTooltip(`<b>${item.nama}</b><br><span style="font-size:11px; color:#555;">${item.kategori} • Kec. ${item.kecamatan}</span>`, {
              direction: "top",
              offset: [0, -10],
            })
            .addTo(markersGroup);

          marker.on("click", () => {
            setSelectedDestinasi(item);
            setSelectedUsulan(null);
            mapInstanceRef.current.panTo([item.latitude, item.longitude], { animate: true, duration: 0.5 });
          });
        });
      }

      // 5. Marker Usulan Titik Baru Pokdarwis/Warga
      if (isLayerVisible("layer-usulan")) {
        usulanList.forEach((usul) => {
          const icon = L.divIcon({
            className: "custom-div-icon",
            html: `
              <div style="
                background-color: #8b5cf6;
                width: 18px;
                height: 18px;
                border: 2px solid #ffffff;
                border-radius: 4px;
                transform: rotate(45deg);
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                cursor: pointer;
              "></div>
            `,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          });

          const marker = L.marker([usul.latitude, usul.longitude], { icon })
            .bindTooltip(`<b>[USULAN] ${usul.namaObjek}</b><br><span style="font-size:11px; color:#555;">Status: ${usul.status}</span>`, {
              direction: "top",
              offset: [0, -10],
            })
            .addTo(markersGroup);

          marker.on("click", () => {
            setSelectedUsulan(usul);
            setSelectedDestinasi(null);
            mapInstanceRef.current.panTo([usul.latitude, usul.longitude], { animate: true, duration: 0.5 });
          });
        });
      }
    });
  }, [layers, filteredDestinasi, usulanList, selectedDestinasi]);

  // Center on destination when clicked from sidebar
  const handleSelectFromSidebar = (item: DestinasiWisata) => {
    setSelectedDestinasi(item);
    setSelectedUsulan(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([item.latitude, item.longitude], 13, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex overflow-hidden bg-[#eaf4fb] select-none">
      {/* LEFT SIDEBAR: PAMEKASAN EXPLORER & FILTERS */}
      <div className="w-80 md:w-96 bg-[#fdf9f0]/95 backdrop-blur-md border-r border-[#e6e2d9] flex flex-col z-20 shadow-xl shrink-0 transition-all">
        {/* Header Search & Scope */}
        <div className="p-4 border-b border-[#e6e2d9] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1a6392] text-xl">map</span>
              <h2 className="text-xs font-bold text-[#00273e] tracking-wide uppercase">
                Geospasial Pamekasan
              </h2>
            </div>
            <span className="text-[10px] bg-[#ece8df] text-[#083d5c] border border-[#e6e2d9] px-2 py-0.5 rounded-full font-semibold">
              {filteredDestinasi.length} Objek Terpeta
            </span>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#42474d] text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pantai, mangrove, garam, batik..."
              className="w-full pl-9 pr-3 py-2 bg-[#f7f3ea] border border-[#e6e2d9] rounded-lg text-xs text-[#1c1c16] placeholder-[#42474d] focus:outline-none focus:border-[#1a6392] transition-colors"
            />
          </div>

          {/* Kecamatan Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#42474d] uppercase tracking-wider">
              Wilayah Kecamatan Pesisir
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["Semua", "Pademawu", "Tlanakan", "Galis", "Pasean"].map((kec) => (
                <button
                  key={kec}
                  onClick={() => setSelectedKecamatan(kec)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    selectedKecamatan === kec
                      ? "bg-[#083d5c] text-white shadow-sm font-semibold"
                      : "bg-[#ece8df] text-[#42474d] hover:bg-[#e6e2d9] hover:text-[#1c1c16]"
                  }`}
                >
                  {kec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List of Tourism & Economic Destinations */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-thumb-[#e6e2d9]">
          <div className="text-[11px] font-semibold text-[#42474d] uppercase tracking-wider px-1">
            Destinasi Bahari & Klaster Ekonomi
          </div>

          {filteredDestinasi.map((item) => {
            const isSelected = selectedDestinasi?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectFromSidebar(item)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#f1eee5] border-[#1a6392] shadow-md ring-1 ring-[#1a6392]/20"
                    : "bg-[#ffffff] border-[#e6e2d9] hover:bg-[#f7f3ea]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a6392]">
                      {item.kategori}
                    </span>
                    <h3 className="text-xs font-bold text-[#00273e] leading-snug mt-0.5">
                      {item.nama}
                    </h3>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ece8df] text-[#42474d] shrink-0">
                    Kec. {item.kecamatan}
                  </span>
                </div>

                <p className="text-[11px] text-[#42474d] line-clamp-2 mt-1.5 leading-relaxed">
                  {item.deskripsi}
                </p>

                {/* Economic Metric Badge */}
                <div className="mt-2.5 pt-2 border-t border-[#e6e2d9] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-[#16a34a] font-semibold">
                    <span className="material-symbols-outlined text-[14px]">payments</span>
                    <span>{item.perputaranUangBulanan}/bln</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#42474d]">
                    <span className="material-symbols-outlined text-[14px] text-[#d97706]">store</span>
                    <span>{item.jumlahUmkmBinaan} UMKM</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredDestinasi.length === 0 && (
            <div className="text-center py-8 text-xs text-[#42474d]">
              Tidak ada objek wisata bahari yang cocok dengan filter pencarian.
            </div>
          )}
        </div>

        {/* Quick Summary Footer */}
        <div className="p-3 border-t border-[#e6e2d9] bg-[#f7f3ea] flex items-center justify-between text-xs text-[#42474d]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16a34a]"></span>
            <span className="font-medium text-[#1c1c16]">Selat Madura & Pantura</span>
          </div>
          <Link
            to="/usul-potensi"
            className="text-[#1a6392] hover:text-[#083d5c] font-semibold flex items-center gap-0.5"
          >
            <span>+ Usul Titik Baru</span>
          </Link>
        </div>
      </div>

      {/* CENTER: LEAFLET OPENSTREETMAP / ESRI WEBGIS CONTAINER */}
      <div className="flex-1 relative h-full flex flex-col overflow-hidden">
        {/* Floating Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Basemap Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#fdf9f0]/95 backdrop-blur-md rounded-xl border border-[#e6e2d9] shadow-md pointer-events-auto">
            {(["osm", "satellite", "ocean"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setBasemap(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  basemap === mode
                    ? "bg-[#083d5c] text-white shadow-sm"
                    : "text-[#42474d] hover:text-[#1c1c16] hover:bg-[#ece8df]"
                }`}
              >
                {mode === "osm" ? "Peta Standar (OSM)" : mode === "satellite" ? "Citra Satelit" : "Peta Laut (Ocean)"}
              </button>
            ))}
          </div>

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-[#fdf9f0]/95 backdrop-blur-md rounded-xl border border-[#e6e2d9] shadow-md pointer-events-auto text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#42474d]">Wilayah:</span>
              <span className="font-bold text-[#00273e]">Pesisir Kab. Pamekasan</span>
            </div>
            <div className="w-px h-4 bg-[#e6e2d9]"></div>
            <div className="flex items-center gap-1.5 text-[#16a34a] font-semibold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>Est. Perputaran Uang: Rp 1,94 Miliar/Bulan</span>
            </div>
          </div>

          {/* Layer Toggle Button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className="px-3.5 py-2 bg-[#fdf9f0]/95 backdrop-blur-md hover:bg-[#ece8df] text-[#00273e] border border-[#e6e2d9] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[#1a6392] text-[18px]">layers</span>
              <span>{showLayerPanel ? "Tutup Layer" : "Buka Layer GIS"}</span>
            </button>
          </div>
        </div>

        {/* Real Leaflet Map Container Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* BOTTOM / RIGHT OVERLAY: DETAIL KARTU POTENSI EKONOMI */}
        {selectedDestinasi && (
          <div className="absolute bottom-4 right-4 max-w-md w-full bg-[#fdf9f0]/95 backdrop-blur-xl border border-[#e6e2d9] rounded-2xl shadow-2xl p-5 z-20 text-[#1c1c16] animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#ece8df] text-[#083d5c]">
                    {selectedDestinasi.kategori}
                  </span>
                  <span className="text-xs text-[#42474d]">Kec. {selectedDestinasi.kecamatan}</span>
                </div>
                <h3 className="text-base font-bold text-[#00273e] mt-1 leading-snug">
                  {selectedDestinasi.nama}
                </h3>
                <p className="text-[11px] text-[#42474d] mt-1">{selectedDestinasi.lokasi}</p>
              </div>

              <button
                onClick={() => setSelectedDestinasi(null)}
                className="p-1 rounded-lg text-[#42474d] hover:text-[#1c1c16] hover:bg-[#ece8df]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Economic Metrics Highlights */}
            <div className="grid grid-cols-3 gap-2 mt-4 bg-[#f7f3ea] p-3 rounded-xl border border-[#e6e2d9] text-center">
              <div>
                <span className="text-[10px] text-[#42474d] block">Est. Perputaran Uang</span>
                <span className="text-xs font-bold text-[#16a34a] block mt-0.5">
                  {selectedDestinasi.perputaranUangBulanan}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#42474d] block">Kunjungan/Bln</span>
                <span className="text-xs font-bold text-[#1a6392] block mt-0.5">
                  {selectedDestinasi.estimasiKunjunganBulanan.toLocaleString()} Orang
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#42474d] block">UMKM Terkoneksi</span>
                <span className="text-xs font-bold text-[#d97706] block mt-0.5">
                  {selectedDestinasi.jumlahUmkmBinaan} Usaha
                </span>
              </div>
            </div>

            {/* Pelaku Ekonomi / Usaha Terdaftar */}
            {selectedDestinasi.pelakuEkonomi.length > 0 && (
              <div className="mt-3.5 space-y-1.5">
                <span className="text-[11px] font-semibold text-[#42474d] uppercase tracking-wider block">
                  Contoh Klaster Pelaku Ekonomi:
                </span>
                {selectedDestinasi.pelakuEkonomi.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#ffffff] border border-[#e6e2d9] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#00273e]">{p.namaUsaha}</div>
                      <div className="text-[10px] text-[#42474d]">
                        {p.kategori} • {p.tenagaKerja} Tenaga Kerja
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-[#16a34a]">{p.omsetBulanan}/bln</div>
                      <div className="text-[10px] text-[#42474d]">{p.pengelola}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-4 pt-3 border-t border-[#e6e2d9] flex items-center justify-between">
              <span className="text-[11px] text-[#42474d] font-mono">
                Lat: {selectedDestinasi.latitude.toFixed(4)}, Lng: {selectedDestinasi.longitude.toFixed(4)}
              </span>
              <Link
                to="/analisis-ekonomi"
                className="px-3 py-1.5 rounded-lg bg-[#00273e] hover:bg-[#083d5c] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
              >
                <span>Lihat Analisis Lengkap</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        )}

        {/* BOTTOM / RIGHT OVERLAY: USULAN BARU DETAIL */}
        {selectedUsulan && (
          <div className="absolute bottom-4 right-4 max-w-md w-full bg-[#fdf9f0]/95 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-2xl p-5 z-20 text-[#1c1c16] animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                  {selectedUsulan.ticketNumber} • {selectedUsulan.kategori}
                </span>
                <h3 className="text-base font-bold text-[#00273e] mt-1 leading-snug">
                  {selectedUsulan.namaObjek}
                </h3>
                <p className="text-[11px] text-[#42474d] mt-0.5">
                  Desa {selectedUsulan.desa}, Kec. {selectedUsulan.kecamatan}
                </p>
              </div>
              <button
                onClick={() => setSelectedUsulan(null)}
                className="p-1 rounded-lg text-[#42474d] hover:text-[#1c1c16] hover:bg-[#ece8df]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#42474d] mt-3 leading-relaxed">{selectedUsulan.deskripsi}</p>

            <div className="mt-3 p-3 rounded-lg bg-[#ffffff] border border-[#e6e2d9] text-xs space-y-1">
              <div className="text-[#1a6392] font-semibold">Prospek Ekonomi & Kerja:</div>
              <p className="text-[#42474d] text-[11px]">{selectedUsulan.potensiEkonomi}</p>
              <div className="text-[11px] text-purple-700 mt-1 font-semibold">
                Estimasi Serapan: {selectedUsulan.estimasiSerapanKerja} Pekerja Lokal
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#e6e2d9] flex items-center justify-between">
              <span className="px-2 py-1 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                Status: {selectedUsulan.status}
              </span>
              <Link
                to="/telaah-bappeda"
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Buka Panel Telaah
              </Link>
            </div>
          </div>
        )}

        {/* FLOATING GIS LAYER CONTROLS */}
        {showLayerPanel && (
          <div className="absolute top-20 right-4 w-72 bg-[#fdf9f0]/95 backdrop-blur-xl border border-[#e6e2d9] rounded-2xl p-4 shadow-xl z-20 text-[#1c1c16] space-y-3">
            <div className="flex items-center justify-between border-b border-[#e6e2d9] pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a6392] text-lg">layers</span>
                <span className="text-xs font-bold text-[#00273e] uppercase tracking-wider">
                  Layer Tematik GIS
                </span>
              </div>
              <button
                onClick={() => setShowLayerPanel(false)}
                className="text-[#42474d] hover:text-[#1c1c16] text-xs"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {layers.map((l) => (
                <div
                  key={l.id}
                  onClick={() => toggleLayer(l.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    l.visible
                      ? "bg-[#ffffff] border-[#1a6392]/40 text-[#1c1c16] shadow-xs"
                      : "bg-[#f7f3ea] border-[#e6e2d9] text-[#72787e] opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ color: l.visible ? l.color : "#72787e" }}
                    >
                      {l.icon}
                    </span>
                    <div>
                      <div className="text-xs font-semibold leading-tight">{l.name}</div>
                      <div className="text-[10px] text-[#42474d]">{l.count} Titik/Poligon</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={l.visible}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-[#1a6392] accent-[#1a6392]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
