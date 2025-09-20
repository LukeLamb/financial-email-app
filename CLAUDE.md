# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a desktop financial email processing application built with Electron and React. The app processes Belgian financial emails (primarily from Bolero, KBC, and other financial institutions) and is designed to integrate with AI for email analysis and translation.

## Development Commands

- `npm start` - Run the Electron app in production mode
- `npm run dev` - Run Electron with DevTools enabled (--dev flag)
- `npm run build-react` - Build React components using Webpack (development mode)
- `npm run watch-react` - Build React in watch mode (auto-rebuild on changes)
- `npm run dev-full` - Run both watch-react and dev concurrently

## Architecture

### Main Process (Electron)

- `src/main.js` - Electron main process that creates the desktop window (1200x800)
- Uses `nodeIntegration: true` and `contextIsolation: false` for direct Node.js access

### Renderer Process (React)

- `src/renderer/App.jsx` - Main React component with email list and processing UI
- `src/renderer/index.html` - HTML shell that loads the bundled React app
- `src/renderer/styles.css` - CSS styling with financial app theme
- `src/renderer/dist/app.js` - Webpack-built bundle (generated)

### Build System

- `webpack.config.js` - Configures React JSX compilation with Babel
- Entry point: `src/renderer/App.jsx`
- Output: `src/renderer/dist/app.js`
- Target: `electron-renderer`

## Current State

The app currently displays sample Belgian financial emails and simulates AI processing. Key features implemented:

- Email list with selection functionality
- Email detail view
- Simulated AI processing with 2-second delay
- Modern financial dashboard UI with gradients

## Next Steps (from documentation)

The guides indicate planned integration of:

1. Gmail API for real email data
2. Ollama AI for actual Dutch/English translation
3. Real-time email processing

## Development Workflow

1. Make React changes in `src/renderer/`
2. Run `npm run build-react` or `npm run watch-react`
3. Run `npm run dev` to test in Electron with DevTools
4. The app auto-opens DevTools when `--dev` flag is present

## File Structure

```bash
financial-email-app/
├── src/
│   ├── main.js              # Electron main process
│   └── renderer/
│       ├── App.jsx          # Main React component
│       ├── index.html       # HTML shell
│       ├── styles.css       # App styling
│       └── dist/            # Webpack build output
├── webpack.config.js        # React build configuration
├── package.json            # Dependencies and scripts
└── icons/                  # App icons (referenced but not analyzed)
```
