// Utilitários para processamento de dados geoespaciais
import * as GeoTIFF from 'geotiff';

// Função para carregar um arquivo GeoTIFF a partir de uma URL
export async function loadGeoTIFF(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`Falha ao carregar GeoTIFF: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const data = await image.readRasters();
    
    return {
      data,
      width: image.getWidth(),
      height: image.getHeight(),
      bbox: image.getBoundingBox(),
      metadata: image.getFileDirectory(),
    };
  } catch (error) {
    console.error('Erro ao carregar GeoTIFF:', error);
    throw error;
  }
}

// Função para converter dados NDVI em uma escala de cores
export function applyColorScale(ndviData, colorScale, width, height) {
  const rgba = new Uint8ClampedArray(width * height * 4);
  
  for (let i = 0; i < ndviData.length; i++) {
    const ndviValue = ndviData[i];
    let color = [0, 0, 0, 0]; // Transparente por padrão
    
    // Encontrar a cor correspondente na escala
    for (let j = 0; j < colorScale.length - 1; j++) {
      const current = colorScale[j];
      const next = colorScale[j + 1];
      
      if (ndviValue >= current.value && ndviValue <= next.value) {
        // Interpolação linear entre as cores
        const ratio = (ndviValue - current.value) / (next.value - current.value);
        color = [
          Math.round(current.color[0] + ratio * (next.color[0] - current.color[0])),
          Math.round(current.color[1] + ratio * (next.color[1] - current.color[1])),
          Math.round(current.color[2] + ratio * (next.color[2] - current.color[2])),
          255 // Opacidade total
        ];
        break;
      }
    }
    
    // Definir os valores RGBA
    const idx = i * 4;
    rgba[idx] = color[0];     // R
    rgba[idx + 1] = color[1]; // G
    rgba[idx + 2] = color[2]; // B
    rgba[idx + 3] = color[3]; // A
  }
  
  return rgba;
}

// Função para calcular estatísticas básicas de um conjunto de dados NDVI
export function calculateNDVIStats(ndviData) {
  // Filtrar valores inválidos (geralmente -9999 ou NaN)
  const validData = ndviData.filter(val => val >= -1 && val <= 1);
  
  if (validData.length === 0) {
    return {
      min: null,
      max: null,
      mean: null,
      median: null,
    };
  }
  
  // Calcular estatísticas
  const min = Math.min(...validData);
  const max = Math.max(...validData);
  const sum = validData.reduce((acc, val) => acc + val, 0);
  const mean = sum / validData.length;
  
  // Calcular mediana
  const sorted = [...validData].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
  
  return {
    min,
    max,
    mean,
    median,
  };
}

// Função para detectar anomalias em dados NDVI
export function detectNDVIAnomalies(ndviData, threshold = 0.2) {
  const stats = calculateNDVIStats(ndviData);
  
  // Se não houver dados válidos, retornar array vazio
  if (stats.mean === null) {
    return [];
  }
  
  // Detectar valores que se desviam significativamente da média
  const anomalies = ndviData.map((value, index) => {
    if (value >= -1 && value <= 1) {
      const deviation = Math.abs(value - stats.mean);
      if (deviation > threshold) {
        return {
          index,
          value,
          deviation,
          isLow: value < stats.mean
        };
      }
    }
    return null;
  }).filter(Boolean);
  
  return anomalies;
}

// Função para converter coordenadas geográficas para índices de pixel em um GeoTIFF
export function geoToPixel(lon, lat, bbox, width, height) {
  const [minX, minY, maxX, maxY] = bbox;
  
  // Verificar se as coordenadas estão dentro do bounding box
  if (lon < minX || lon > maxX || lat < minY || lat > maxY) {
    return null;
  }
  
  // Converter coordenadas geográficas para índices de pixel
  const x = Math.floor((lon - minX) / (maxX - minX) * width);
  const y = Math.floor((maxY - lat) / (maxY - minY) * height);
  
  return { x, y };
}

// Função para extrair valor de um ponto específico nos dados raster
export function getValueAtPoint(data, x, y, width) {
  const index = y * width + x;
  if (index >= 0 && index < data.length) {
    return data[index];
  }
  return null;
}
