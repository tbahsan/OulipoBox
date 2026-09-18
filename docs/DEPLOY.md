# OulipoBox — Deployment Guide

## 1. Repository Setup
- **Owner:** `tbahsan`
- **Repo Name:** `OulipoBox`
- **Live URL:** `https://tbahsan.github.io/OulipoBox/`

## 2. GitHub Pages Activation
1. Navigate to repository **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` branch; the `.github/workflows/pages.yml` workflow will automatically test, build, and deploy.

## 3. GitHub Codespaces Workflow
To update directly within GitHub Codespaces:
```bash
python3 -m http.server 5174
# Or run dev:
npm run dev
```
