# ClimaTwin AI - Lista de Tarefas

## Preparação e Esclarecimentos
- [x] Coletar perguntas de esclarecimento para o usuário
- [x] Receber confirmação do usuário sobre todas as perguntas
  - [x] Obter URLs dos dados (NDVI e Sentinel-2)
  - [x] Confirmar datas específicas para timeslider (única data 2025-05-06 com estrutura modular)
  - [x] Definir necessidade de autenticação (acesso público sem autenticação)
  - [x] Especificar indicadores para relatórios automáticos (média NDVI, anomalias, comparações, detecção de desmatamento)
  - [x] Obter informações sobre identidade visual (verde escuro #006400, cinza claro #F2F2F2, branco)
  - [x] Confirmar detalhes do repositório GitHub (helioguilhermediassilva/climatwin-ai)
  - [x] Verificar conta Cloudflare para deploy (usuário já possui conta)

## Estruturação do Projeto
- [x] Estruturar repositório com arquivos iniciais obrigatórios
  - [x] Criar package.json e instalar dependências
  - [x] Criar .gitignore para Node.js/React
  - [x] Configurar next.config.js com exportação estática
  - [x] Adicionar robots.txt para privacidade
  - [x] Criar wrangler.toml para Cloudflare Pages
  - [x] Estruturar diretórios básicos do projeto
- [x] Configurar Next.js com exportação estática
  - [x] Criar arquivos base (_app.js, index.js)
  - [x] Configurar estilos globais e módulos CSS
  - [x] Testar build com exportação estática
- [x] Integrar dados reais da Amazônia via URLs públicas
  - [x] Criar estrutura de constantes com URLs e configurações
  - [x] Implementar utilitários para processamento de dados geoespaciais
  - [x] Preparar funções para análise de dados NDVI

## Implementação de Funcionalidades
- [x] Implementar mapa interativo com camadas NDVI e RGB
  - [x] Criar componente de mapa com Leaflet
  - [x] Implementar alternância entre camadas NDVI e RGB
  - [x] Integrar dados geoespaciais ao mapa
- [x] Adicionar timeslider e seleção de pontos no mapa
  - [x] Implementar seletor de datas (preparado para expansão)
  - [x] Adicionar funcionalidade de seleção de pontos
  - [x] Exibir informações do ponto selecionado
- [x] Gerar gráficos de séries temporais por ponto
  - [x] Implementar componente de gráfico com Chart.js
  - [x] Integrar dados do ponto selecionado
  - [x] Preparar estrutura para múltiplas datas (simulação para demonstração)
- [x] Criar relatórios automáticos com insights por ponto
  - [x] Implementar componente de relatório com análise NDVI
  - [x] Adicionar detecção de anomalias e alertas
  - [x] Incluir funcionalidade de exportação para PDF
- [x] Implementar interface responsiva e institucional
  - [x] Redesenhar página principal com layout responsivo
  - [x] Integrar componentes com design institucional
  - [x] Aplicar identidade visual definida (cores, tipografia)
- [x] Configurar rodapé com fontes e referências
  - [x] Criar componente de rodapé dedicado
  - [x] Incluir links para provedores de dados
  - [x] Adicionar informações institucionais
- [x] Adicionar robots.txt para privacidade
  - [x] Configurar bloqueio de indexação para motores de busca
  - [x] Validar funcionamento do arquivo robots.txt

## Documentação e Deploy
- [x] Preparar documentação em README.md com instruções e descrição técnica
  - [x] Incluir visão geral do projeto
  - [x] Documentar estrutura e tecnologias utilizadas
  - [x] Adicionar instruções de instalação e deploy
  - [x] Detalhar funcionalidades e expansão futura
- [ ] Integrar repositório ao GitHub
- [ ] Configurar deploy via Cloudflare Pages
- [ ] Validar site funcional publicado com dados reais
- [ ] Enviar site publicado e repositório para o usuário
- [ ] Fornecer instruções para conectar domínio próprio (climatwin.ai)
- [ ] Coletar feedback final e ajustar se necessário
