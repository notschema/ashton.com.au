import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind conflict resolution
 * @param {...(string|boolean|undefined|null|object)} inputs - Class names to merge
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
}

/**
 * Format date to month/year
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted month/year string
 */
export function formatMonthYear(date) {
    return new Intl.DateTimeFormat('en-AU', {
        year: 'numeric',
        month: 'short',
    }).format(new Date(date));
}

/**
 * Calculate reading time from word count
 * @param {number} wordCount - Number of words
 * @returns {string} - Reading time string
 */
export function readingTime(wordCount) {
    const minutes = Math.max(1, Math.round(wordCount / 200));
    return `${minutes} min read`;
}

/**
 * Calculate word count from HTML string
 * @param {string} html - HTML content
 * @returns {number} - Word count
 */
export function calculateWordCount(html) {
    if (!html) return 0;
    const textOnly = html.replace(/<[^>]+>/g, '');
    return textOnly.split(/\s+/).filter(Boolean).length;
}

/**
 * Slugify a string
 * @param {string} text - Text to slugify
 * @returns {string} - Slugified string
 */
export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

/**
 * Get elapsed time from timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - Elapsed time string
 */
export function getElapsedTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 60000) % 60);
    const hours = Math.floor(diff / 3600000);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} elapsed`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')} elapsed`;
}
