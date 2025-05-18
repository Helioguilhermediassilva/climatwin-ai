import React from 'react';
import styles from '../styles/Footer.module.css';
import { DATA_SOURCES } from '../lib/constants';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.dataSourcesSection}>
          <h3 className={styles.footerTitle}>Dados fornecidos por:</h3>
          <div className={styles.dataSourcesGrid}>
            {DATA_SOURCES.map((source, index) => (
              <a 
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.dataSourceLink}
              >
                <div className={styles.dataSourceLogo}>
                  {/* Placeholder para logos - seriam substituídos por imagens reais */}
                  <div className={styles.logoPlaceholder}>{source.name}</div>
                </div>
                <span className={styles.dataSourceName}>{source.name}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div className={styles.footerInfo}>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Sobre o Projeto</a>
            <a href="#" className={styles.footerLink}>Metodologia</a>
            <a href="#" className={styles.footerLink}>Contato</a>
          </div>
          
          <p className={styles.disclaimer}>
            O ClimaTwin AI é uma plataforma de visualização de dados climáticos e satelitais 
            da Amazônia Legal. Os dados apresentados são para fins de pesquisa e monitoramento.
          </p>
          
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} ClimaTwin AI. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
