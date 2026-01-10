# Blog Content Guidelines

## Quick Rules

### ✅ Every Post Must Have:

1. **At least 2-3 H2 headings** (`##`) - generates ToC sidebar
2. **300+ words minimum** - prevents awkward short posts
3. **Complete frontmatter** - title, description, date, authors
4. **Proper structure** - intro → content → conclusion

### 🎯 Structure Template

```markdown
# Title (auto-generated from frontmatter)

Introduction paragraph

## Section 1

Content...

## Section 2

Content...

## Conclusion

Wrap-up
```

## Why These Rules?

### Problem: No Headings

**What happens:** Post has no ToC sidebar, looks broken with huge empty space on right  
**Fix:** Always use H2 (`##`) headings to organize content

### Problem: Too Short

**What happens:** Single paragraph looks incomplete and awkward  
**Fix:** Write at least 300 words. If topic is simple, add examples or context

### Problem: Wall of Text

**What happens:** Hard to scan, overwhelming for readers  
**Fix:** Break into sections with headings, use lists and code blocks

## File Template

See `blog-post-template.md` in `.agent/` folder for full template with examples.

## Series Posts

Create multi-part series:

```
blog/
  japan-trip.md       ← Overview
  japan-trip/
    day-1.md         ← Auto-linked in sidebar
    day-2.md
```

Navigation appears automatically!
