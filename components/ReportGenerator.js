import React, { useState, useEffect, useRef } from 'react';
import { calculateNDVIStats, detectNDVIAnomalies } from '../lib/geospatial';
import { THEME_COLORS } from '../lib/constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Componente para relatórios automáticos com insights
export default function ReportGenerator({ selectedPoint, ndviData }) {
  const [stats, setStats] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef(null);

  // Calcular estatísticas quando um ponto é selecionado
  useEffect(() => {
    if (!selectedPoint || !ndviData || !ndviData.data) return;

    // Extrair dados NDVI para análise
    const ndviValues = ndviData.data[0];
    
    // Calcular estatísticas básicas
    const calculatedStats = calculateNDVIStats(ndviValues);
    setStats(calculatedStats);
    
    // Detectar anomalias
    const detectedAnomalies = detectNDVIAnomalies(ndviValues, 0.2);
    setAnomalies(detectedAnomalies);
    
  }, [selectedPoint, ndviData]);

  // Função para gerar PDF do relatório
  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      pdf.addImage(
        imgData, 
        'PNG', 
        0, 
        0, 
        imgWidth * ratio, 
        imgHeight * ratio
      );
      
      pdf.save(`ClimaTwin_Relatorio_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Classificar condição da vegetação com base no NDVI
  const getVegetationCondition = (ndviValue) => {
    if (ndviValue === null) return 'Desconhecido';
    if (ndviValue < 0) return 'Água ou nuvem';
    if (ndviValue < 0.2) return 'Solo exposto ou vegetação muito esparsa';
    if (ndviValue < 0.4) return 'Vegetação esparsa';
    if (ndviValue < 0.6) return 'Vegetação moderada';
    if (ndviValue < 0.8) return 'Vegetação densa';
    return 'Vegetação muito densa';
  };

  // Verificar possível desmatamento
  const checkDeforestation = (ndviValue) => {
    if (ndviValue === null) return 'Dados insuficientes';
    if (ndviValue < 0.3) return 'Possível área desmatada ou solo exposto';
    if (ndviValue < 0.5) return 'Vegetação reduzida, possível degradação';
    return 'Sem indicativos de desmatamento recente';
  };

  if (!selectedPoint || !stats) {
    return (
      <div className="report-placeholder">
        <p>Selecione um ponto no mapa para gerar relatório automático.</p>
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h3>Relatório Automático</h3>
        <button 
          onClick={generatePDF}
          disabled={isGeneratingPDF}
          className="download-button"
        >
          {isGeneratingPDF ? 'Gerando PDF...' : 'Baixar PDF'}
        </button>
      </div>
      
      <div className="report-content" ref={reportRef}>
        <div className="report-section">
          <h4>Informações do Ponto</h4>
          <p><strong>Coordenadas:</strong> {selectedPoint.lat.toFixed(6)}°, {selectedPoint.lng.toFixed(6)}°</p>
          <p><strong>Data:</strong> {selectedPoint.date ? new Date(selectedPoint.date).toLocaleDateString('pt-BR') : '06/05/2025'}</p>
          <p><strong>NDVI:</strong> {selectedPoint.value !== null ? selectedPoint.value.toFixed(4) : 'N/A'}</p>
        </div>
        
        <div className="report-section">
          <h4>Análise de Vegetação</h4>
          <p><strong>Condição:</strong> {getVegetationCondition(selectedPoint.value)}</p>
          <p><strong>Média NDVI na região:</strong> {stats.mean !== null ? stats.mean.toFixed(4) : 'N/A'}</p>
          <p><strong>Variação em relação à média:</strong> {
            selectedPoint.value !== null && stats.mean !== null 
              ? ((selectedPoint.value - stats.mean) / stats.mean * 100).toFixed(2) + '%' 
              : 'N/A'
          }</p>
        </div>
        
        <div className="report-section">
          <h4>Alertas e Insights</h4>
          <p><strong>Status de desmatamento:</strong> {checkDeforestation(selectedPoint.value)}</p>
          <p><strong>Anomalias detectadas:</strong> {
            anomalies.length > 0 
              ? `${anomalies.length} áreas com valores NDVI anômalos detectadas na região` 
              : 'Nenhuma anomalia significativa detectada'
          }</p>
          <p><strong>Recomendação:</strong> {
            selectedPoint.value !== null && selectedPoint.value < 0.3 
              ? 'Monitoramento prioritário recomendado para esta área' 
              : 'Manter monitoramento regular'
          }</p>
        </div>
        
        <div className="report-footer">
          <p><small>Relatório gerado automaticamente pelo ClimaTwin AI em {new Date().toLocaleDateString('pt-BR')}</small></p>
          <p><small>Nota: Este relatório utiliza dados de 06/05/2025. Dados históricos serão incluídos em versões futuras.</small></p>
        </div>
      </div>
    </div>
  );
}
