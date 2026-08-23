# 🎠 Gerador de Criativos para Instagram

> 🇧🇷 Aplicação web para criação de carrosséis de alta conversão para redes sociais, com preview em tempo real e exportação em imagem com fidelidade visual 100%.

![Next.js](https://img.shields.io/badge/Next.js%2015-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React%2019-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix%20UI-161618?logo=radixui&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?logo=puppeteer&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

---

## 🚀 Acessar DEMO

**[🔗 Acessar a demonstração](https://devox-ads-generator.vercel.app/)**

---

# 🇧🇷 Português

## 📌 Sobre o projeto

O **DeVox Carousel Generator** é uma aplicação web moderna e rápida para criação de **carrosséis de alta conversão** para Instagram e LinkedIn. Em vez de montar cada slide manualmente em ferramentas de design genéricas, o produto oferece uma estrutura de edição guiada, com preview em tempo real e exportação em imagem fiel ao que foi desenhado na tela — resolvendo o problema clássico de carrosséis exportados com fontes, filtros ou espaçamentos quebrados.

## 🎯 Proposta do produto

Criar um carrossel de alto impacto exige repetir um padrão narrativo (capa que prende atenção → conteúdo que entrega valor → CTA que gera engajamento), mas a maioria das ferramentas de design não guia esse processo nem garante que o resultado exportado seja idêntico ao editado.

O DeVox resolve isso com:

* Uma estrutura de slides já otimizada para conversão
* Edição e preview simultâneos, lado a lado
* Um motor de exportação próprio que renderiza o slide real (não uma captura de tela do navegador do usuário), garantindo fidelidade total de CSS

## ✨ Funcionalidades

### 🔴 Preview em tempo real

Painel de edição e painel de preview lado a lado — qualquer alteração no texto, imagem ou estilo é refletida instantaneamente no slide, sem necessidade de salvar ou recarregar.

### 🧱 Estrutura de slides otimizada para conversão

O gerador segue uma estrutura pensada para performance em redes sociais:

* **Capa** — foco total em impacto visual e títulos grandes para maximizar o clique
* **Conteúdo** — layouts adaptativos para parágrafos ou listas em bullet points
* **Encerramento / CTA** — slide dedicado à chamada para ação e geração de comentários

### ✍️ Destaque inteligente de texto

Sintaxe simples baseada em markdown para realçar palavras-chave dentro do texto (ex.: `O segredo do *sucesso*` renderiza "sucesso" em destaque), sem exigir nenhuma formatação manual.

### 🎯 Motor de renderização fiel

Um motor interno baseado em **Puppeteer** com **Chromium headless** renderiza cada slide em uma página isolada e captura a imagem final em alta resolução (1080x1350) — garantindo que estilos complexos, filtros e efeitos de background sejam exportados exatamente como aparecem na tela, algo que capturas de tela comuns não conseguem replicar.

### 🖼️ Compressão e performance de upload

Imagens de alta resolução enviadas pelo usuário são automaticamente redimensionadas (<1500px) e comprimidas no navegador antes de entrarem no estado da aplicação, mantendo a edição fluida mesmo com uploads pesados.

### 💾 Persistência de estado segura

As edições do usuário são injetadas ativamente no roteamento e no `localStorage`, prevenindo perda de progresso caso a aba seja fechada ou recarregada acidentalmente.

## 🏗️ Visão geral da arquitetura

```text
src/app/page.tsx                       → Interface principal: EditorPanel, PreviewPanel e NavigationPanel
src/app/api/export-image/route.ts      → Rota serverless que sobe uma instância isolada de navegador
                                          headless para capturar o slide em alta resolução
src/app/export-preview/[id]/page.tsx   → Página limpa dedicada à injeção de estado virtual,
                                          usada exclusivamente pelo back-end durante a extração de imagem
```

O ponto central da arquitetura é a separação entre a página que o usuário edita e a página usada apenas para renderização headless: isso garante que o que é exportado é sempre uma renderização real do DOM, e não uma captura da tela do usuário — eliminando inconsistências visuais entre dispositivos, zoom e resoluções de tela diferentes.

## 🧩 Tecnologias

| Tecnologia | Utilização |
|---|---|
| **Next.js 15 (App Router)** | Framework principal, incluindo rotas serverless |
| **React 19** | Construção da interface |
| **TypeScript** | Tipagem e padronização de contratos de dados |
| **Tailwind CSS** | Estilização e responsividade |
| **Radix UI + shadcn/ui** | Componentes acessíveis e reutilizáveis |
| **Lucide React** | Ícones |
| **Puppeteer Core + @sparticuz/chromium** | Automação headless para exportação de imagem fiel |

## 💻 Como rodar o projeto

### Pré-requisitos

* Node.js 18+
* NPM, Yarn ou pnpm

### Instalação

```bash
git clone https://github.com/BeThomazzi/gerador-de-criativos.git
cd gerador-de-criativos
npm install
npm run dev
```

Abra `http://localhost:3000` no navegador para ver o projeto em funcionamento.

## 📝 Licença

Desenvolvido por **DeVox**. Todos os direitos reservados.

---

# 🇺🇸 English

## 📌 About

**DeVox Carousel Generator** is a modern, fast web application for creating **high-conversion carousels** for Instagram and LinkedIn. Instead of manually building each slide in a generic design tool, the product provides a guided editing structure with real-time preview and pixel-faithful image export — solving the classic problem of carousels that lose fonts, filters or spacing once exported.

## 🎯 Product Concept

Creating a high-impact carousel means repeating a narrative pattern (an attention-grabbing cover → value-delivering content → an engagement-driving CTA), but most design tools neither guide that process nor guarantee the exported result matches what was actually designed.

DeVox solves this with:

* A slide structure already optimized for conversion
* Simultaneous side-by-side editing and preview
* A custom export engine that renders the real slide (not a screenshot of the user's browser), guaranteeing full CSS fidelity

## ✨ Features

### 🔴 Real-Time Preview

Editor panel and preview panel side by side — any change to text, image or style is reflected instantly on the slide, with no need to save or reload.

### 🧱 Conversion-Optimized Slide Structure

The generator follows a structure designed for social media performance:

* **Cover** — full focus on visual impact and large titles to maximize clicks
* **Content** — adaptive layouts for both paragraphs and bullet-point lists
* **Closing / CTA** — a slide dedicated to the call to action and driving comments

### ✍️ Smart Text Highlighting

A simple markdown-based syntax to highlight keywords within the text (e.g. `The secret to *success*` renders "success" as highlighted), with no manual formatting required.

### 🎯 Faithful Rendering Engine

An internal engine powered by **Puppeteer** and headless **Chromium** renders each slide on an isolated page and captures the final image at high resolution (1080x1350) — ensuring complex styles, filters and background effects are exported exactly as they appear on screen, something a regular screenshot can't replicate.

### 🖼️ Upload Compression and Performance

High-resolution images uploaded by the user are automatically resized (<1500px) and compressed in-browser before entering the application state, keeping editing smooth even with heavy uploads.

### 💾 Safe State Persistence

User edits are actively injected into routing and `localStorage`, preventing loss of progress if the tab is closed or accidentally reloaded.

## 🏗️ Architecture Overview

```text
src/app/page.tsx                       → Main interface: EditorPanel, PreviewPanel and NavigationPanel
src/app/api/export-image/route.ts      → Serverless route that spins up an isolated headless browser
                                          instance to capture the slide at high resolution
src/app/export-preview/[id]/page.tsx   → Clean page dedicated to virtual state injection,
                                          used exclusively by the backend during image extraction
```

The core of the architecture is the separation between the page the user edits and the page used purely for headless rendering: this guarantees the exported output is always a real DOM render, not a screenshot of the user's screen — eliminating visual inconsistencies across devices, zoom levels and screen resolutions.

## 🧩 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15 (App Router)** | Main framework, including serverless routes |
| **React 19** | Interface development |
| **TypeScript** | Type safety and consistent data contracts |
| **Tailwind CSS** | Styling and responsive layouts |
| **Radix UI + shadcn/ui** | Accessible, reusable components |
| **Lucide React** | Icons |
| **Puppeteer Core + @sparticuz/chromium** | Headless automation for pixel-faithful image export |

## 💻 Getting Started

### Prerequisites

* Node.js 18+
* NPM, Yarn or pnpm

### Installation

```bash
git clone https://github.com/BeThomazzi/gerador-de-criativos.git
cd gerador-de-criativos
npm install
npm run dev
```

Open `http://localhost:3000` in your browser to see the project running.

## 📝 License

Developed by **DeVox**. All rights reserved.
