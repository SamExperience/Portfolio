# Samuele Deriu - Personal Portfolio

A Single Page Application (SPA) developed as a professional portfolio. Built with Angular 20 standalone components, it uses route-level code splitting and pre-generated responsive WebP assets to document technical experience across desktop, tablet and mobile.

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

> **[Live Demo](https://samexperience.github.io/Portfolio/)**

<p align="center">
  <img src=".github/assets/hero-gif.gif" alt="Portfolio Hero Animation" width="800"/>
</p>

## 📸 Overview

<p align="center">
  <img src=".github/assets/projects-section.png" alt="Projects Section" width="800"/>
</p>
<p align="center">
  <img src=".github/assets/about-contact-section.png" alt="About and Contact Sections" width="800"/>
</p>
<p align="center">
  <img src=".github/assets/project-detail-gif.gif" alt="Project Details UI" width="800"/>
</p>
## 🚀 Key Features

- **Performance:** Route-level code splitting via `loadComponent()` and critical CSS inlining (`optimization.styles.inlineCritical`) keep the initial JavaScript and CSS payload small.
- **Multi-language Support:** English, Italian and French content served as localized JSON (`assets/i18n/<lang>.json`, `assets/data/Projects_<lang>.json`). A language change is pushed through a `switchMap` that requests the matching file; `shareReplay({ bufferSize: 1, refCount: true })` shares that single request among all concurrent subscribers instead of issuing one per component.
- **Adaptive Theming:** Seamless Dark/Light mode toggle that respects OS-level preferences (`matchMedia`).
- **Automated Media Optimization:** Custom asynchronous Node.js pre-build engine (`gen-responsive-images.js`) using concurrency limits to generate responsive WebP assets in bulk.
- **SEO & Accessibility:** Strict semantic HTML structure to overcome classic SPA indexing limitations, complete with ARIA labels.

## 🏗️ Architecture

Built with **Angular 20** utilizing **Standalone Components** for high decoupling. The project leverages an end-to-end approach, demonstrating how design patterns (caching strategy, code splitting) transform a standard UI into an enterprise-grade, robust, and maintainable software entity.

### Directory Structure Highlights

```txt
src/app/
├── components/          # Standalone UI Elements (ThemeToggle, LanguageSelector)
├── services/            # RxJS Business Logic (DataService, ThemeService)
├── models/              # TypeScript interfaces defining the JSON payloads
└── styles/              # Global SCSS tokens and resets
```

## ⚡ Performance Verification

<p align="center">
  <img src=".github/assets/lighthouse-scores.png" alt="Lighthouse scores" width="800"/>
</p>

Lighthouse (Chrome DevTools): **100** performance, **100** best practices, **91** accessibility, **83** SEO. Measured on the production build served locally by `server.js` at `http://localhost:8080/`; screenshot added in February 2026.

## 💻 Development

### Prerequisites

- Node.js (v18+)
- npm

### Installation & Serving

```bash
# Install dependencies
npm install

# Start the development server
npm run start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Optimizing Images

To generate the responsive WebP images locally:

```bash
node dev-scripts/gen-responsive-images.js
```

### Build & Production Testing

```bash
# Build the project
npm run build

# Start the local Express static server (gzip + cache headers) to test the production build
node server.js
```

Navigate to `http://localhost:8080/` to test the production bundle with GZIP and cache headers.

## 📝 License

This project is for personal portfolio demonstration purposes. All rights reserved by Samuele Deriu.
