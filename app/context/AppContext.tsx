import React, { createContext, useContext, useState, useEffect } from "react";
import type { DestinasiWisata, MapLayer, UsulanPotensiWisata } from "../data/types";
import { initialLayers, destinasiPamekasan, initialUsulan } from "../data/mockData";

interface AppContextType {
  layers: MapLayer[];
  toggleLayer: (layerId: string) => void;
  destinasiList: DestinasiWisata[];
  usulanList: UsulanPotensiWisata[];
  addUsulan: (
    usulan: Omit<UsulanPotensiWisata, "id" | "ticketNumber" | "status" | "createdAt">
  ) => UsulanPotensiWisata;
  updateUsulanStatus: (
    id: string,
    status: UsulanPotensiWisata["status"],
    catatanDinas?: string
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_USULAN_KEY = "pamekasan_usulan_wisata_v1";
const LOCAL_STORAGE_LAYERS_KEY = "pamekasan_layers_wisata_v1";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [layers, setLayers] = useState<MapLayer[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_LAYERS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return initialLayers;
  });

  const [usulanList, setUsulanList] = useState<UsulanPotensiWisata[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_USULAN_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return initialUsulan;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_LAYERS_KEY, JSON.stringify(layers));
    }
  }, [layers]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_USULAN_KEY, JSON.stringify(usulanList));
    }
  }, [usulanList]);

  const toggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const addUsulan = (
    data: Omit<UsulanPotensiWisata, "id" | "ticketNumber" | "status" | "createdAt">
  ) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newUsulan: UsulanPotensiWisata = {
      ...data,
      id: `usul-${Date.now()}`,
      ticketNumber: `USL-PMK-2026-${randomSuffix}`,
      status: "Menunggu Telaah",
      createdAt: new Date().toISOString(),
    };

    setUsulanList((prev) => [newUsulan, ...prev]);
    return newUsulan;
  };

  const updateUsulanStatus = (
    id: string,
    status: UsulanPotensiWisata["status"],
    catatanDinas?: string
  ) => {
    setUsulanList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status, catatanDinas: catatanDinas || u.catatanDinas } : u
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        layers,
        toggleLayer,
        destinasiList: destinasiPamekasan,
        usulanList,
        addUsulan,
        updateUsulanStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
