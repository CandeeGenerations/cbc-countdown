# Tailwind CSS v4 Migration Plan

## Overview

This document outlines the plan to upgrade CBC Countdown from Tailwind CSS v3 to v4. The project currently uses Tailwind v3.4.17 with official plugins (@tailwindcss/forms, @tailwindcss/typography, @tailwindcss/aspect-ratio).

## Prerequisites Check

- ✅ **Node.js version**: Currently v22.20.0 (meets v4 requirement of Node.js 20+)
- ✅ **Browser targets**: Safari 16.4+, Chrome 111+, Firefox 128+ (project uses modern browsers)
- ⚠️ **CSS preprocessors**: None used (v4 does not support Sass/Less/Stylus)

## Breaking Changes Assessment

### 1. CSS Import Syntax Changes

**Current state** (`src/styles/globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Required change**:

```css
@import 'tailwindcss';
```

**Impact**: Low - Simple find/replace operation

---

### 2. PostCSS Configuration Changes

**Current state** (`postcss.config.js`):

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Required changes**:

- The `tailwindcss` package is no longer a PostCSS plugin in v4
- Need to install `@tailwindcss/postcss` package
- Can remove `autoprefixer` (now built into v4)
- Can remove `postcss-import` if present (now built into v4)

**New configuration**:

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**Impact**: Medium - Requires package changes and config update

---

### 3. Tailwind Config Migration

**Current state** (`tailwind.config.js`):

```javascript
const forms = require('@tailwindcss/forms')
const typography = require('@tailwindcss/typography')
const aspectRatio = require('@tailwindcss/aspect-ratio')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [forms, typography, aspectRatio],
}
```

**Required changes**:

- Configuration now lives in CSS, not JavaScript (unless explicitly needed)
- Plugins are loaded via `@plugin` directive in CSS
- The `content` configuration is replaced by `@source` in CSS

**New CSS configuration** (in `src/styles/globals.css`):

```css
@import 'tailwindcss';

@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";

@source "../**/*.{js,jsx,ts,tsx}";
```

**Note on aspect-ratio plugin**: This plugin is no longer needed in v4 as native aspect-ratio is now supported in all target browsers (Safari 16.4+). Can be safely removed.

**Impact**: Medium - Configuration paradigm shift from JS to CSS

---

### 4. Official Plugins Updates

**Current plugins**:

- `@tailwindcss/aspect-ratio` v0.4.2
- `@tailwindcss/forms` v0.5.10
- `@tailwindcss/typography` v0.5.19

**Required changes**:

- ✅ Keep `@tailwindcss/forms` (update to v4-compatible version)
- ✅ Keep `@tailwindcss/typography` (update to v4-compatible version)
- ❌ Remove `@tailwindcss/aspect-ratio` (no longer needed in v4)

**Impact**: Low - Update packages, remove aspect-ratio plugin

---

### 5. Utility Class Audit

**Classes used in project** (from `src/pages/index.tsx`):

- `flex` - ✅ No change
- `flex-col` - ✅ No change
- `items-center` - ✅ No change
- `space-y-4` - ⚠️ **Breaking change**: Now uses `:not(:last-child)` instead of sibling combinators
- `uppercase` - ✅ No change
- `font-bold` - ✅ No change
- `font-black` - ✅ No change
- `text-xl` - ✅ No change
- `text-7xl` - ✅ No change
- `mb-0` - ✅ No change
- `font-mono` - ✅ No change

**Breaking changes found**:

- `space-y-4`: Behavior changed but should still work correctly for this use case (vertical spacing between `<p>` elements)

**Impact**: Low - No immediate code changes needed, but behavior is slightly different

---

### 6. Package Dependencies Updates

**Packages to update**:

```json
{
  "dependencies": {
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@tailwindcss/forms": "^4.0.0",
    "@tailwindcss/typography": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0"
  }
}
```

**Packages to remove**:

```json
{
  "dependencies": {
    "@tailwindcss/aspect-ratio": "^0.4.2" // No longer needed
  },
  "devDependencies": {
    "autoprefixer": "^10.4.21" // Now built into Tailwind v4
  }
}
```

**Note**: May also be able to remove `postcss` package if not used elsewhere, as v4 handles it internally.

**Impact**: Medium - Multiple package changes

---

### 7. Next.js Configuration

**Current state** (`next.config.js`):

```javascript
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}
```

**Required changes**:

- None - Next.js configuration should work as-is with Tailwind v4
- PostCSS will automatically be used via the updated `postcss.config.js`

**Impact**: None

---

### 8. Netlify Deployment

**Current state** (`netlify.toml`):

```toml
[build]
publish = ".next"
command = "pnpm build"

