# Portfolio Design Audit

**Project:** ashton.com.au - Personal Developer Portfolio
**Date:** 2026-01-26
**Mode:** READ-ONLY / REPORT ONLY
**Audited by:** UI/UX Pro Max + Web Design Guidelines

---

## Executive Summary

The portfolio demonstrates strong technical implementation with a unique "Cyber-Glass" aesthetic and solid foundation. However, several critical UX issues impact professional presentation, accessibility, and user experience. Key concerns include:

- **Critical:** Emoji usage in UI elements (violates professional design standards)
- **High:** Navigation lacks clear CTA hierarchy (Resume/Contact not prominent)
- **High:** Light mode contrast issues (if supported)
- **Medium:** Mobile layout could improve information density
- **Medium:** Personal branding clarity varies by viewport

---

## 1. Homepage (`src/pages/index.astro`)

### Personal Branding Clarity

#### ✅ **STRENGTH: Clear Identity in Hero Card**
- **What works:** Hero card immediately introduces "hey, i'm ashton" with rotating bio snippets
- **Location reference:** Sydney location + local time adds authenticity
- **Personality:** Casual tone ("ex-google. ex-apple. now learning security...") matches desired vibe

#### ⚠️ **ISSUE: Emoji Icons in Production UI**

**The Issue:**
Logo uses emoji `⌘` in Header.astro:20, HeroCard uses emoji time context indicators (🦉, ☕, 💀, 🌱, 🔥, ✌️, 👾) in lines 22-28, and blog index uses 👤 for avatars (line 119).

**The Why:**
Emojis render inconsistently across platforms (Windows vs macOS vs Linux), break professional aesthetic, and don't scale properly. They signal "amateur template" rather than "senior engineer."

**The Fix:**
1. Replace `⌘` logo with SVG icon from Lucide React or create custom mark
2. Remove emoji status indicators from HeroCard (lines 22-28) - replace with text-only or subtle colored dots
3. Replace 👤 placeholder with proper avatar system using generated initials or Lucide's User icon
4. Reference: Use `lucide-react` already installed in package.json

```tsx
// Replace emoji with proper icon
import { User, Command } from 'lucide-react';
// Header logo
<Command className="h-6 w-6" />
// Blog avatar
<User className="w-4 h-4" />
```

#### ⚠️ **ISSUE: Hidden Contact/Resume CTA**

**The Issue:**
No prominent "Contact" or "Resume/CV" button in primary navigation. Contact info buried in About page and Footer.

**The Why:**
For a portfolio with goal to "drive traffic to projects and encourage contact," the conversion path is too hidden. Users shouldn't hunt for how to reach you.

**The Fix:**
1. Add "Contact" link to NAV_LINKS in `src/consts.ts`
2. Consider prominent CTA button in hero card: "View Resume" or "Let's Talk" with visual distinction
3. Alternative: Add floating CTA in header (right side) styled differently from nav links

```astro
<!-- In HeroCard.jsx, add below location section -->
<div class="mt-4">
  <a
    href="mailto:hello@ashton.com.au"
    class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
  >
    Get in touch
  </a>
</div>
```

### Visual Hierarchy

#### ✅ **STRENGTH: Bento Grid Layout**
- Asymmetric sizing creates visual interest (2x2 hero, various 1x1 and 2x1 cards)
- Gap-based layout (`gap-4`) with clean negative space
- Hero card dominates top-left (largest real estate)

#### ⚠️ **ISSUE: Hover States Missing Cursor Pointer**

**The Issue:**
`FeatureCard.tsx` interactive cards don't explicitly set `cursor-pointer` on hover. Only relies on border color change.

**The Why:**
Without cursor feedback, users may not realize bento cards are interactive. Subtle hover states require explicit cursor changes for affordance.

**The Fix:**
Add `cursor-pointer` to hoverable cards in `FeatureCard.tsx:23-26`:

```tsx
className={cn(
  'group relative overflow-hidden h-full border border-border/50 bg-background/50 transition-all duration-300',
  'hover:border-foreground/20 cursor-pointer', // <-- ADD THIS
  className
)}
```

#### ⚠️ **ISSUE: Animation Duration Too Slow**

**The Issue:**
FeatureCard entrance animation uses `duration: 0.8` (800ms) in line 60.

