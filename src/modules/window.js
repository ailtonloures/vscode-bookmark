import { app, BrowserWindow, nativeImage } from 'electron';
import { resolve } from 'node:path';

function getIcon() {
	return nativeImage.createFromPath(
		resolve(app.getAppPath(), 'assets', 'icons', 'main', 'win-icon.png')
	);
}

function getLabel() {
	return app.getName();
}

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
		icon: getIcon(),
		webPreferences: {
			preload: resolve(__dirname, 'preload.js'),
			contextIsolation: true,
			sandbox: true,
		},
	});

	// eslint-disable-next-line no-undef
	const devURL = MAIN_WINDOW_VITE_DEV_SERVER_URL;

	if (devURL) {
		win.loadURL(devURL);
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
