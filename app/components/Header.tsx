import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useApp } from "../context/AppContext";

export function Header() {
  const { usulanList } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingCount = usulanList.filter((u) => u.status === "Menunggu Telaah").length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fdf9f0]/95 backdrop-blur-xl border-b border-[#e6e2d9] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00273e] text-white flex items-center justify-center font-bold shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-[#82f5ef]">sailing</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#00273e] tracking-tight">
                  BahariMap <span className="text-[#1a6392]">Pamekasan</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ece8df] text-[11px] font-semibold text-[#1a6392]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6392] animate-pulse"></span>
                  Sistem Aktif
                </span>
              </div>
              <span className="text-[11px] text-[#42474d] hidden sm:inline">
                Sistem Informasi Geospasial Pariwisata Bahari & Ekonomi Pamekasan
              </span>
            </div>
          </Link>
        </div>

        {/* Center Nav */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#f7f3ea] rounded-xl border border-[#e6e2d9]/60">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#083d5c] text-white shadow-sm"
                  : "text-[#42474d] hover:text-[#1c1c16] hover:bg-[#ece8df]"
              }`
            }
          >
            Peta Geospasial
          </NavLink>
          <NavLink
            to="/dashboard-bappeda"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#083d5c] text-white shadow-sm"
                  : "text-[#42474d] hover:text-[#1c1c16] hover:bg-[#ece8df]"
              }`
            }
          >
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            <span>Dasbor Bappeda</span>
          </NavLink>
          <NavLink
            to="/usul-potensi"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#083d5c] text-white shadow-sm"
                  : "text-[#42474d] hover:text-[#1c1c16] hover:bg-[#ece8df]"
              }`
            }
          >
            Usul Potensi Baru
          </NavLink>
          <NavLink
            to="/telaah-bappeda"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#083d5c] text-white shadow-sm"
                  : "text-[#42474d] hover:text-[#1c1c16] hover:bg-[#ece8df]"
              }`
            }
          >
            <span>Telaah Bappeda / Disporapar</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/analisis-ekonomi"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#083d5c] text-white shadow-sm"
                  : "text-[#42474d] hover:text-[#1c1c16] hover:bg-[#ece8df]"
              }`
            }
          >
            Analisis & Nilai Ekonomi
          </NavLink>
          <NavLink
            to="/katalog-data-spasial"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#083d5c] text-white shadow-sm"
                  : "text-[#42474d] hover:text-[#1c1c16] hover:bg-[#ece8df]"
              }`
            }
          >
            Katalog Data Spasial
          </NavLink>
        </nav>

        {/* Right Info / Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/usul-potensi"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00273e] hover:bg-[#083d5c] text-white text-xs font-bold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-[#82f5ef]">add_location_alt</span>
            <span>+ Usul Potensi</span>
          </Link>

          {/* User profile / Role badge clickable to Executive Dashboard */}
          <Link
            to="/dashboard-bappeda"
            className="flex items-center gap-2 pl-2 border-l border-[#e6e2d9] hover:opacity-85 transition-opacity"
            title="Buka Dasbor Eksekutif Bappeda & Disporapar"
          >
            <div className="w-8 h-8 rounded-full bg-[#00273e] text-[#82f5ef] border border-[#1a6392] flex items-center justify-center font-extrabold text-xs shadow-sm">
              PMK
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#00273e] leading-tight">Bappeda & Disporapar</span>
              <span className="text-[10px] text-[#1a6392] font-semibold leading-tight flex items-center gap-1">
                <span>Kab. Pamekasan</span>
                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              </span>
            </div>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#42474d] hover:bg-[#ece8df]"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#e6e2d9] px-4 py-3 bg-[#fdf9f0] space-y-1">
          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive ? "bg-[#083d5c] text-white" : "text-[#42474d] hover:bg-[#ece8df]"
              }`
            }
          >
            Peta Geospasial
          </NavLink>
          <NavLink
            to="/usul-potensi"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive ? "bg-[#083d5c] text-white" : "text-[#42474d] hover:bg-[#ece8df]"
              }`
            }
          >
            Usul Potensi Baru
          </NavLink>
          <NavLink
            to="/telaah-bappeda"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive ? "bg-[#083d5c] text-white" : "text-[#42474d] hover:bg-[#ece8df]"
              }`
            }
          >
            <span>Telaah Bappeda / Disporapar</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/analisis-ekonomi"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive ? "bg-[#083d5c] text-white" : "text-[#42474d] hover:bg-[#ece8df]"
              }`
            }
          >
            Analisis & Nilai Ekonomi
          </NavLink>
          <NavLink
            to="/katalog-data-spasial"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive ? "bg-[#083d5c] text-white" : "text-[#42474d] hover:bg-[#ece8df]"
              }`
            }
          >
            Katalog Data Spasial
          </NavLink>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const location = useLocation();
  if (location.pathname === "/") {
    return null;
  }

  return (
    <footer className="bg-[#fdf9f0] border-t border-[#e6e2d9] py-4 text-[#42474d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#00273e]">BahariMap Pamekasan (WebGIS)</span>
          <span>•</span>
          <span>Bappeda & Disporapar Kab. Pamekasan</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Datum EPSG:4326 (WGS 84)</span>
          <span>•</span>
          <span>Pariwisata Bahari & UMKM Pesisir Pamekasan</span>
        </div>
      </div>
    </footer>
  );
}
