import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';
import { DATA_SOURCES } from '../lib/constants';
import Footer from '../components/Footer';

// Importação dinâmica dos componentes para evitar problemas de SSR
const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false });
const TimeSeriesChart = dynamic(() => import('../components/TimeSeriesChart'), { ssr: false });
const ReportGenerator = dynamic(() => import('../components/ReportGenerator'), { ssr: false });

export default function Home() {
  const [selectedPoint, setSelectedPoint] = React.useState(null);
  const [ndviData, setNdviData] = React.useState(null);

  // Manipulador para quando um ponto é selecionado no mapa
  const handlePointSelect = (point) => {
    setSelectedPoint(point);
  };

  // Manipulador para quando os dados NDVI são carregados
  const handleNdviDataLoaded = (data) => {
    setNdviData(data);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>ClimaTwin AI</title>
        <meta name="description" content="Visualização interativa de dados climáticos e satelitais da Amazônia" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          {/* Placeholder para o logo */}
          <div className={styles.logo}>ClimaTwin AI</div>
        </div>
        <h1 className={styles.title}>ClimaTwin AI</h1>
        <p className={styles.description}>
          Visualização interativa de dados climáticos e satelitais da Amazônia
        </p>
      </header>

      <main className={styles.main}>
        <section className={styles.mapSection}>
          <h2 className={styles.sectionTitle}>Mapa Interativo</h2>
          <div className={styles.mapContainer}>
            <MapComponent 
              onPointSelect={handlePointSelect}
              onNdviDataLoaded={handleNdviDataLoaded}
            />
          </div>
        </section>

        <div className={styles.dataSection}>
          <section className={styles.chartSection}>
            <h2 className={styles.sectionTitle}>Série Temporal</h2>
            <TimeSeriesChart selectedPoint={selectedPoint} />
          </section>

          <section className={styles.reportSection}>
            <h2 className={styles.sectionTitle}>Relatório Automático</h2>
            <ReportGenerator 
              selectedPoint={selectedPoint}
              ndviData={ndviData}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
