# Can You LLM ?

**Can You LLM ?** is a high-end, interactive web application designed to dynamically map local consumer and enterprise hardware constraints against the mathematical requirements of open-weights Large Language Models. 

Rather than relying on confusing semiconductor branding, this interface abstracts hardware into pure computational statistics (VRAM, RAM, Memory Bandwidth, and Storage). Users can seamlessly adjust these parameters via sleek, minimalist faders to see exactly which models their local machines are capable of running.

## Features
- **Dynamic Constraint Matrix:** Drag faders to instantly filter capable models using logarithmic scaling.
- **Hardware Physics Locking:** Selecting a model mathematically calculates its baseline footprint (using the $M = P \times (Q/8) \times 1.2$ algorithm) and physically locks the faders to prevent impossible hardware configurations.
- **High-End Glassmorphic Design:** Built with custom, modern 2026 CSS techniques featuring deep mesh gradients, frosted glass (`backdrop-filter`), and a blood-red/metallic gold accent palette.
- **Anime.js Powered Interactions:** All UI staggers, card hover effects, and the custom physics-based trailing cursor are powered by the high-performance Anime.js engine.
- **Data Synchronization Pipeline:** Includes an automated mockup script designed to pull the latest open-weights parameters directly from benchmark APIs.

## Tech Stack
- **React** (Vite)
- **Zustand** (High-Performance State Management)
- **Anime.js** (Physics & UI Animations)
- **TypeScript**

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
