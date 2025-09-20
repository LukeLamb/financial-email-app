const { contextBridge, ipcRenderer } = require('electron');

// Expose Gmail API functions to renderer process securely
contextBridge.exposeInMainWorld('gmailAPI', {
    // Initialize Gmail client
    initialize: () => ipcRenderer.invoke('gmail:initialize'),
    
    // Get OAuth URL for authentication
    getAuthUrl: () => ipcRenderer.invoke('gmail:getAuthUrl'),
    
    // Set authentication code from OAuth flow
    setAuthCode: (code) => ipcRenderer.invoke('gmail:setAuthCode', code),
    
    // Get financial emails
    getFinancialEmails: (maxResults) => ipcRenderer.invoke('gmail:getFinancialEmails', maxResults),
    
    // Search emails with custom query
    searchEmails: (query, maxResults) => ipcRenderer.invoke('gmail:searchEmails', query, maxResults),
    
    // Get user profile information
    getUserProfile: () => ipcRenderer.invoke('gmail:getUserProfile')
});

// Expose Ollama AI functions to renderer process securely
contextBridge.exposeInMainWorld('ollamaAPI', {
    // Check Ollama connection and get available models
    checkConnection: () => ipcRenderer.invoke('ollama:checkConnection'),
    
    // Get available Ollama models
    getModels: () => ipcRenderer.invoke('ollama:getModels'),
    
    // Set the model to use for AI processing
    setModel: (modelName) => ipcRenderer.invoke('ollama:setModel', modelName),
    
    // Process email with AI (translate, summarize, or both)
    processEmail: (emailData, mode) => ipcRenderer.invoke('ollama:processEmail', emailData, mode),
    
    // Translate email content
    translateEmail: (content, fromLang, toLang) => ipcRenderer.invoke('ollama:translateEmail', content, fromLang, toLang),
    
    // Summarize and analyze email content
    summarizeEmail: (content, language) => ipcRenderer.invoke('ollama:summarizeEmail', content, language)
});

console.log('🔗 Gmail API bridge loaded');
console.log('🤖 Ollama AI bridge loaded');
