import { defineCollection, z } from 'astro:content';

/**
 * Content Collections Configuration
 * Defines schemas for blog posts, projects, and authors
 */

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        draft: z.boolean().default(false),
        tags: z.array(z.string()).default([]),
        image: z.string().optional(),
        author: z.string().default('ashton'),
    }),
});

const projects = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        tags: z.array(z.string()).default([]),
        image: z.string().optional(),
        url: z.string().optional(),
        github: z.string().optional(),
        featured: z.boolean().default(false),
    }),
});

const authors = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        avatar: z.string().optional(),
        bio: z.string(),
        pronouns: z.string().optional(),
        website: z.string().optional(),
        github: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        mail: z.string().optional(),
    }),
});

export const collections = {
    blog,
    projects,
    authors,
};
