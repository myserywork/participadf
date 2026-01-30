'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Search, Loader2, Navigation, X, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Coordenadas do centro de Brasília
const BRASILIA_CENTER = {
  lat: -15.7801,
  lng: -47.9292
};

const BRASILIA_BOUNDS = {
  north: -15.5,
  south: -16.1,
  east: -47.3,
  west: -48.3
};

interface MapaLocalizacaoProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    endereco: string;
    bairro?: string;
  }) => void;
  initialLocation?: {
    lat: number;
    lng: number;
  };
}

// Componente de mapa carregado dinamicamente (SSR disabled)
const MapaLeaflet = dynamic(() => import('./MapaLeafletInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Carregando mapa...</p>
      </div>
    </div>
  )
});

export default function MapaLocalizacao({ onLocationSelect, initialLocation }: MapaLocalizacaoProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    endereco: string;
    bairro?: string;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState(initialLocation || BRASILIA_CENTER);
  const [searchResults, setSearchResults] = useState<Array<{
    display_name: string;
    lat: string;
    lon: string;
  }>>([]);
  const [showResults, setShowResults] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Busca endereço via Nominatim (OpenStreetMap)
  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query + ', Distrito Federal, Brasil')}&` +
        `format=json&limit=5&addressdetails=1&` +
        `viewbox=${BRASILIA_BOUNDS.west},${BRASILIA_BOUNDS.north},${BRASILIA_BOUNDS.east},${BRASILIA_BOUNDS.south}&` +
        `bounded=1`,
        {
          headers: {
            'Accept-Language': 'pt-BR'
          }
        }
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce na busca
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        searchAddress(searchQuery);
      }, 500);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchAddress]);

  // Busca reversa (coordenadas para endereço)
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'pt-BR'
          }
        }
      );
      const data = await response.json();
      return {
        endereco: data.display_name || 'Endereço não encontrado',
        bairro: data.address?.suburb || data.address?.neighbourhood || data.address?.city_district
      };
    } catch {
      return { endereco: `${lat.toFixed(6)}, ${lng.toFixed(6)}` };
    }
  }, []);

  // Seleção de resultado da busca
  const handleResultSelect = async (result: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    const location = {
      lat,
      lng,
      endereco: result.display_name
    };

    setSelectedLocation(location);
    setMapCenter({ lat, lng });
    setSearchQuery(result.display_name);
    setShowResults(false);
    onLocationSelect(location);
  };

  // Clique no mapa
  const handleMapClick = async (lat: number, lng: number) => {
    const { endereco, bairro } = await reverseGeocode(lat, lng);

    const location = {
      lat,
      lng,
      endereco,
      bairro
    };

    setSelectedLocation(location);
    onLocationSelect(location);
  };

  // Usar localização atual
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const { endereco, bairro } = await reverseGeocode(latitude, longitude);

        const location = {
          lat: latitude,
          lng: longitude,
          endereco,
          bairro
        };

        setSelectedLocation(location);
        setMapCenter({ lat: latitude, lng: longitude });
        onLocationSelect(location);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        alert('Não foi possível obter sua localização. Verifique as permissões.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Limpar seleção
  const handleClear = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    setMapCenter(BRASILIA_CENTER);
  };

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busque um endereço ou CEP..."
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
            {searchQuery && !isSearching && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowResults(false);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isGettingLocation}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl flex items-center gap-2 transition-colors"
            title="Usar minha localização"
          >
            {isGettingLocation ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">Usar minha localização</span>
          </button>
        </div>

        {/* Resultados da busca */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleResultSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 line-clamp-2">{result.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="relative rounded-xl overflow-hidden border border-gray-200">
        <MapaLeaflet
          center={mapCenter}
          selectedLocation={selectedLocation}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Local selecionado */}
      {selectedLocation && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Local selecionado</p>
                <p className="text-sm text-green-700 mt-1">{selectedLocation.endereco}</p>
                <p className="text-xs text-green-600 mt-1">
                  Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-green-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-green-600" />
            </button>
          </div>
        </div>
      )}

      {/* Instrução */}
      {!selectedLocation && (
        <p className="text-sm text-gray-500 text-center">
          Clique no mapa ou busque um endereço para marcar a localização do fato
        </p>
      )}
    </div>
  );
}