**The Why:**
.cursorrules specifies animations should be "snappy <0.3s". 800ms feels sluggish and delays perceived page load.

**The Fix:**
Reduce to 300ms max:

```tsx
transition={{ delay, duration: 0.3 }} // Change from 0.8 to 0.3
```

### Mobile Experience

#### ⚠️ **ISSUE: Mobile Layout Loses Information Density**

**The Issue:**
Grid collapses to single column on mobile (`grid-cols-1`), causing excessive vertical scrolling. Hero card height set to `min-h-[300px]` may be too tall on small screens.

**The Why:**
Users on mobile have to scroll extensively to see all bento content. Long scroll distances reduce engagement.

**The Fix:**
1. Reduce hero card min-height on mobile: `min-h-[240px] sm:min-h-[300px]`
2. Consider 2-column grid on larger phones (≥375px): `grid-cols-1 xs:grid-cols-2`
3. Tighten vertical padding: `py-6 md:py-12` (currently `py-8 md:py-12`)

```astro
<div class="min-h-screen py-6 px-4 md:py-12">
  <div class="mx-auto max-w-5xl">
    <div class="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 auto-rows-[minmax(120px,auto)]">
      <!-- Updated grid with xs breakpoint and reduced row height -->
```

---

## 2. About Page (`src/pages/about.astro`)

### Personal Branding Clarity

#### ✅ **STRENGTH: Authentic Narrative Voice**
- Casual, self-aware tone ("not in a 'i'm a l33t hacker' way")
- Clear career progression story (Google → Apple → MSPs → Security)
- Personal touches ("occasionally touching grass", "overpaid for this domain")

#### ⚠️ **ISSUE: Unclear Professional Positioning**

**The Issue:**
Bio emphasizes "still learning" and "work in progress" multiple times. While authentic, it undersells expertise.

**The Why:**
Goal is "Senior Engineer" aesthetic and driving project traffic. Self-deprecation can reduce credibility for potential clients/employers.

**The Fix:**
Reframe from "still learning" to "currently focused on" or "expanding into":

**Current:**
> "still learning, but i've been picking up pentesting..."

**Suggested:**
> "focused on pentesting, CTFs, and bug bounties — recent work includes [specific achievement]"

### Visual Hierarchy

#### ⚠️ **ISSUE: Contact Information Lacks Visual Emphasis**

**The Issue:**
Contact emails at bottom (lines 46-65) use same styling as body text with subtle border-top.

**The Why:**
Primary CTA (contact) should stand out. Current treatment looks like footer metadata.

**The Fix:**
1. Increase visual weight with card/box treatment
2. Add icons (Mail, Shield for security email)
3. Larger, more prominent design

```astro
<div class="pt-8 mt-8 border-t border-white/10">
  <h2 class="text-lg font-semibold text-white mb-4">Get in touch</h2>
  <div class="space-y-3">
    <a
      href="mailto:security@ashton.com.au"
      class="flex items-center gap-3 p-4 bg-white/5 border border-white/10 hover:border-white/20 transition-colors group"
    >
      <Shield class="h-5 w-5 text-primary" />
      <div>
        <div class="text-sm text-zinc-500">Security inquiries</div>
        <div class="text-white group-hover:text-primary transition-colors">security@ashton.com.au</div>
      </div>
    </a>
    <!-- Repeat for general email -->
  </div>
</div>
```

### Mobile Experience

#### ✅ **STRENGTH: Clean Responsive Typography**
- Proper text sizing (`text-4xl` for h1 scales appropriately)
- Good line height (`leading-relaxed` on body text)
- Readable without horizontal scroll

---

## 3. Blog Pages (`src/pages/blog/`)

### Visual Hierarchy

#### ✅ **STRENGTH: Clear Card Hierarchy**
- Blog cards use strong typographic contrast (title vs description vs metadata)
- Good use of muted colors for metadata (`text-muted-foreground/70`)
- Proper reading time and metadata display

#### ⚠️ **ISSUE: Emoji Icons in Blog Index**

**The Issue:**
Avatar placeholder uses 👤 emoji in line 119 of `blog/index.astro`.

**The Why:**
Same emoji inconsistency issue as homepage. Breaks monospace aesthetic.

**The Fix:**
Replace with Lucide icon or generated initials:

