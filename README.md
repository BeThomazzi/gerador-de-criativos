# DeVox Carousel Generator

Uma aplicação web moderna, rápida e interativa para a criação de carrosséis de alta conversão voltados para redes sociais (Instagram, LinkedIn). Desenvolvida com **Next.js**, **React** e **Tailwind CSS**.

## 🚀 Funcionalidades Principais

- **Visualização em Tempo Real (Live Preview)**: Veja as atualizações instantaneamente no painel lateral enquanto edita seus slides.
- **Estruturas de Slides Prontas**: O gerador segue uma estrutura otimizada contendo:
  - **Capa**: Foco total em impacto visual, títulos grandes e atração de clique.
  - **Conteúdo**: Layouts adaptativos suportando tanto formatos de parágrafo quanto de *bullet points* para listas.
  - **Encerramento / CTA**: Slide otimizado para chamada para ação e comentários.
- **Textos com Destaque Inteligente**: Realce partes importantes dos seus textos utilizando uma sintaxe simples baseada em markdown (ex: `O segredo do *sucesso*` renderiza a palavra "sucesso" em destaque).
- **Motor de Renderização Fiel**: Utiliza um motor inteligente de web-scraping interno com **Puppeteer** e **Chromium** headless, garantindo o download do seu carrossel com 100% de perfeição de CSS, estilos complexos e filtros de background.
- **Compressão e Performance**: Uploads locais de alta resolução são automaticamente redimensionados (<1500px) e comprimidos no navegador antes de irem para o estado da aplicação.
- **State Management Seguro**: Suas edições são injetadas ativamente no roteamento e no `localStorage`, prevenindo a perda de dados ao fechar a aba.

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS**
- Componentes acessíveis baseados em **Radix UI** (+ shadcn/ui)
- Ícones via **Lucide React**
- Automação Headless via **Puppeteer Core** & **sparticuz/chromium**

## 💻 Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão 18+ recomendada)
- NPM, Yarn ou pnpm installado.

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/carousel-generator.git
   ```

2. Acesse o diretório do projeto:
   ```bash
   cd carousel-generator
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Abra `http://localhost:3000` no seu navegador para ver o projeto em funcionamento.

## 📂 Visão Geral da Arquitetura

- `src/app/page.tsx`: Interface principal contendo o painel de edição (EditorPanel), preview ao vivo (PreviewPanel) e a navegação (NavigationPanel).
- `src/app/api/export-image/route.ts`: Rota serveless backend que manipula instâncias isoladas do navegador web para tirar capturas de tela perfeitas do slide em alta resolução (1080x1350).
- `src/app/export-preview/[id]/page.tsx`: Página limpa preparada exclusivamente para injeção de estado virtual utilizado durante a extração de imagens pelo back-end.

## 📝 Licença
Desenvolvido por DeVox. Todos os direitos reservados.
