const { app, BrowserWindow } = require('electron');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
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

    console.log('Financial Email App window created successfully!');
}

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
