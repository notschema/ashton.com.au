/**
 * Content Collections Configuration - ashton.com.au
 * 
 * Type-safe content management for blog posts and authors.
 * Supports both .md and .mdx files for React component usage.
 */

import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

/**
 * Blog posts collection
 * Supports rich content with images, tags, and multi-author support
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    
    // Content organization
    tags: z.array(z.string()).default([]),
    authors: z.array(z.string()).default(['ashton']),
    order: z.number().optional(),
    
    // Images (optimized by Astro)
    cover: image().optional(),
    thumbnail: image().optional(),
  }),
})

/**
 * Authors collection
 * For multi-author blog support
 */
const authors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    bio: z.string().optional(),
    pronouns: z.string().optional(),
    
    // Avatar (URL or local path)
    avatar: z.string().url().or(z.string().startsWith('/')).optional(),
    
    // Social links
    website: z.string().url().optional(),
    github: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    discord: z.string().optional(),
    mail: z.string().email().optional(),
  }),
})

export const collections = { blog, authors }