[[plugins]]
package = "@netlify/plugin-nextjs"
```

**Required changes**: None - Netlify should work as-is after migration

**Impact**: None

---

## Migration Steps (Ordered)

### Step 1: Backup and Branch

- [x] Create a new Git branch for the migration
- [ ] Ensure all current changes are committed

### Step 2: Update Package Dependencies

- [ ] Remove `@tailwindcss/aspect-ratio` from package.json
- [ ] Remove `autoprefixer` from package.json
- [ ] Update `tailwindcss` to v4
- [ ] Add `@tailwindcss/postcss` to devDependencies
- [ ] Update `@tailwindcss/forms` to v4-compatible version
- [ ] Update `@tailwindcss/typography` to v4-compatible version
- [ ] Run `pnpm install`

### Step 3: Update CSS Files

- [ ] Replace `@tailwind` directives in `src/styles/globals.css` with:

  ```css
  @import 'tailwindcss';

  @plugin "@tailwindcss/typography";
  @plugin "@tailwindcss/forms";

  @source "../**/*.{js,jsx,ts,tsx}";
  ```

### Step 4: Update PostCSS Configuration

- [ ] Update `postcss.config.js` to use `@tailwindcss/postcss`
- [ ] Remove `autoprefixer` from PostCSS plugins

### Step 5: Remove/Archive Old Config

- [ ] Remove or rename `tailwind.config.js` (no longer needed with CSS-based config)
- [ ] If any custom theme configuration is needed, migrate it to CSS custom properties

### Step 6: Test the Build

- [ ] Run `pnpm run build` to ensure build succeeds
- [ ] Check for any build errors or warnings
- [ ] Verify output bundle size (should be similar or smaller)

### Step 7: Visual Testing

- [ ] Run `pnpm run dev`
- [ ] Test the countdown display at `localhost:4848`
- [ ] Verify:
  - Background color (#621A34) displays correctly
  - Text styling (uppercase, bold, sizes) appears correct
  - Flexbox layout works (centered content)
  - Spacing between elements (`space-y-4`) works correctly
  - Font family switches properly (mono vs sans)

### Step 8: Cross-Browser Testing

- [ ] Test in Safari 16.4+ (if available)
- [ ] Test in Chrome 111+
- [ ] Test in Firefox 128+
- [ ] Verify responsive behavior (if applicable)

### Step 9: Update Documentation

- [ ] Update CLAUDE.md to reflect Tailwind v4
- [ ] Update README.md if needed
- [ ] Document any breaking changes discovered during migration

### Step 10: Commit and Review

- [ ] Commit all changes with a descriptive message
- [ ] Review the diff to ensure nothing unexpected changed
- [ ] Test production build (`pnpm run build && pnpm start`)

---

## Automated Migration Option

Tailwind provides an official upgrade tool that can automate most of these steps:

```bash
npx @tailwindcss/upgrade@next
```

**Pros**:

- Automates most of the migration
- Handles package updates
- Migrates configuration files
- Updates template syntax

**Cons**:

- Requires Node.js 20+ (we have 22, so OK)
- May not handle all edge cases
- Still requires manual review and testing

**Recommendation**: Consider using the automated tool first, then review and adjust as needed.

---

## Risk Assessment

| Risk                         | Severity | Mitigation                                                   |
| ---------------------------- | -------- | ------------------------------------------------------------ |
| Breaking CSS syntax changes  | Low      | Only `space-y-4` affected, behavior should remain consistent |
| Plugin compatibility issues  | Low      | Official plugins have v4 support                             |
| Build process failures       | Medium   | Test thoroughly in dev before committing                     |
| Visual regressions           | Low      | Simple UI makes visual testing straightforward               |
| Production deployment issues | Low      | Netlify should handle v4 without issues                      |
| Rollback difficulty          | Low      | Git branch makes rollback simple                             |

**Overall Risk Level**: **Low to Medium**

---

## Rollback Plan

If issues arise during migration:

1. **Before deployment**: Simply switch back to the previous Git branch
2. **After deployment**:
   - Revert the merge commit
   - Trigger a new Netlify deployment from the previous commit
   - Estimated rollback time: < 5 minutes

---

## Success Criteria

- [ ] Build completes without errors
- [ ] Development server starts successfully
- [ ] Countdown display renders correctly
- [ ] All styling appears unchanged from v3
- [ ] No console errors in browser
- [ ] Production build size is reasonable (similar to v3)
- [ ] All linting/formatting passes
- [ ] Netlify deployment succeeds

---

## Post-Migration Tasks

- [ ] Monitor production for any visual or functional issues
- [ ] Consider taking advantage of new v4 features (if applicable)
- [ ] Update any developer documentation
- [ ] Share learnings with team (if applicable)

---

## Notes

- The project has a very simple Tailwind usage (only basic utilities), which reduces migration complexity
- No custom Tailwind plugins are used
- No complex theme customization is present
- The `space-y-4` utility is the only class with behavioral changes, but should work correctly in this context
- Aspect-ratio plugin removal is safe since target browsers support native aspect-ratio

---

## Questions/Decisions Needed

1. Should we use the automated migration tool (`npx @tailwindcss/upgrade@next`) or do manual migration?
2. Should we keep `tailwind.config.js` for potential future use, or fully migrate to CSS-based config?
3. Do we want to take advantage of any new v4 features during this migration?

---

## References

- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4 Beta Documentation](https://tailwindcss.com/docs/v4-beta)
- [Next.js + Tailwind CSS v4 Guide](https://tailwindcss.com/docs/installation/framework-guides)
