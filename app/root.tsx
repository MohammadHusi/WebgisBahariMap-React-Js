import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Header, Footer } from "./components/Header";
import { AppProvider } from "./context/AppContext";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
  },
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
    integrity: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",
    crossOrigin: "anonymous",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>BahariMap Pamekasan - WebGIS Potensi Pariwisata Bahari & Ekonomi</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-[#fdf9f0] text-[#1c1c16] antialiased min-h-screen flex flex-col font-sans">
        <AppProvider>
          <Header />
          <main className="flex-1 w-full pt-16 flex flex-col">{children}</main>
          <Footer />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#0284c7] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-[#525252] font-medium">Memuat BahariMap...</p>
      </div>
    </div>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Terjadi Kesalahan";
  let details = "Halaman tidak dapat dimuat.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404 - Halaman Tidak Ditemukan" : "Kesalahan Sistem";
    details = error.status === 404 ? "Halaman yang Anda tuju tidak ditemukan." : details;
  }

  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-white rounded-xl border border-[#e6e2d9] text-center text-[#1c1c16] shadow-sm">
      <h1 className="text-xl font-bold">{message}</h1>
      <p className="text-sm text-[#42474d] mt-2">{details}</p>
    </div>
  );
}
