# Financial Email Assistant - Development Guide

This file provides context to Claude Code when working with this repository.

## Project Overview

A desktop application built with Electron + React that processes Belgian financial emails using Gmail API integration and local AI (Ollama) for Dutch-to-English translation and analysis.

## Current Status

✅ **Step 1**: Basic Electron app with beautiful gradient interface  
✅ **Step 2**: React integration with interactive email dashboard  
✅ **Step 3**: Gmail API integration with real email data and OAuth authentication  
🔄 **Step 4**: Ollama AI processing integration (next priority)  
🔄 **Step 5**: Real-time email analysis and translation  

## Development Commands

- `npm start` - Run the Electron app
- `npm run dev` - Run with DevTools enabled  
- `npm run build-react` - Build React components with Webpack
- `npm run watch-react` - Auto-rebuild React on changes
- `node exchange-token.js` - Manual OAuth token exchange (if needed)

## Architecture

### Main Process (Electron)

- `src/main.js` - Creates desktop window, handles IPC for Gmail API
- `src/preload.js` - Secure bridge between main and renderer processes
- `src/gmail-client.js` - Gmail API integration with OAuth authentication

### Renderer Process (React)  

- `src/renderer/App.jsx` - Main React component with Gmail integration
- `src/renderer/index.html` - Entry point that loads bundled React
- `src/renderer/styles.css` - Modern financial dashboard styling
- `src/renderer/dist/app.js` - Webpack-compiled bundle

### Security & Credentials

- `src/credentials/credentials.json` - OAuth client credentials (gitignored)
- `src/credentials/token.json` - Access tokens (auto-generated, gitignored)
- Uses contextIsolation and secure IPC for Gmail API calls

## Current Features

- ✅ Gmail OAuth 2.0 authentication flow
- ✅ Real financial email filtering (Bolero, KBC, ING, Belfius)
- ✅ Email list with selection and details view
- ✅ User profile display and email statistics
- ✅ Modern responsive UI with authentication screens
- ✅ Email refresh functionality
- 🔄 AI processing simulation (ready for Ollama integration)

## Development Workflow

1. React changes in `src/renderer/` → `npm run build-react`
2. Electron changes in `src/main.js` → restart with `npm start`
3. Gmail API changes in `src/gmail-client.js` → rebuild and restart
4. For OAuth issues → use `exchange-token.js` with fresh auth code

## Gmail Integration Details

- Filters emails from Belgian financial institutions
- Subject-based detection for market/investment content
- Full email content parsing with preview generation
- Automatic token refresh handling
- Error handling for network/authentication issues

## Next Priority: Ollama AI Integration

The Gmail integration is complete and working. Next step is connecting to local Ollama for:

- Dutch-to-English email translation
- Financial content analysis and summarization
- Investment recommendation extraction
- Market sentiment analysis

## File Structure

```bash
financial-email-app/
├── src/
│   ├── main.js              # Electron main + IPC handlers
│   ├── preload.js           # Secure IPC bridge
│   ├── gmail-client.js      # Gmail API integration
│   ├── credentials/         # OAuth credentials (gitignored)
│   └── renderer/
│       ├── App.jsx          # React app with Gmail integration
│       ├── index.html       # Entry point
│       ├── styles.css       # Modern financial UI
│       └── dist/            # Webpack output
├── webpack.config.js        # React build config
├── exchange-token.js        # OAuth token helper (gitignored)
└── Documentation files
```

## Important Notes for Claude Code

- Always rebuild React with `npm run build-react` after renderer changes
- Gmail API calls go through IPC (main process) for security
- Credentials are gitignored - never commit sensitive OAuth data
- App uses real Gmail data now, not sample emails
- Authentication state is managed in React with proper error handling
- Manual token exchange is available if OAuth redirect fails

The foundation is solid - real desktop app with live Gmail integration. Ready for AI features!
