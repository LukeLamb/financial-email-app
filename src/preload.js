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

console.log('🔗 Gmail API bridge loaded');
