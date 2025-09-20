# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Financial Email Assistant - a desktop application built with Electron + React that processes Belgian financial emails using local AI (Ollama) for Dutch-to-English translation and analysis.

## Development Commands

- `npm start` - Run the Electron app in production mode
- `npm run dev` - Run Electron with DevTools enabled (--dev flag)
- `npm run build-react` - Build React components using Webpack (development mode)
- `npm run watch-react` - Build React in watch mode (auto-rebuild on changes)
- `npm run dev-full` - Run both watch-react and dev concurrently

## Architecture Overview

### Main Process (Electron)

- `src/main.js` - Electron main process that creates the desktop window (1200x800)
- Uses `nodeIntegration: true` and `contextIsolation: false` for direct Node.js access
- Auto-opens DevTools when `--dev` flag is present

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

## Current Implementation

The app currently displays sample Belgian financial emails (Bolero, KBC) and simulates AI processing. Key features:

- Email list with selection functionality using React state management
- Email detail view with processing simulation (2-second delay)
- Modern financial dashboard UI with gradients and responsive design

## Development Workflow

1. Make React changes in `src/renderer/`
2. Run `npm run build-react` or `npm run watch-react` to compile
3. Run `npm run dev` to test in Electron with DevTools
4. React state is managed with useState hooks for email selection and processing status

## Planned Integrations

Next steps include Gmail API for real email data and Ollama AI for actual Dutch/English translation processing.

## File Structure Context

```bash
financial-email-app/
├── src/
│   ├── main.js              # Electron main process
│   └── renderer/
│       ├── App.jsx          # Main React component with email state
│       ├── index.html       # HTML shell
│       ├── styles.css       # Modern financial UI styling
│       └── dist/            # Webpack build output
├── webpack.config.js        # React build configuration
├── package.json            # Dependencies and npm scripts
└── icons/                  # App icons and branding
```