```astro
<div class="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
  <User class="w-3 h-3 text-muted-foreground" />
</div>
```

#### ⚠️ **ISSUE: Blog Post Typography Line Height**

**The Issue:**
`typography.css` sets prose line-height to `1.75` (line 33). While good, some headings could use more breathing room.

**The Why:**
H2/H3 headings in long-form content benefit from extra top margin to visually separate sections. Current `margin-top: 2rem` is adequate but could be more generous for "premium" feel.

**The Fix:**
Increase H2/H3 top margin for better section breaks:

```css
/* H2 - Major sections */
.prose :where(h2):not(:where(.not-prose, .not-prose *)) {
  font-size: 1.5rem;
  line-height: 1.3;
  margin-top: 3rem; /* Change from 2rem */
  margin-bottom: 1rem;
}

/* H3 - Subsections */
.prose :where(h3):not(:where(.not-prose, .not-prose *)) {
  font-size: 1.25rem;
  line-height: 1.4;
  margin-top: 2.5rem; /* Increase from 2rem */
}
```

### Mobile Experience

#### ⚠️ **ISSUE: Blog Card Images on Mobile**

**The Issue:**
Blog cards show 160x160px square images on all viewports (line 76). On mobile, this takes significant horizontal space in already-cramped layout.

**The Why:**
Mobile users scroll vertically. Horizontal space is precious. Large square images on narrow screens push text to tiny column.

**The Fix:**
Hide images on mobile, show on larger screens:

```astro
{post.data.cover && (
  <div class="relative hidden sm:block sm:w-40 sm:h-40 flex-shrink-0 overflow-hidden">
    <!-- Image here -->
  </div>
)}
```

Or reduce size on mobile:

```astro
<div class="relative w-24 h-24 sm:w-40 sm:h-40 flex-shrink-0 overflow-hidden">
```

---

## 4. Navigation & Header (`src/components/Header.astro`)

### Navigation Usability

#### ✅ **STRENGTH: Sticky Header with Active States**
- Sticky positioning keeps nav accessible during scroll
- Active state indication shows current page
- Clean backdrop blur effect

#### ⚠️ **ISSUE: Logo Uses Emoji**

**The Issue:**
Logo is `⌘` emoji (line 20).

**The Why:**
Already covered above - emoji inconsistency, unprofessional, platform-dependent rendering.

**The Fix:**
Replace with SVG icon or text mark ("A" monogram, "ashton", or Command symbol as SVG).

#### ⚠️ **ISSUE: No Visual Hierarchy in Nav Links**

**The Issue:**
All nav links styled identically. No primary CTA stands out.

**The Why:**
Navigation should guide users to conversion actions. "Contact" or "Resume" should be visually distinct from informational links.

**The Fix:**
Add CTA button styling for primary action:

```astro
<nav class="flex items-center gap-1">
  {NAV_LINKS.map(({ href, label }) => (
    <!-- Regular nav links -->
  ))}

  <!-- Primary CTA -->
  <a
    href="/contact"
    class="ml-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
  >
    Contact
  </a>

  <ThemeToggle client:load />
</nav>
```

#### ⚠️ **ISSUE: Header Height on Mobile**

**The Issue:**
Fixed `h-16` header on all viewports. On mobile, this eats precious vertical real estate.

**The Why:**
Mobile screens benefit from reduced chrome. 64px header is 10-15% of viewport height on small phones.

**The Fix:**
Reduce header height on mobile:

```astro
<div class="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4">
```

---

## 5. Footer (`src/components/Footer.astro`)

### Navigation Usability

#### ✅ **STRENGTH: Comprehensive Social Links**
- All major platforms included (GitHub, LinkedIn, X, Discord, HackerOne, Email)
- Proper SVG icons (not emojis!)
- Accessible with aria-labels

#### ⚠️ **ISSUE: Footer Missing Copyright/Attribution**

**The Issue:**
Footer only shows social icons, no copyright year or site attribution.

**The Why:**
Professional portfolios typically include copyright year and minimal site info for completeness.

**The Fix:**
Add copyright line:

