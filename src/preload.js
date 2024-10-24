import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
	web: webUtils,
	ipc: {
		toMain: (channel, ...args) => ipcRenderer.send(channel, ...args),
		onRenderer: (channel, callback) => ipcRenderer.on(channel, callback),
	},
});
