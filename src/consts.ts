/**
 * Site Configuration
 * Central config for site metadata and social links
 */

export const SITE = {
    title: 'Ashton.com.au',
    description: 'Security consultant and systems engineer based in Sydney. Specializing in penetration testing, red team assessments, and building secure infrastructure.',
    url: 'https://ashton.com.au',
    author: 'Ashton',
    locale: 'en-AU',
};

export const SOCIAL_LINKS = {
    github: 'https://github.com/AshtonAU',
    linkedin: 'https://linkedin.com/in/ashtonau',
    discord: 'https://discord.com/users/169372933913968649',
    x: 'https://x.com/AshtonAU',
    email: 'hello@ashton.com.au',
    hackerone: 'https://hackerone.com/AshtonSec',
};

export const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
];

// Discord User ID for Lanyard integration
export const DISCORD_USER_ID = '169372933913968649';

// Last.fm username for music tracking (optional)
export const LASTFM_USERNAME = '';
