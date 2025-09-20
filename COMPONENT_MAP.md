# Component Map & Architecture

## Application Structure

### Main Process (Electron)

```bash
src/main.js
├── Creates BrowserWindow (1200x800)
├── Loads src/renderer/index.html
├── Handles window lifecycle events
└── Configures development tools
```

### Renderer Process (React)

```bash
src/renderer/
├── index.html (Entry point, loads dist/app.js)
├── App.jsx (Main React component)
├── styles.css (Modern financial UI styling)
└── dist/app.js (Webpack build output)
```

## React Component Architecture

### App.jsx - Main Application Component

```javascript
function FinancialEmailApp() {
  // State Management
  const [emails, setEmails] = useState([])           // Email list data
  const [selectedEmail, setSelectedEmail] = useState(null)  // Currently selected
  const [isProcessing, setIsProcessing] = useState(false)   // AI processing state
  
  // Sample Data (to be replaced with Gmail API)
  const sampleEmails = [...]
  
  // Event Handlers
  const handleEmailSelect = (email) => {...}         // Email selection
  const handleProcessEmail = async () => {...}       // AI processing trigger
  
  // Effects
  useEffect(() => {...}, [])                         // Load emails on mount
  
  // Render Structure
  return (
    <div className="app">
      <header className="app-header">               // Title and branding
      <div className="app-content">                 // Main content grid
        <div className="email-list">                // Left panel - email list
        <div className="email-details">             // Right panel - email details
      <footer className="app-footer">               // Status information
    )
}
```

## State Flow

### Email Selection Flow

1. User clicks email in list
2. `handleEmailSelect(email)` called
3. `setSelectedEmail(email)` updates state
4. Right panel re-renders with email details
5. CSS class `.selected` applied to email item

### AI Processing Flow (Current Simulation)

1. User clicks "Process with AI" button
2. `handleProcessEmail()` called
3. `setIsProcessing(true)` disables button
4. 2-second timeout simulates AI processing
5. Alert shows processing complete
6. `setIsProcessing(false)` re-enables button

## CSS Architecture

### Design System

- **Colors**: Dark theme with blue gradients (#1a1a2e, #667eea, #764ba2)
- **Typography**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
- **Layout**: CSS Grid for main content, Flexbox for components
- **Effects**: backdrop-filter, box-shadow, gradients for depth

### Component Styles

- `.app` - Main container with gradient background
- `.email-list` - Left panel with scrollable email items
- `.email-item` - Individual email cards with hover effects
- `.email-details` - Right panel for selected email content
- `.process-btn` - AI processing button with gradient background

## Data Structures

### Email Object Structure

```javascript
{
  id: number,                    // Unique identifier
  subject: string,               // Email subject line
  from: string,                  // Sender information
  date: string,                  // Date in YYYY-MM-DD format
  preview: string,               // Email content preview
  isFinancial: boolean           // Flag for financial emails
}
```

## Build System

### Webpack Configuration

- **Entry**: `src/renderer/App.jsx`
- **Output**: `src/renderer/dist/app.js`
- **Loaders**:
  - `babel-loader` for JSX transformation
  - `style-loader` + `css-loader` for CSS processing
- **Target**: `electron-renderer` for Electron compatibility

### Build Commands

- `npm run build-react` - Single build
- `npm run watch-react` - Watch mode for development
- `npm start` - Run Electron app

## Integration Points (Planned)

### Gmail API Integration

- Replace `sampleEmails` with real Gmail API calls
- Add authentication flow for Google OAuth
- Implement email filtering for financial content
- Add real-time email fetching

### Ollama AI Integration

- Replace `handleProcessEmail` simulation with real AI calls
- Add Dutch-to-English translation
- Implement email content analysis
- Add AI response display in email details panel

### State Management Evolution

- Current: Local component state with useState
- Future: Context API or Redux for complex state
- Email cache management
- AI processing queue management

## Performance Considerations

### Current Optimizations

- React key props for efficient list rendering
- CSS transitions for smooth animations
- Efficient re-rendering with proper state updates

### Future Optimizations

- Virtual scrolling for large email lists
- Email content lazy loading
- AI processing background threads
- Caching strategies for processed emails
