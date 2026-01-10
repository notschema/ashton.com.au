---
title: "Your Post Title Here"
description: "A brief, compelling description of your post (140-160 characters recommended)"
date: 2026-01-10
cover: "../../assets/blog/hero-code.png" # Optional: path to hero image
authors: ["ashton"] # Your name or handle
tags: ["security", "infrastructure"] # Relevant tags for categorization
draft: false # Set to true to hide from blog index
---

# Main Post Title

**Lead paragraph:** Start with a strong opening that hooks the reader and explains what they'll learn. Keep it concise - 2-3 sentences max.

## Introduction

Provide context and background for your topic. Answer:

- Why does this matter?
- Who is this for?
- What problem does it solve?

## Section 1: First Major Topic

Break your content into clear, scannable sections using H2 (`##`) headings.

### Subsection (if needed)

Use H3 (`###`) for sub-points within sections.

**Pro tip:** Use **bold** for emphasis and `code` for technical terms.

```bash
# Code examples should be in fenced code blocks with language specified
npm install package-name
```

## Section 2: Main Content

Keep paragraphs short - 3-4 sentences max for better readability.

Use lists for clarity:

- ✅ **Do this:** Be specific and actionable
- ❌ **Don't do this:** Avoid vague advice
- 💡 **Tip:** Add context or gotchas

### Real-World Example

Always include practical examples:

```javascript
// Give context before code
function example() {
  return "Show, don't just tell";
}
```

## Visual Assets

![Alt text describing the image](../../assets/blog/example.png)

**Image guidelines:**

- Use descriptive alt text
- Optimize images (WebP preferred, max 1200px wide)
- Place images near relevant text

## Key Takeaways

Summarize the main points in a bulleted list:

- **Point 1:** What the reader should remember
- **Point 2:** Actionable advice
- **Point 3:** Next steps or resources

## Links and Resources

- [External Resource](https://example.com) - Brief description
- [Another Link](https://example.com) - Why it's useful

---

## Content Guidelines

### Structure Requirements

1. **Always include headings** - At minimum: Introduction, Main Content, Conclusion
2. **Use H2 for sections** - This generates the ToC sidebar
3. **Keep it scannable** - Short paragraphs, bullet points, code blocks
4. **Write 300+ words minimum** - Anything shorter looks awkward

### Formatting Best Practices

- Use **bold** for key terms and emphasis
- Use `inline code` for CLI commands, file paths, function names
- Use code blocks with language tags for syntax highlighting
- Break up text with images, lists, or blockquotes every 3-4 paragraphs

### Frontmatter Requirements

```yaml
title: # REQUIRED - Shows in browser tab and meta
description: # REQUIRED - For SEO and social sharing
date: # REQUIRED - Format: YYYY-MM-DD
authors: # REQUIRED - ["ashton"] or ["your-name"]
tags: # RECOMMENDED - For categorization
cover: # OPTIONAL - Hero image path
draft: # OPTIONAL - true to hide from index
```

### Common Mistakes to Avoid

❌ **No headings** → No ToC sidebar, looks broken  
❌ **Too short** → Less than 200 words looks incomplete  
❌ **Wall of text** → Use headings and lists to break it up  
❌ **Generic title** → Be specific: "Setting Up Docker" not "Docker Guide"  
❌ **Missing image alt text** → Breaks accessibility

### Series/Multi-Part Posts

To create a series like the "Test Series":

```
src/content/blog/
  series-name.md          ← Parent overview post
  series-name/
    part-1.md             ← First part
    part-2.md             ← Second part
```

Each part automatically gets series navigation!

---

**Questions?** Keep posts focused, well-structured, and valuable. Quality > quantity!
