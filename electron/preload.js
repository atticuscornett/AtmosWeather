const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    updateNow: () => ipcRenderer.send('updateNow')
})