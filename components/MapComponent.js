import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, ImageOverlay, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AREA_OF_INTEREST, AVAILABLE_DATES, VISUALIZATION } from '../lib/constants';
import { loadGeoTIFF, applyColorScale } from '../lib/geospatial';
import MapInteraction from './MapInteraction';

// Componente para controlar o centro e zoom do mapa
function MapController() {
  const map = useMap();
  
  useEffect(() => {
    map.setView(
      [AREA_OF_INTEREST.center[1], AREA_OF_INTEREST.center[0]],
      AREA_OF_INTEREST.zoom
    );
  }, [map]);
  
  return null;
}

// Componente para renderizar camada NDVI
function NDVILayer({ url, visible, onDataLoaded }) {
  const [ndviData, setNdviData] = useState(null);
  const canvasRef = useRef(null);
  const map = useMap();
  
  useEffect(() => {
    if (!visible) return;
    
    let isMounted = true;
    
    const loadData = async () => {
      try {
        const geoTiff = await loadGeoTIFF(url);
        if (isMounted) {
          setNdviData(geoTiff);
          if (onDataLoaded) {
            onDataLoaded(geoTiff);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados NDVI:', error);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [url, visible, onDataLoaded]);
  
  useEffect(() => {
    if (!ndviData || !visible || !canvasRef.current) return;
    
    const { data, width, height, bbox } = ndviData;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    
    // Aplicar escala de cores aos dados NDVI
    const rgba = applyColorScale(data[0], VISUALIZATION.ndvi.colorScale, width, height);
    imageData.data.set(rgba);
    
    ctx.putImageData(imageData, 0, 0);
    
    // Converter bbox para formato Leaflet [sul, oeste, norte, leste]
    const bounds = [
      [bbox[1], bbox[0]],
      [bbox[3], bbox[2]]
    ];
    
    // Atualizar o mapa
    map.fitBounds(bounds);
    
  }, [ndviData, visible, map]);
  
  if (!visible || !ndviData) return null;
  
  const bounds = [
    [ndviData.bbox[1], ndviData.bbox[0]],
    [ndviData.bbox[3], ndviData.bbox[2]]
  ];
  
  return (
    <>
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }} 
      />
      <ImageOverlay 
        url={canvasRef.current?.toDataURL()} 
        bounds={bounds} 
        opacity={VISUALIZATION.ndvi.opacity} 
      />
    </>
  );
}

// Componente para renderizar camada RGB (Sentinel-2)
function RGBLayer({ url, visible }) {
  const bounds = [
    [AREA_OF_INTEREST.bounds[1], AREA_OF_INTEREST.bounds[0]],
    [AREA_OF_INTEREST.bounds[3], AREA_OF_INTEREST.bounds[2]]
  ];
  
  if (!visible) return null;
  
  return (
    <ImageOverlay 
      url={url} 
      bounds={bounds} 
      opacity={1.0} 
    />
  );
}

// Componente principal do mapa
export default function MapComponent() {
  const [activeLayer, setActiveLayer] = useState('rgb'); // 'ndvi' ou 'rgb'
  const [selectedDate, setSelectedDate] = useState(AVAILABLE_DATES[0]);
  const [ndviData, setNdviData] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  
  // Garantir que o Leaflet esteja disponível apenas no cliente
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Manipulador para quando um ponto é selecionado no mapa
  const handlePointSelect = useCallback((point) => {
    setSelectedPoint(point);
    console.log('Ponto selecionado:', point);
    // Aqui você pode adicionar lógica para atualizar gráficos ou relatórios
  }, []);
  
  // Manipulador para quando os dados NDVI são carregados
  const handleNDVIDataLoaded = useCallback((data) => {
    setNdviData(data);
  }, []);
  
  if (!isClient) {
    return <div className="map-placeholder">Carregando mapa...</div>;
  }
  
  return (
    <div className="map-container">
      <div className="map-controls">
        <div className="layer-selector">
          <button 
            className={activeLayer === 'rgb' ? 'active' : ''} 
            onClick={() => setActiveLayer('rgb')}
          >
            Imagem RGB
          </button>
          <button 
            className={activeLayer === 'ndvi' ? 'active' : ''} 
            onClick={() => setActiveLayer('ndvi')}
          >
            NDVI
          </button>
        </div>
        
        <div className="date-selector">
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
      </div>
      
      <MapContainer 
        style={{ height: '100%', width: '100%' }}
        center={[AREA_OF_INTEREST.center[1], AREA_OF_INTEREST.center[0]]}
        zoom={AREA_OF_INTEREST.zoom}
        scrollWheelZoom={true}
      >
        <MapController />
        
        {/* Camada base (OpenStreetMap) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Camada RGB (Sentinel-2) */}
        <RGBLayer 
          url={selectedDate.rgbUrl} 
          visible={activeLayer === 'rgb'} 
        />
        
        {/* Camada NDVI */}
        <NDVILayer 
          url={selectedDate.ndviUrl} 
          visible={activeLayer === 'ndvi'} 
          onDataLoaded={handleNDVIDataLoaded}
        />
        
        {/* Componente de interação com o mapa */}
        <MapInteraction 
          onPointSelect={handlePointSelect}
          ndviData={ndviData}
        />
      </MapContainer>
      
      {selectedPoint && (
        <div className="point-info">
          <h3>Ponto Selecionado</h3>
          <p>Latitude: {selectedPoint.lat.toFixed(6)}</p>
          <p>Longitude: {selectedPoint.lng.toFixed(6)}</p>
          {selectedPoint.value !== null && (
            <p>NDVI: {selectedPoint.value.toFixed(4)}</p>
          )}
        </div>
      )}
    </div>
  );
}
