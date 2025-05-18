import React, { useState, useEffect, useRef } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AVAILABLE_DATES } from '../lib/constants';
import { getValueAtPoint, geoToPixel, calculateNDVIStats } from '../lib/geospatial';

// Componente para seleção de pontos no mapa
export default function MapInteraction({ onPointSelect, ndviData }) {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedDate, setSelectedDate] = useState(AVAILABLE_DATES[0]);
  const markerRef = useRef(null);
  const map = useMap();

  // Ícone personalizado para o marcador
  const customIcon = new L.Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Manipulador de clique no mapa
  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      
      setSelectedPoint({
        lat,
        lng,
        value: ndviData ? getValueAtNDVIPoint(ndviData, lng, lat) : null,
      });

      if (onPointSelect) {
        onPointSelect({
          lat,
          lng,
          date: selectedDate.date,
          value: ndviData ? getValueAtNDVIPoint(ndviData, lng, lat) : null,
        });
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, ndviData, onPointSelect, selectedDate]);

  // Função para obter valor NDVI em um ponto específico
  const getValueAtNDVIPoint = (ndviData, lon, lat) => {
    if (!ndviData || !ndviData.data || !ndviData.data[0]) return null;

    const { data, width, height, bbox } = ndviData;
    const pixel = geoToPixel(lon, lat, bbox, width, height);
    
    if (!pixel) return null;
    
    return getValueAtPoint(data[0], pixel.x, pixel.y, width);
  };

  return (
    <>
      {/* Timeslider para seleção de data */}
      <div className="timeslider-container">
        <label htmlFor="date-select">Data:</label>
        <select 
          id="date-select"
          value={selectedDate.id}
          onChange={(e) => {
            const newDate = AVAILABLE_DATES.find(d => d.id === e.target.value);
            if (newDate) {
              setSelectedDate(newDate);
            }
          }}
        >
          {AVAILABLE_DATES.map(date => (
            <option key={date.id} value={date.id}>
              {date.label}
            </option>
          ))}
        </select>
      </div>

      {/* Marcador para o ponto selecionado */}
      {selectedPoint && (
        <Marker 
          position={[selectedPoint.lat, selectedPoint.lng]} 
          icon={customIcon}
          ref={markerRef}
        >
          <Popup>
            <div>
              <h3>Ponto Selecionado</h3>
              <p>Latitude: {selectedPoint.lat.toFixed(6)}</p>
              <p>Longitude: {selectedPoint.lng.toFixed(6)}</p>
              {selectedPoint.value !== null && (
                <p>NDVI: {selectedPoint.value.toFixed(4)}</p>
              )}
              <button onClick={() => {
                if (markerRef.current) {
                  markerRef.current.closePopup();
                }
                setSelectedPoint(null);
              }}>
                Remover Marcador
              </button>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}
