# 🍱 Ashton's Portfolio

A personal identity hub built on a reactive **Bento Grid** architecture. Each block is a self-contained, interactive gadget designed to communicate status, interests, and activity in real-time.

![Bento Grid Preview](./public/og-image.png)

## 🏗️ The Grid System

Built with **Astro** for performance and **React** for interactive islands. The layout uses a responsive, asymmetrical grid that adapts to any viewport, preserving the "bento box" aesthetic.

### 🧱 Bento Blocks

Each component allows specific interaction:

| Block              | Features                                                 | Stack                  |
| :----------------- | :------------------------------------------------------- | :--------------------- |
| **📺 RetroTV**     | Nostalgic cartoon rotation, CRT effects, channel surfing | `Giphy API` • `Canvas` |
| **💻 GitHub**      | Live 2026 commits counter, auto-scroll history           | `GitHub Events API`    |
| **🎵 Spotify**     | Now Playing visualizer, album art glow                   | `Spotify Web API`      |
| **👾 Discord**     | Real-time status, activity badges, rich presence         | `Lanyard API`          |
| **🦐 Shrimp Tank** | Virtual pet simulation with physics                      | `React Spring`         |
| **📍 Time & Loc**  | Sydney timezone synchronized with day/night cycle        | `Intl.DateTimeFormat`  |

## 🛠️ Stack

- **Framework**: [Astro v5](https://astro.build)
- **Engine**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org)

## 🚀 Deployment

1. **Clone**

   ```bash
   git clone https://github.com/notschema/ashton.com.au.git
   ```

2. **Keys**
   Create `.env`:

   ```env
   PUBLIC_GIPHY_API_KEY=your_key
   ```

3. **Launch**
   ```bash
   npm install && npm run dev
   ```

---

<div align="center">
  <p>Designed & Engineered by <a href="https://github.com/notschema">Ashton Turner</a></p>
  <p><i>System Online • All Systems Normal</i></p>
</div>
