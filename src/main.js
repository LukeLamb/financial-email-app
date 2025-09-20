const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const GmailClient = require('./gmail-client');

// Keep a global reference of the window object
let mainWindow;
let gmailClient;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,  // Security best practice
            contextIsolation: true,  // Security best practice
            preload: path.join(__dirname, 'preload.js')  // We'll create this
        },
        icon: path.join(__dirname, '../icons/neurotrader_icon.png'),
        title: 'Financial Email Assistant'
    });

    // Load the HTML file
    mainWindow.loadFile('src/renderer/index.html');

    // Open DevTools in development
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    // Handle window closed
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // Initialize Gmail client
    gmailClient = new GmailClient();

    console.log('Financial Email App window created successfully!');
}

// IPC Handlers for Gmail API

ipcMain.handle('gmail:initialize', async () => {
    try {
        const success = await gmailClient.initialize();
        return { success };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('gmail:getAuthUrl', async () => {
    try {
        const authUrl = await gmailClient.getAccessToken();
        return { success: true, authUrl };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('gmail:setAuthCode', async (event, code) => {
    try {
        const success = await gmailClient.setAuthCode(code);
        return { success };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('gmail:getFinancialEmails', async (event, maxResults = 10) => {
    try {
        const emails = await gmailClient.getFinancialEmails(maxResults);
        return { success: true, emails };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('gmail:searchEmails', async (event, query, maxResults = 20) => {
    try {
        const emails = await gmailClient.searchEmails(query, maxResults);
        return { success: true, emails };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('gmail:getUserProfile', async () => {
    try {
        const profile = await gmailClient.getUserProfile();
        return { success: true, profile };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// On macOS, re-create window when dock icon is clicked
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

console.log('Financial Email App starting...');
