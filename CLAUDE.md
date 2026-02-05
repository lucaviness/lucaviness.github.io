---
description: 
alwaysApply: true
---

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal website for lucaviness.com, hosted on GitHub Pages. The site is a simple, clean portfolio/blog featuring:
- A personal introduction and bio
- Newsletter integration with Substack (shared with Jeremi Nuer at lucandjeremi.substack.com)
- Flying/aviation section
- Essay pages (currently one essay: "Re: Summer 2025")

## Architecture

### Core Structure
- **index.html**: Main landing page with header, newsletter section, flying section, and footer
- **essay.html**: Template for essay posts with back navigation
- **css/style.css**: Main stylesheet with CSS variables, mobile-responsive design, and newsletter component styles
- **css/essay.css**: Additional styles for essay pages
- **js/substack.js**: Fetches and displays latest Substack post using RSS2JSON API with localStorage caching
- **js/newsletter.js**: Custom newsletter subscription component using iframe method to bypass CORS with Substack API

### Key Components

#### Newsletter Subscription System
The newsletter component (js/newsletter.js) is a vanilla JavaScript class-based component that:
- Creates subscription forms for both main content and footer
- Uses a hidden iframe submission method to bypass CORS restrictions when calling Substack API
- Implements form validation, loading states, and success/error messaging
- Handles both `#newsletter-subscription` and `#footer-newsletter-subscription` containers

#### Substack Integration
The substack.js module:
- Fetches latest post from lucandjeremi.substack.com RSS feed via rss2json.com API
- Implements localStorage caching to reduce API calls and improve performance
- Compares publication dates to determine if cache should be updated
- Displays post title, link, and formatted date (MM/DD format)

### Design System
- All text uses uniform 1rem font size (including headings)
- Bold/heading text uses #000000, body text uses #6a6a6a
- CSS variables defined in :root for colors, spacing, typography, and layout
- Mobile-first responsive design with breakpoints at 768px and 480px
- Newsletter components use gray button styling (#f0f0f0) with hover states

## Development Workflow

### Local Development
Since this is a static site, simply:
1. Open index.html or essay.html directly in a browser, or
2. Run a local server: `python3 -m http.server 8000` or `npx serve`

### Testing Newsletter Integration
Use the debug function in browser console:
```javascript
window.testNewsletterAPI("test@example.com")
```

### Deployment
The site is hosted on GitHub Pages:
- Push changes to the main branch to deploy
- The CNAME file ensures the custom domain (lucaviness.com) routes correctly
- No build process required - all files are served directly

### Git Workflow
- Main branch: production (auto-deploys to GitHub Pages)
- Develop branch: current working branch for staging changes
- Recent commits show iterative design refinements (fonts, spacing, newsletter integration)

## Important Notes

- No package.json or build tools - this is pure HTML/CSS/JS
- The Substack API endpoint (lucandjeremi.substack.com/api/v1/free) is accessed via iframe form submission to avoid CORS issues
- RSS feed is accessed via rss2json.com proxy to avoid CORS restrictions
- Static assets are in the files/ directory (favicon, images)
- All external links use target="_blank" with rel="noopener noreferrer" for security
