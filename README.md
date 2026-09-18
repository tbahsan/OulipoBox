<div align="center">

# 🔤 OulipoBox

### Constrained Writing Playground · নিয়ন্ত্রিত সৃজনশীল লেখার খেলাঘর
*A privacy-first, client-side editor for Lipograms, Univocalics, Acrostics, and formal literary constraints.*

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-tbahsan.github.io%2FOulipoBox-0284c7?style=for-the-badge)](https://tbahsan.github.io/OulipoBox/)
[![Author](https://img.shields.io/badge/Author-Tasneem_Bin_Ahsan-8b5cf6?style=for-the-badge&logo=github)](https://github.com/tbahsan)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

[![Vitest](https://img.shields.io/badge/Vitest-30%20passed-0284c7?logo=vitest&logoColor=white)](docs/EVALUATION.md)
[![Playwright](https://img.shields.io/badge/Playwright-5%20passed-0284c7?logo=playwright&logoColor=white)](docs/EVALUATION.md)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline%20Ready-0284c7?logo=pwa&logoColor=white)](docs/EVALUATION.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript&logoColor=white)](tsconfig.json)
[![Zero Tracking](https://img.shields.io/badge/Privacy-Zero%20Tracking-15803d)](#-privacy--security)

<br/>

[**Live Demo**](https://tbahsan.github.io/OulipoBox/) •
[**Features**](#-features) •
[**Constraints**](#-supported-constraints) •
[**বাংলা বিবরণ**](#-বাংলা-বিবরণ) •
[**Architecture**](#-architecture) •
[**Development**](#-local-development) •
[**Author**](#-author--license)

</div>

---

## 💡 What is OulipoBox?

**Oulipo** (*Ouvroir de littérature potentielle* — Workshop of Potential Literature) was founded in 1960 by French writers and mathematicians like Raymond Queneau and François Le Lionnais. They discovered that constraining the rules of language (such as writing an entire novel without the letter 'E', as Georges Perec did in *A Void*) paradoxically unleashes profound creative imagination.

**OulipoBox** brings these classic and modern literary constraints into a clean, modern, zero-distraction browser workspace.

Unlike traditional validators that block your keyboard or delete text, OulipoBox uses **non-blocking real-time highlights**: you write freely, while an intelligent visual overlay identifies rule violations, syllable counts, and letter frequencies without ever disrupting your flow.

---

## ✨ Features

- 🎯 **Non-Blocking Visual Overlay:** Type or paste anything smoothly; rule-breaking characters and words are highlighted with line coordinates in real time.
- 🔠 **6 Rich Formal Constraints:** Lipograms, Univocalics, Line Acrostics, Exact Word Count Targets, Tautograms (Alliteration), and Monosyllabic verse.
- ⚡ **100% Client-Side & Offline PWA:** Precached with Service Workers. Runs entirely in your browser without an active internet connection.
- 🔒 **Zero Surveillance:** No server backends, no tracking analytics, no user accounts. Your text never leaves your device.
- 📊 **Detailed Diagnostics:** Live letter frequency bars, vowel distribution, and violation logs.
- 💾 **Local Draft Recovery:** Optional, opt-in local draft storage (LocalStorage) with one-click clear.
- 🌓 **Dark & Light Mode:** Accessible, high-contrast visual design built for writer focus.
- 📋 **Export Ready:** One-click clean text copy or UTF-8 `.txt` file download.

---

## 📐 Supported Constraints

| Constraint / নিয়ম | Rules / বর্ণনা | Classic Inspiration / উদাহরণ |
|---|---|---|
| **Lipogram (নিষিদ্ধ বর্ণ)** | Omits one or more specific letters (e.g. No 'E'). Case-insensitive, NFD diacritic safe. | Georges Perec, *A Void* (1969) |
| **Univocalic (একক স্বরবর্ণ)** | Uses only ONE single vowel (A, E, I, O, or U). **Policy:** 'Y' is treated as a consonant by default. | Christian Bök, *Eunoia* (2001) |
| **Acrostic (পঙ্‌ক্তি আদ্যক্ষর)** | Each non-empty line begins with the successive letters of a target word or phrase. | Classical poetic form |
| **Word Count (শব্দ সংখ্যা লক্ষ্য)** | Strict word targets: Drabble (100 words), Mini-Saga (50 words), or custom ranges. | Micro-fiction traditions |
| **Tautogram (আদ্যবর্ণ সমতা)** | Every single word begins with the same chosen initial letter. | Classical rhetorical constraint |
| **Monosyllabic (একাক্ষর শব্দ)** | Every word in the text consists of exactly one syllable. | Phonotactic verse |

---

## 🇧🇩 বাংলা বিবরণ

**OulipoBox** হলো সাহিত্যের নানা নিয়ম বা শর্তের অধীনে সৃজনশীল লেখার একটি আধুনিক ডিজিটাল ওয়ার্কস্পেস।

ফরাসি সাহিত্যিক আন্দোলন *Oulipo*-র ধারণা থেকে অনুপ্রাণিত হয়ে এটি তৈরি। এতে আপনি বিভিন্ন মজার ও চ্যালেঞ্জিং সাহিত্যিক শর্তের মধ্যে লিখতে পারবেন:
- **লিপোগ্রাম (Lipogram):** নির্দিষ্ট কোনো বর্ণ (যেমন 'E') পুরোপুরি বাদ দিয়ে লেখা।
- **একক স্বরবর্ণ (Univocalic):** পুরো লেখায় যেকোনো একটিমাত্র ভাওয়েল ব্যবহার করা (যেমন শুধু 'E' বা শুধু 'A')।
- **আদ্যক্ষর পঙ্‌ক্তি (Acrostic):** কবিতার প্রতিটি লাইনের শুরুর বর্ণ দিয়ে একটি নির্দিষ্ট শব্দ তৈরি করা।
- **নির্দিষ্ট শব্দ সংখ্যা:** ঠিক ৫০ শব্দ (Mini-Saga) বা ঠিক ১০০ শব্দের (Drabble) গল্প লেখা।
- **একাক্ষর শব্দ (Monosyllabic):** প্রতিটি শব্দ এক সিলেবলের হতে হবে।

আপনার লেখাকে কোনোভাবে না আটকে বা মুছে না ফেলে, রিয়েল-টাইমে ভিজ্যুয়াল হাইলাইটের মাধ্যমে নিয়ম ভঙ্গের স্থানগুলো দেখিয়ে দেওয়া হয়।

---

## 🛠️ Tech Stack & Architecture

```text
src/
├── engine/              # Pure TypeScript validation engine (Zero DOM dependencies)
│   ├── types.ts         # Types, interfaces, and constraint schemas
│   ├── text-utils.ts    # Word tokenization, line extraction, stats, diacritic stripping
│   ├── lipogram.ts      # Forbidden letters validator
│   ├── univocalic.ts    # Single-vowel validator (Y as consonant policy)
│   ├── acrostic.ts      # Line-initial letter sequence validator
│   ├── wordcount.ts     # Exact, min, max, and range word count engine
│   ├── alliteration.ts  # Tautogram validator
│   ├── monosyllabic.ts  # Algorithmic syllable counter & irregular dictionary
│   └── index.ts         # Unified validation API
├── data/
│   └── presets.json     # Curated literary challenges and sample texts
├── storage/
│   └── draft-store.ts   # Opt-in client-side LocalStorage manager
└── main.ts              # Synchronized backdrop highlighter & DOM controller
```

- **Runtime:** Native ES2022 + Vanilla DOM (Fast, lightweight, no framework bloat)
- **Bundler:** Vite
- **Testing:** Vitest (30 Unit & property tests) + Playwright (5 Cross-browser E2E tests)
- **Offline:** Workbox PWA Service Worker
- **Deployment:** GitHub Pages via GitHub Actions

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/tbahsan/OulipoBox.git
cd OulipoBox

# Install dependencies
npm install

# Start development server
npm run dev

# Run Vitest unit tests
npm test

# Run Playwright E2E browser tests
npx playwright test

# Production build
npm run build
```

---

## 👤 Author & License

### Created By
**Tasneem Bin Ahsan**  
GitHub: [@tbahsan](https://github.com/tbahsan) • Repository: [tbahsan/OulipoBox](https://github.com/tbahsan/OulipoBox)

### License
Released under the **[MIT License](LICENSE)** © 2026 Tasneem Bin Ahsan.
