# Financial Email Assistant - Development Guide

This file provides context to Claude Code when working with this repository.

## Project Overview

A desktop application built with Electron + React that processes Belgian financial emails using Gmail API integration and local AI (Ollama) for Dutch-to-English translation and analysis.

## Current Status

✅ **Step 1**: Basic Electron app with beautiful gradient interface
✅ **Step 2**: React integration with interactive email dashboard
✅ **Step 3**: Gmail API integration with real email data and OAuth authentication
✅ **Step 4**: Ollama AI processing integration with Dutch-to-English translation
✅ **Step 5**: Real-time email analysis and financial insights
🎉 **Core Application Complete**: Production-ready financial email processor!  

## Development Commands

- `npm start` - Run the Electron app
- `npm run dev` - Run with DevTools enabled  
- `npm run build-react` - Build React components with Webpack
- `npm run watch-react` - Auto-rebuild React on changes
- `node exchange-token.js` - Manual OAuth token exchange (if needed)

## Architecture

### Main Process (Electron)

- `src/main.js` - Creates desktop window, handles IPC for Gmail API and Ollama AI
- `src/preload.js` - Secure bridge between main and renderer processes
- `src/gmail-client.js` - Gmail API integration with OAuth authentication
- `src/ollama-client.js` - Ollama AI integration for email translation and analysis

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
- ✅ Ollama AI integration with Dutch-to-English translation
- ✅ Multiple AI processing modes (translate, summarize, both)
- ✅ Enhanced financial analysis with sentiment scoring
- ✅ Investment insights and stock mention detection
- ✅ Dynamic Ollama model selection and connection status

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

## Application Status: Core Features Complete

Both Gmail and Ollama integrations are complete and working. The app now provides:

- ✅ Real Gmail email processing from Belgian financial institutions
- ✅ Local Ollama AI translation (Dutch-to-English)
- ✅ Financial content analysis and summarization with structured insights
- ✅ Investment recommendation extraction and sentiment analysis
- ✅ Professional UI with rich AI result display

**Next development focus:** User experience enhancements, performance optimization, and advanced features like portfolio integration.

## File Structure

```bash
financial-email-app/
├── src/
│   ├── main.js              # Electron main + IPC handlers for Gmail & Ollama
│   ├── preload.js           # Secure IPC bridge
│   ├── gmail-client.js      # Gmail API integration
│   ├── ollama-client.js     # Ollama AI integration
│   ├── credentials/         # OAuth credentials (gitignored)
│   └── renderer/
│       ├── App.jsx          # React app with Gmail & Ollama integration
│       ├── index.html       # Entry point
│       ├── styles.css       # Modern financial UI with AI result display
│       └── dist/            # Webpack output
├── webpack.config.js        # React build config
├── exchange-token.js        # OAuth token helper (gitignored)
└── Documentation files
```

## Important Notes for Claude Code

- Always rebuild React with `npm run build-react` after renderer changes
- Gmail API and Ollama AI calls go through IPC (main process) for security
- Credentials are gitignored - never commit sensitive OAuth data
- App uses real Gmail data and live Ollama AI processing
- Authentication state is managed in React with proper error handling
- Manual token exchange is available if OAuth redirect fails
- Ollama must be running locally on port 11434 for AI features to work
- AI processing supports multiple models and modes (translate/summarize/both)

The foundation is solid - real desktop app with live Gmail integration and AI processing!
