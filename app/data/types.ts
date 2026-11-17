export interface PelakuEkonomi {
  namaUsaha: string;
  pengelola: string;
  kategori: "Kuliner Bahari" | "Sentra UMKM & Oleh-oleh" | "Pusat Garam Rakyat" | "Sentra Batik Pesisir" | "Jasa Perahu Wisata" | "Penginapan & Homestay";
  omsetBulanan: string;
  tenagaKerja: number;
  kontak: string;
}

export interface DestinasiWisata {
  id: string;
  nama: string;
  kategori: "Pantai & Pesisir" | "Ekowisata Mangrove" | "Sentra Budaya & Batik Garam" | "Spot Snorkeling & Terumbu" | "Dermaga Wisata & Kuliner";
  kecamatan: "Tlanakan" | "Pademawu" | "Galis" | "Pasean" | "Batu Marmar";
  lokasi: string;
  latitude: number;
  longitude: number;
  deskripsi: string;
  dayaTarik: string[];
  fasilitas: string[];
  tiketMasuk: string;
  estimasiKunjunganBulanan: number;
  perputaranUangBulanan: string;
  jumlahUmkmBinaan: number;
  rating: number;
  imageUrl: string;
  statusPengembangan: "Unggulan" | "Berkembang" | "Potensial";
  pelakuEkonomi: PelakuEkonomi[];
}

export interface UsulanPotensiWisata {
  id: string;
  ticketNumber: string;
  namaPengusul: string;
  kontakPengusul: string;
  namaObjek: string;
  kategori: "Spot Wisata Baru" | "Sentra UMKM Bahari" | "Ekowisata Konservasi" | "Event Budaya Bahari";
  kecamatan: string;
  desa: string;
  latitude: number;
  longitude: number;
  deskripsi: string;
  potensiEkonomi: string;
  kebutuhanFasilitas: string;
  status: "Menunggu Telaah" | "Disetujui Masuk Rencana" | "Perlu Survei Lapangan";
  catatanDinas?: string;
  createdAt: string;
  estimasiSerapanKerja: number;
}

export interface MapLayer {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  visible: boolean;
  type: "vector" | "raster" | "point" | "polygon";
  count?: number;
}

export interface IndikatorEkonomiPamekasan {
  totalDestinasi: number;
  totalUmkmPesisir: number;
  perputaranEkonomiTahunan: string;
  tenagaKerjaTerserap: number;
  wilayahPrioritas: string;
}
