# ⚡ Ashton's Portfolio

A high-performance, bento-grid style personal portfolio built with **Astro**, **React**, and **Tailwind CSS**.

![Portfolio Preview](./public/og-image.png)

## 🛠️ Tech Stack

- **Framework:** [Astro v5](https://astro.build) (Hybrid Rendering)
- **UI Library:** [React](https://react.dev)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) + [Lucide Icons](https://lucide.dev)
- **Animations:** CSS transitions & custom keyframes
- **Deployment:** Vercel / Netlify

## ✨ Features

### 🍱 Dynamic Bento Grid

A responsive, asymmetrical grid layout featuring interactive cards:

- **📺 RetroTV**:
  - Dynamic nostalgic cartoon GIFs (SpongeBob, Dexter, Courage, etc.)
  - Random topic selection with day-long caching to respect API limits
  - CRT scanline aesthetics & channel controls
- **💻 GitHub Profile**:
  - Live "Commits in 2026" counter using GitHub Events API
  - Auto-scrolling recent commits overlay on hover
  - Repository stats & language breakdown
- **🎵 Spotify Presence**:
  - Real-time "Now Playing" display
  - Album art glow effects & audio visualizer bars
- **👾 Discord Status**:
  - Live online/idle/dnd status indicators
  - Activity rich presence (games, VS Code, etc.)
- **📍 Local Time**:
  - Real-time Sydney clock with day/night cycle indicators

### 🎨 Design System

- **Theme**: Dark mode first, monochrome "hacker" aesthetic
- **Typography**: JetBrains Mono for code/technical feel
- **Effects**: Glassmorphism, subtle gradients, and smooth hover states

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/notschema/ashton.com.au.git
   cd ashton.com.au
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:

   ```env
   PUBLIC_GIPHY_API_KEY=your_giphy_api_key_here
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
/
├── public/             # Static assets
├── src/
│   ├── components/     # React & Astro components
│   │   └── bento/      # Bento grid specific cards
│   ├── layouts/        # Page layouts (Base, etc.)
│   ├── pages/          # File-based routing
│   └── styles/         # Global CSS & Tailwind config
└── astro.config.mjs    # Astro configuration
```

## 📄 License

MIT © [Ashton Turner](https://github.com/notschema)
