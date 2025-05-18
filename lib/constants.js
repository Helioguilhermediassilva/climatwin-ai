// Constantes para o ClimaTwin AI

// URLs dos dados
export const DATA_URLS = {
  NDVI: "https://pub-50b34950eb994f78bf6130947afc7c09.r2.dev/public/data/ndvi/NDVI_S2_T18LWQ_20250506_windowed.tif",
  SENTINEL2: "https://pub-50b34950eb994f78bf6130947afc7c09.r2.dev/public/data/sentinel2_processed/S2_T18LWQ_20250506_RGB_10m.tif",
};

// Datas disponíveis (atualmente apenas uma, mas estrutura preparada para expansão)
export const AVAILABLE_DATES = [
  {
    id: "20250506",
    label: "06/05/2025",
    date: new Date(2025, 4, 6), // Mês é 0-indexed (4 = maio)
    ndviUrl: DATA_URLS.NDVI,
    rgbUrl: DATA_URLS.SENTINEL2,
  },
];

// Área de interesse (Amazônia Legal)
export const AREA_OF_INTEREST = {
  bounds: [-74.0, -10.0, -49.0, 3.0], // [oeste, sul, leste, norte]
  center: [-61.5, -3.5], // [longitude, latitude]
  zoom: 5,
};

// Configurações de visualização
export const VISUALIZATION = {
  ndvi: {
    colorScale: [
      { value: -1, color: [255, 255, 255] }, // Água/nuvens
      { value: 0, color: [120, 120, 120] },  // Solo exposto
      { value: 0.2, color: [255, 255, 0] },  // Vegetação esparsa
      { value: 0.4, color: [0, 255, 0] },    // Vegetação moderada
      { value: 0.6, color: [0, 120, 0] },    // Vegetação densa
      { value: 1, color: [0, 60, 0] },       // Vegetação muito densa
    ],
    opacity: 0.8,
  },
};

// Fontes de dados para o rodapé
export const DATA_SOURCES = [
  { name: "NASA", url: "https://www.nasa.gov/" },
  { name: "USGS", url: "https://www.usgs.gov/" },
  { name: "CHIRPS", url: "https://www.chc.ucsb.edu/data/chirps" },
  { name: "Copernicus", url: "https://www.copernicus.eu/" },
];

// Cores da identidade visual
export const THEME_COLORS = {
  primaryColor: "#006400", // Verde escuro
  secondaryColor: "#F2F2F2", // Cinza claro
  white: "#FFFFFF",
  textColor: "#333333",
};
