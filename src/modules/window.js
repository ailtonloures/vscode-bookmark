import { app, BrowserWindow, nativeImage } from 'electron/main';
import { resolve } from 'node:path';

function getIndexHtmlPath() {
	return resolve(import.meta.dirname, '..', '..', 'ui', 'index.html');
}

function getPreloadScriptPath() {
	return resolve(import.meta.dirname, '..', 'preload.cjs');
}

function getIcon() {
	return nativeImage.createFromPath(
		resolve(
			import.meta.dirname,
			'..',
			'..',
			'assets',
			'icons',
			'png',
			'win-icon.png'
		)
	);
}

function getLabel() {
	return app.getName();
}

function createWindow() {
	const win = new BrowserWindow({
		width: 380,
		height: 400,
		autoHideMenuBar: true,
		maximizable: false,
		resizable: false,
		fullscreen: false,
		fullscreenable: false,
		title: getLabel(),
		icon: getIcon(),
		webPreferences: {
			preload: getPreloadScriptPath(),
			contextIsolation: true,
			sandbox: true,
		},
	});

	win.loadFile(getIndexHtmlPath());

	if (!app.isPackaged) {
		setTimeout(() => {
			win.webContents.openDevTools({
				mode: 'detach',
				activate: true,
			});
		}, 1000);
	}

	return win;
}

export { createWindow };
