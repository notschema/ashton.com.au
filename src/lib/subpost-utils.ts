/**
 * Subpost Utilities
 * Helper functions for hierarchical blog posts
 */

import { getCollection, type CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

/**
 * Check if a post ID represents a subpost
 * Subposts have IDs like "parent/child"
 */
export function isSubpost(id: string): boolean {
  return id.includes('/');
}

/**
 * Get the parent ID from a subpost ID
 * "japan-trip/day-1" → "japan-trip"
 */
export function getParentId(subpostId: string): string | null {
  if (!isSubpost(subpostId)) return null;
  return subpostId.split('/')[0];
}

/**
 * Get the parent post for a subpost
 */
export async function getParentPost(subpostId: string): Promise<BlogPost | null> {
  const parentId = getParentId(subpostId);
  if (!parentId) return null;

  const posts = await getCollection('blog');
  return posts.find((post) => post.id === parentId) || null;
}

/**
 * Check if a post has subposts (children)
 */
export async function hasSubposts(postId: string): Promise<boolean> {
  const posts = await getCollection('blog');
  return posts.some((post) => {
    const parentId = getParentId(post.id);
    return parentId === postId;
  });
}

/**
 * Get all subposts (children) of a parent post
 * Returns sorted by ID (alphabetically)
 */
export async function getSubposts(parentId: string): Promise<BlogPost[]> {
  const posts = await getCollection('blog');
  const subposts = posts.filter((post) => {
    const postParentId = getParentId(post.id);
    return postParentId === parentId;
  });

  return subposts.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Get the count of subposts for a parent
 */
export async function getSubpostCount(parentId: string): Promise<number> {
  const subposts = await getSubposts(parentId);
  return subposts.length;
}

/**
 * Get sibling subposts (previous and next in the series)
 */
export async function getAdjacentSubposts(
  currentSubpostId: string
): Promise<{
  previous: BlogPost | null;
  next: BlogPost | null;
}> {
  const parentId = getParentId(currentSubpostId);
  if (!parentId) return { previous: null, next: null };

  const subposts = await getSubposts(parentId);
  const currentIndex = subposts.findIndex((post) => post.id === currentSubpostId);

  if (currentIndex === -1) return { previous: null, next: null };

  return {
    previous: currentIndex > 0 ? subposts[currentIndex - 1] : null,
    next: currentIndex < subposts.length - 1 ? subposts[currentIndex + 1] : null,
  };
}