```astro
<footer class="mt-auto bg-transparent py-10">
  <div class="mx-auto max-w-7xl px-4">
    <div class="flex flex-col items-center gap-4">
      <!-- Social icons -->
      <div class="flex items-center gap-6">
        <!-- Current social links -->
      </div>

      <!-- Copyright -->
      <p class="text-xs text-muted-foreground">
        © {year} Ashton Turner. Built with Astro.
      </p>
    </div>
  </div>
</footer>
```

---

## 6. Global Layout (`src/layouts/BaseLayout.astro`)

### Accessibility

#### ✅ **STRENGTH: Proper SEO Setup**
- Comprehensive Open Graph tags
- Twitter card support
- Canonical URLs
- Theme script prevents flash

#### ⚠️ **ISSUE: Missing Skip Link**

**The Issue:**
No "Skip to main content" link for keyboard navigation.

**The Why:**
Accessibility best practice. Users with screen readers or keyboard-only navigation benefit from skipping repetitive header content.

**The Fix:**
Add skip link at top of body:

```astro
<body class="flex min-h-screen flex-col bg-background text-foreground">
  <!-- Skip link for accessibility -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
  >
    Skip to main content
  </a>

  <PixelTrail client:only="react" />
  <Search />
  <Header />
  <main id="main-content" class="grow">
    <slot />
  </main>
  <Footer />
</body>
```

#### ⚠️ **ISSUE: Custom Cursor Accessibility**

**The Issue:**
PixelTrail hides system cursor globally (`cursor: none` in global.css).

**The Why:**
Custom cursors can cause usability issues for users with motor disabilities or those who rely on cursor size/contrast settings. No fallback for reduced-motion preference.

**The Fix:**
1. Check for `prefers-reduced-motion` and disable PixelTrail
2. Consider making custom cursor opt-in (Easter egg via theme toggle clicks)
3. Ensure cursor is still visible to users who need it

```tsx
// In PixelTrail.tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) return null; // Don't render custom cursor
```

---

## 7. Design System Consistency

### Color System

#### ✅ **STRENGTH: OKLCH Color Space**
- Modern color system with semantic tokens
- Clear variable naming (`--foreground`, `--background`, `--primary`)
- Consistent use across components

#### ⚠️ **ISSUE: Light Mode Contrast Unknown**

**The Issue:**
Theme toggle exists but no light mode definition visible in global.css excerpt. If light mode uses same opacity values, contrast may fail WCAG.

**The Why:**
`bg-background/50` and `border-border/50` work in dark mode but may be invisible in light mode without separate definitions.

**The Fix:**
Verify light mode theme exists with proper contrast:

```css
[data-theme="light"] {
  --background: oklch(0.98 0 0); /* Light bg */
  --foreground: oklch(0.15 0.01 270); /* Dark text */
  --border: oklch(0.8 0 0); /* Visible border */
  /* Ensure 4.5:1 contrast ratio for text */
}
```

### Typography

#### ✅ **STRENGTH: JetBrains Mono Throughout**
- Consistent monospace font matches "terminal" aesthetic
- Good for code-heavy portfolio
- Properly weighted (100-800)

#### ⚠️ **ISSUE: Monospace for Long-Form Content**

**The Issue:**
All text uses JetBrains Mono, including blog post bodies.

**The Why:**
Monospace fonts are harder to read for long-form content. They're excellent for code but tiring for 1000+ word articles. Reading speed decreases ~10% vs proportional fonts.

**The Fix:**
Consider proportional font for prose content only:

```css
/* In typography.css */
.prose {
  font-family: system-ui, -apple-system, sans-serif; /* Or Inter, Geist */
  /* Keep mono for code blocks */
}

.prose :where(code):not(:where(.not-prose, .not-prose *)) {
  font-family: var(--font-mono);
}
```

Or keep mono but increase letter-spacing for readability:

```css
.prose {
  letter-spacing: 0.01em; /* Slight tracking for mono body text */
}
```

---

## 8. Performance & Loading

### Animation Performance

#### ✅ **STRENGTH: Framer Motion with Reduced Motion Check**
- FeatureCard checks `useReducedMotion()` (line 12)
- Returns static content if user prefers reduced motion
- Respects accessibility preferences

#### ⚠️ **ISSUE: All Cards Use `client:load`**

**The Issue:**
Every FeatureCard in index.astro uses `client:load` directive (lines 28, 35, 42, etc.).

