/**
 * Astro Configuration - ashton.com.au
 * 
 * Full-featured setup with MDX, sitemap, code highlighting,
 * math rendering, and optimized markdown processing.
 */

import { defineConfig } from 'astro/config'

// Integrations
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import expressiveCode from 'astro-expressive-code'
import vercel from '@astrojs/vercel'
import pagefind from 'astro-pagefind'

// Markdown/MDX plugins
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import rehypeDocument from 'rehype-document'
import remarkEmoji from 'remark-emoji'
import remarkMath from 'remark-math'

// Styling
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Static output with selective SSR via prerender: false
  output: 'static',
  adapter: vercel(),

  // Production URL
  site: 'https://ashton.com.au',

  // Integrations (order matters - expressiveCode before mdx)
  integrations: [
    expressiveCode({
      themes: ['vitesse-dark'],
      styleOverrides: {
        borderRadius: '0.5rem',
      },
    }),
    mdx(),
    react(),
    sitemap(),
    icon(),
    pagefind(),
  ],

  // Vite config
  vite: {
    plugins: [tailwindcss()],
  },

  // Dev server
  server: {
    port: 4321,
    host: true,
  },

  // Disable dev toolbar (cleaner experience)
  devToolbar: {
    enabled: false,
  },

  // Markdown processing
  markdown: {
    // Use expressive-code for syntax highlighting
    syntaxHighlight: false,

    // Rehype plugins (HTML processing)
    rehypePlugins: [
      // Add KaTeX CSS for math rendering
      [rehypeDocument, {
        css: 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css',
      }],

      // External links open in new tab with security attrs
      [rehypeExternalLinks, {
        target: '_blank',
        rel: ['nofollow', 'noreferrer', 'noopener'],
      }],

      // Generate heading IDs for anchor links
      rehypeHeadingIds,

      // Render math equations
      rehypeKatex,
    ],

    // Remark plugins (Markdown processing)
    remarkPlugins: [
      remarkMath,  // Parse math syntax
      remarkEmoji, // Convert :emoji: to unicode
    ],
  },
})