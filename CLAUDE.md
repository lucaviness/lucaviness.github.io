---
description: 
alwaysApply: true
---

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal website for lucaviness.com, hosted on GitHub Pages. The site is a simple, clean portfolio/blog featuring:
- A personal introduction and bio
- Flying/aviation section
- Essay pages (currently one essay: "Re: Summer 2025")

## Architecture

### Core Structure
- **index.html**: Main landing page with header, newsletter section, flying section, and footer
- **essay.html**: Template for essay posts with back navigation
- **css/style.css**: Main stylesheet with CSS variables and mobile-responsive design
- **css/essay.css**: Additional styles for essay pages

### Design System
- All text uses uniform 1rem font size (including headings)
- Bold/heading text uses #000000, body text uses #6a6a6a
- CSS variables defined in :root for colors, spacing, typography, and layout
- Mobile-first responsive design with breakpoints at 768px and 480px
- **Always use sharp corners (border-radius: 0)** — no rounded corners anywhere on the site

## Development Workflow

### Local Development
Since this is a static site, simply:
1. Open index.html or essay.html directly in a browser, or
2. Run a local server: `python3 -m http.server 8000` or `npx serve`

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

- No package.json or build tools - this is pure HTML/CSS
- Static assets are in the files/ directory (favicon, images)
- All external links use target="_blank" with rel="noopener noreferrer" for security
