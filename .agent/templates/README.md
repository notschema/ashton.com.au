# Blog Post Templates

## Location

`.agent/templates/`

## Available Templates

### 1. Standalone Post

**File:** `TEMPLATE-standalone-post.md`  
**Use for:** Regular blog posts, tutorials, writeups  
**Features:**

- Full frontmatter with all fields
- Proper heading structure (H2 sections)
- ToC sidebar automatically generated
- Code blocks and formatting examples

### 2. Series Parent

**File:** `TEMPLATE-series-parent.md`  
**Use for:** Overview post for multi-part series  
**Features:**

- Overview describing the series
- Automatic subpost navigation sidebar
- Links to all parts generated automatically

### 3. Series Subpost

**File:** `TEMPLATE-series-subpost.md`  
**Use for:** Individual parts within a series  
**Features:**

- Parent link in header
- Series navigation sidebar
- Part-specific content structure

## How to Use

### Create Standalone Post:

```bash
# Copy template
cp .agent/templates/TEMPLATE-standalone-post.md src/content/blog/my-new-post.md

# Edit the content
# Update title, description, date, tags
# Replace example content with yours
```

### Create Multi-Part Series:

```bash
# 1. Create parent overview
cp .agent/templates/TEMPLATE-series-parent.md src/content/blog/my-series.md

# 2. Create folder for parts
mkdir src/content/blog/my-series

# 3. Create each part
cp .agent/templates/TEMPLATE-series-subpost.md src/content/blog/my-series/part-1.md
cp .agent/templates/TEMPLATE-series-subpost.md src/content/blog/my-series/part-2.md
```

## Critical Rules

✅ **Always include H2 headings** (`##`) - generates ToC  
✅ **Write 300+ words** - prevents awkward short posts  
✅ **Complete frontmatter** - title, description, date, authors  
✅ **Use proper structure** - intro → content → conclusion

❌ **Don't skip headings** - causes layout issues  
❌ **Don't write one-liners** - looks incomplete  
❌ **Don't forget dates** - breaks chronological sorting

## Quick Reference

See `BLOG_GUIDELINES.md` for detailed writing guidelines.