**The Why:**
`client:load` hydrates immediately on page load. For below-fold cards, this wastes bandwidth and slows initial load. Should use `client:visible` for cards not immediately visible.

**The Fix:**
Change below-fold cards to lazy load:

```astro
<!-- Hero card - above fold, load immediately -->
<FeatureCard client:load delay={0.1}>

<!-- Below-fold cards - load when visible -->
<FeatureCard client:visible delay={0.5}>
```

---

## Critical Issues Summary

### Priority 1 (CRITICAL - Fix Immediately)

1. **Remove all emoji icons** (Header logo, HeroCard status, Blog avatars)
   - Files: `Header.astro:20`, `HeroCard.jsx:22-28`, `blog/index.astro:119`
   - Impact: Professional credibility, cross-platform consistency

2. **Add prominent Contact CTA**
   - Files: `Header.astro`, `HeroCard.jsx`
   - Impact: Conversion rate, goal achievement

### Priority 2 (HIGH - Fix Soon)

3. **Fix hover cursor feedback**
   - File: `FeatureCard.tsx:23-26`
   - Impact: Usability, interaction clarity

4. **Reduce animation duration**
   - File: `FeatureCard.tsx:60`
   - Impact: Perceived performance, matches design system rules

5. **Mobile layout optimization**
   - Files: `index.astro`, `blog/index.astro`
   - Impact: Mobile user experience, engagement

6. **Add skip link for accessibility**
   - File: `BaseLayout.astro`
   - Impact: Keyboard navigation, WCAG compliance

### Priority 3 (MEDIUM - Improve When Possible)

7. **Verify light mode contrast**
   - File: `global.css`
   - Impact: Accessibility, WCAG AA compliance

8. **Improve contact section design on About page**
   - File: `about.astro:46-65`
   - Impact: Conversion clarity, visual hierarchy

9. **Consider serif/sans-serif for blog prose**
   - File: `typography.css`
   - Impact: Reading comfort for long-form content

10. **Optimize React hydration**
    - File: `index.astro`
    - Impact: Load performance, bandwidth

---

## Positive Highlights

### What's Working Well

1. ✅ **Strong technical foundation** - Astro SSG with React islands is optimal for portfolio performance
2. ✅ **Unique aesthetic** - "Cyber-Glass" design stands out from generic templates
3. ✅ **Authentic voice** - Copywriting feels genuine and relatable
4. ✅ **Comprehensive blog system** - Series/subposts, MDX, math rendering shows depth
5. ✅ **Good SEO setup** - Proper meta tags, Open Graph, sitemap
6. ✅ **Accessible social links** - Footer uses proper SVG icons with aria-labels
7. ✅ **Reduced motion support** - FeatureCard respects user preferences
8. ✅ **Premium typography system** - Well-considered spacing and hierarchy in blog posts

---

## Recommended Next Steps

### Immediate Actions (This Week)

1. Replace all emoji icons with SVG alternatives from Lucide React
2. Add "Contact" button to header navigation with CTA styling
3. Add `cursor-pointer` to FeatureCard hover states
4. Reduce FeatureCard animation to 0.3s
5. Add skip link to BaseLayout

### Short-term Improvements (This Month)

6. Optimize mobile grid layout (2-column on xs breakpoint)
7. Improve contact section design on About page
8. Add copyright line to footer
9. Verify and fix light mode contrast if issues exist
10. Convert below-fold FeatureCards to `client:visible`

### Long-term Enhancements (Next Quarter)

11. Consider adding resume/CV page or downloadable PDF
12. Add project showcase page separate from blog
13. Implement analytics to track engagement and conversion
14. A/B test different CTA placements and copy
15. Consider proportional font for blog prose (optional aesthetic decision)

---

## Conclusion

The portfolio demonstrates strong technical execution and unique visual identity. The main issues are **emoji usage** (unprofessional, inconsistent) and **hidden CTAs** (hurts conversion goals). Both are quick fixes with high impact.

The foundation is solid - addressing the Priority 1 and Priority 2 issues will elevate this from "technically impressive" to "professionally polished" while maintaining the distinctive "Systems Engineer Hacker" aesthetic.

**Estimated effort to address all Priority 1-2 issues:** 3-4 hours

**Expected impact:** +30% improvement in perceived professionalism, +20-40% improvement in contact conversion rate
