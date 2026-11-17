import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/interactive-map.tsx"),
  route("dashboard-bappeda", "routes/dashboard-bappeda.tsx"),
  route("usul-potensi", "routes/usul-potensi.tsx"),
  route("telaah-bappeda", "routes/telaah-bappeda.tsx"),
  route("analisis-ekonomi", "routes/analisis-ekonomi.tsx"),
  route("katalog-data-spasial", "routes/katalog-data-spasial.tsx"),
] satisfies RouteConfig;
