# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CBC Countdown is a Next.js application that displays a countdown timer to the next church service. The application calculates and shows the time remaining until the next scheduled service (Sundays at 9:45am, 11:00am, 6:30pm, and Wednesdays at 7:30pm).

## Development Commands

### Setup

- `pnpm install` - Install dependencies (uses pnpm 10.x, required by package manager settings)
- Prerequisites: Node.js 22.x, pnpm 10.x (install via corepack)

### Development

- `pnpm run dev` - Start development server on port 4848 (uses fnm for Node version management)
- `pnpm run build` - Production build (injects version from package.json into NEXT_PUBLIC_APP_VERSION)
- `pnpm start` - Start production server (uses fnm for Node version management)

### Code Quality

- `pnpm run eslint` - Run ESLint on TypeScript files in src/
- `pnpm run prettier` - Check and format all files with Prettier (uses cache)
- `pnpm run fix` - Run both ESLint and Prettier with auto-fix
- `pnpm run prettier:ci` - Check formatting without modifying files (for CI)

### Release

- `pnpm run release` - Create a new minor version release using standard-version

## Architecture

### Application Structure

This is a simple Next.js application with a minimal structure:

- `src/pages/_app.tsx` - Root app component that imports global styles
- `src/pages/_document.tsx` - Custom document with CBC brand color (#621A34) and base styling
- `src/pages/index.tsx` - Main countdown page (only page in the app)
- `src/styles/globals.css` - Global Tailwind CSS styles

### Countdown Logic

The countdown timer (`src/pages/index.tsx`) uses dayjs with duration and relativeTime plugins to:

1. Calculate 4 service times: Sunday 9:45am, 11:00am, 6:30pm, and Wednesday 7:30pm
2. Sort them by date and find the next upcoming service after the current time
3. Format the display based on time remaining:
   - ≥1 day: Shows "X day(s)"
   - <1 day with hours remaining: Shows "H:mm:ss" format
   - <1 hour: Shows "m:ss" format
4. Update every second via setInterval

### Styling

- Uses Tailwind CSS with official plugins (@tailwindcss/aspect-ratio, forms, typography)
- Custom brand color: #621A34 (set in \_document.tsx body style)
- Responsive utility-first styling approach

## Code Style

### Formatting

- Prettier configuration: 120 character line length, single quotes, no semicolons, 2 space indentation
- Import ordering: tracer imports → third-party → relative imports (enforced by @trivago/prettier-plugin-sort-imports)
- Auto-formatting on commit via lint-staged

### Linting

- ESLint with TypeScript support (typescript-eslint)
- Max line length: 250 characters (warning)
- Notable rules: no-undef (error), prefer-const (warning), no-unused-vars (warning)
- TypeScript strict mode is disabled (tsconfig.json)

### Path Aliases

- `@/*` maps to `./src/*` for cleaner imports

## Build Configuration

### Next.js Settings

- React strict mode enabled
- Output: standalone (for containerization/deployment)
- Turbopack enabled for faster development
- Experimental settings: workerThreads disabled, single CPU usage

### Deployment

- Configured for Netlify deployment (netlify.toml)
- Uses @netlify/plugin-nextjs for Next.js optimization
- Build command: `pnpm build`
- Publish directory: `.next`

## Git Workflow

- Uses Husky for Git hooks
- Commits must follow conventional commit format (commitlint)
- Pre-commit: Runs lint-staged (prettier, eslint, sort-package-json)
- Versioning via standard-version (automated CHANGELOG generation)
