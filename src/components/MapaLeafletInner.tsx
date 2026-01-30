'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet no Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapaLeafletInnerProps {
  center: {
    lat: number;
    lng: number;
  };
  selectedLocation: {
    lat: number;
    lng: number;
    endereco: string;
  } | null;
  onMapClick: (lat: number, lng: number) => void;
}

export default function MapaLeafletInner({ center, selectedLocation, onMapClick }: MapaLeafletInnerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inicializa o mapa
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Cria o mapa
    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom: 13,
      zoomControl: true,
      attributionControl: true
    });

    // Adiciona a camada de tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Handler de clique
    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Atualiza o centro do mapa quando mudar
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([center.lat, center.lng], 15, { animate: true });
    }
  }, [center.lat, center.lng]);

  // Atualiza o marcador quando a localização selecionada mudar
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove marcador existente
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Adiciona novo marcador se houver localização selecionada
    if (selectedLocation) {
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], { icon })
        .addTo(mapRef.current)
        .bindPopup(selectedLocation.endereco);

      markerRef.current = marker;

      // Centraliza o mapa no marcador
      mapRef.current.setView([selectedLocation.lat, selectedLocation.lng], 16, { animate: true });
    }
  }, [selectedLocation]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px]"
      style={{ minHeight: '400px' }}
    />
  );
}
