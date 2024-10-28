import { BrowserWindow } from 'electron';
import { resolve } from 'node:path';

import { devURL, getIcon, getLabel, isDevMode } from './utils';

function createWindow() {
	const win = new BrowserWindow({
		width: 380,
		height: 330,
		show: false,
		autoHideMenuBar: true,
		maximizable: false,
		resizable: false,
		fullscreen: false,
		fullscreenable: false,
		focusable: true,
		title: getLabel(),
		icon: getIcon('win-icon.png'),
		webPreferences: {
			preload: resolve(__dirname, 'preload.js'),
			contextIsolation: true,
			sandbox: true,
		},
	});

	if (isDevMode()) {
		win.loadURL(devURL());
		win.webContents.openDevTools({
			mode: 'detach',
			activate: true,
		});
	} else {
		win.loadFile(resolve(__dirname, 'index.html'));
	}

	return win;
}

export { createWindow };
