import { app, BrowserWindow, nativeImage } from 'electron';
import { resolve } from 'node:path';

function getIndexHtmlPath() {
	return resolve(__dirname, '..', '..', 'ui', 'index.html');
}

function getPreloadScriptPath() {
	return resolve(__dirname, 'preload.js');
}

function getIcon() {
	return nativeImage.createFromPath(
		resolve(__dirname, '..', '..', 'assets', 'icons', 'png', 'win-icon.png')
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
			preload: getPreloadScriptPath(),
			contextIsolation: true,
			sandbox: true,
		},
	});

	// eslint-disable-next-line no-undef
	const devURL = MAIN_WINDOW_VITE_DEV_SERVER_URL;

	if (devURL) {
		win.loadURL(devURL);

		setTimeout(() => {
			win.webContents.openDevTools({
				mode: 'detach',
				activate: true,
			});
		}, 1000);
	} else {
		win.loadFile(getIndexHtmlPath());
	}

	return win;
}

export { createWindow };
