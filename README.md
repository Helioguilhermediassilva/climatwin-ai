# ClimaTwin AI

Sistema de visualização interativa de dados climáticos e satelitais da Amazônia Legal, com geração de relatórios automáticos e insights por ponto geográfico.

## 📋 Visão Geral

O ClimaTwin AI é uma plataforma web que permite visualizar e analisar dados de NDVI (Índice de Vegetação por Diferença Normalizada) e imagens satelitais da Amazônia Legal. O sistema oferece:

- Mapa interativo com camadas alternáveis (NDVI e RGB)
- Seleção de pontos geográficos para análise detalhada
- Gráficos de séries temporais por ponto
- Relatórios automáticos com insights e indicadores
- Exportação de relatórios em PDF

A plataforma foi desenvolvida com Next.js e exportação estática, permitindo deploy via Cloudflare Pages e fácil expansão para incluir novas fontes de dados no futuro.

## 🛰️ Dados Integrados

O sistema utiliza dados reais da Amazônia Legal:

- **NDVI (Sentinel-2)**: Índice de vegetação que indica a saúde e densidade da cobertura vegetal
- **Imagens RGB (Sentinel-2)**: Imagens satelitais em cores naturais

Área de interesse (Bounding Box): [-74.0, -10.0, -49.0, 3.0]

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js (React)
- **Mapa**: Leaflet, React-Leaflet
- **Processamento Geoespacial**: GeoTIFF, Turf.js
- **Visualização de Dados**: Chart.js
- **Exportação de Relatórios**: jsPDF, html2canvas
- **Deploy**: Cloudflare Pages

## 🔧 Instalação e Execução Local

### Pré-requisitos

- Node.js 14.x ou superior
- npm ou yarn

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/helioguilhermediassilva/climatwin-ai.git
cd climatwin-ai
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse o sistema em `http://localhost:3000`

### Build para Produção

Para gerar a versão estática para produção:

```bash
npm run build
# ou
yarn build
```

Os arquivos estáticos serão gerados na pasta `out`.

## 📁 Estrutura do Projeto

```
climatwin-ai/
├── components/         # Componentes React reutilizáveis
│   ├── MapComponent.js # Mapa interativo com camadas
│   ├── MapInteraction.js # Interação com o mapa (seleção de pontos)
│   ├── TimeSeriesChart.js # Gráficos de séries temporais
│   ├── ReportGenerator.js # Geração de relatórios automáticos
│   └── Footer.js      # Rodapé com fontes e referências
├── lib/               # Utilitários e constantes
│   ├── constants.js   # Configurações e constantes do sistema
│   └── geospatial.js  # Funções para processamento de dados geoespaciais
├── pages/             # Páginas do Next.js
│   ├── _app.js        # Configuração global da aplicação
│   └── index.js       # Página principal
├── public/            # Arquivos estáticos
├── styles/            # Estilos CSS
├── next.config.js     # Configuração do Next.js
├── package.json       # Dependências e scripts
├── wrangler.toml      # Configuração para Cloudflare Pages
└── robots.txt         # Configuração de privacidade
```

## 🌐 Deploy

### Deploy via Cloudflare Pages

1. Faça fork ou clone do repositório para sua conta GitHub
2. Acesse o dashboard do Cloudflare Pages
3. Clique em "Create a project"
4. Conecte sua conta GitHub e selecione o repositório
5. Configure as seguintes opções:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `/`
6. Clique em "Save and Deploy"

### Conectando Domínio Próprio

Para conectar o domínio `climatwin.ai` ao site:

1. No dashboard do Cloudflare Pages, acesse o projeto
2. Vá para a aba "Custom domains"
3. Clique em "Set up a custom domain"
4. Digite o domínio desejado (ex: climatwin.ai)
5. Siga as instruções para configurar os registros DNS

## 🔄 Expansão Futura

O sistema foi projetado para fácil expansão, permitindo:

- Adicionar novas datas para análise temporal
- Integrar dados CHIRPS (precipitação)
- Incluir dados LST/MODIS (temperatura de superfície)
- Implementar comparação entre diferentes períodos
- Adicionar detecção avançada de desmatamento

Para adicionar novas fontes de dados, modifique o arquivo `lib/constants.js` e expanda os componentes correspondentes.

## 📊 Funcionalidades Detalhadas

### Mapa Interativo

- Alternância entre camadas NDVI e RGB
- Zoom e pan para navegação
- Seleção de pontos para análise detalhada
- Visualização de coordenadas e valores NDVI

### Gráficos de Séries Temporais

- Visualização da evolução do NDVI ao longo do tempo
- Estrutura preparada para múltiplas datas
- Identificação de tendências e variações

### Relatórios Automáticos

- Análise de vegetação com base no NDVI
- Detecção de anomalias e possíveis áreas de desmatamento
- Estatísticas comparativas com a região
- Exportação em formato PDF

## 📄 Licença

Este projeto está sob a licença ISC.

## 🙏 Agradecimentos

- NASA
- USGS
- CHIRPS
- Copernicus (Programa Sentinel)

---

Desenvolvido por ClimaTwin AI Team
