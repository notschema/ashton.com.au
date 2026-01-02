/**
 * Site Configuration
 * Central config for site metadata and social links
 */

export const SITE = {
    title: 'Ashton | Systems Engineer & Security Consultant',
    description: 'Professional portfolio of Ashton Turner, a Systems Engineer and Whitehat Pentester based in Sydney. Specializing in secure infrastructure, red team assessments, and software engineering.',
    url: 'https://ashton.com.au',
    author: 'Ashton',
    locale: 'en-AU',
};

export const SOCIAL_LINKS = {
    github: 'https://github.com/notschema',
    linkedin: 'https://linkedin.com/in/ashton',
    email: 'hello@ashton.com.au',
};

export const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
];

// Discord User ID for Lanyard integration
// Replace with your actual Discord ID
export const DISCORD_USER_ID = 'YOUR_DISCORD_USER_ID';

// Last.fm username for Spotify/music tracking (optional)
export const LASTFM_USERNAME = 'YOUR_LASTFM_USERNAME';
