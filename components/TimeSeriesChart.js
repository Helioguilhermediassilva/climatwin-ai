import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AVAILABLE_DATES, THEME_COLORS } from '../lib/constants';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Componente para gráficos de séries temporais
export default function TimeSeriesChart({ selectedPoint }) {
  // Configurar opções do gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Série Temporal NDVI',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `NDVI: ${context.parsed.y.toFixed(4)}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: -1,
        max: 1,
        title: {
          display: true,
          text: 'Valor NDVI'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Data'
        }
      }
    }
  };

  // Preparar dados para o gráfico
  // Atualmente temos apenas uma data, mas a estrutura está preparada para múltiplas datas
  const labels = AVAILABLE_DATES.map(date => date.label);
  
  // Simular dados históricos para demonstração (quando houver apenas uma data)
  let ndviValues = [];
  
  if (selectedPoint && selectedPoint.value !== null) {
    // Se tivermos apenas uma data, simular dados históricos para demonstração
    if (AVAILABLE_DATES.length === 1) {
      // Gerar valores simulados próximos ao valor atual para demonstração
      const baseValue = selectedPoint.value;
      ndviValues = [
        baseValue - 0.05,
        baseValue - 0.02,
        baseValue,
      ];
      
      // Adicionar datas simuladas para demonstração
      labels.unshift('01/04/2025', '15/04/2025');
    } else {
      // Quando tivermos múltiplas datas, usar valores reais
      ndviValues = AVAILABLE_DATES.map(date => {
        // Aqui precisaríamos buscar o valor NDVI para cada data no ponto selecionado
        // Por enquanto, retornamos apenas o valor atual para a data selecionada
        return date.id === selectedPoint.date ? selectedPoint.value : null;
      });
    }
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'NDVI',
        data: ndviValues,
        borderColor: THEME_COLORS.primaryColor,
        backgroundColor: 'rgba(0, 100, 0, 0.5)',
        tension: 0.3,
      },
    ],
  };

  if (!selectedPoint) {
    return (
      <div className="chart-placeholder">
        <p>Selecione um ponto no mapa para visualizar a série temporal.</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Série Temporal - Ponto ({selectedPoint.lat.toFixed(4)}, {selectedPoint.lng.toFixed(4)})</h3>
      <Line options={options} data={data} />
      <div className="chart-note">
        <p><small>Nota: Dados históricos são simulados para demonstração. Apenas a data atual (06/05/2025) contém dados reais.</small></p>
      </div>
    </div>
  );
}
