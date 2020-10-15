const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain} = electron
const url = require('url');
const path = require('path');
var Tesseract = require('tesseract.js');
var fs = require('fs');

/*
* OCR Scanner with GUI using the tesseract package.
*
* @author CuzImPeter
* @github peter12908
* @date 15.10.2020
*/

let mainWindow

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 750,
    height: 650
  })

  // Load the index.html file
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.setMenu(null)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

ipcMain.on('convert', function(e, image){
  e.sender.send('get_result', "Loading...\nPlease be Patient")
  Tesseract.recognize(
    image,
    'eng',
    'stdout'
  ).then(({ data: { text } }) => {
    e.sender.send('get_result', text)
  })
});

// Create the window then the app is ready
app.on('ready', () => {
  createWindow()
  electron.powerMonitor.on('on-ac', () => {
    mainWindow.restore()
  })
  electron.powerMonitor.on('on-battery', () => {
    mainWindow.minimize()
  })
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Reopen the app on macOS
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
