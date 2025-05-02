import process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import * as Sentry from '@sentry/electron';
import {
	app,
	ipcMain,
	autoUpdater,
	nativeImage,
	dialog,
	Tray,
	BrowserWindow,
	Menu,
} from 'electron';
import electronSquirrelStartup from 'electron-squirrel-startup';
import {
	updateElectronApp,
	makeUserNotifier,
	UpdateSourceType,
} from 'update-electron-app';

import { Bookmark, BookmarkStore } from './core';

Sentry.init({
	dsn: 'https://713782327975276ae010040b1db6ab8a@o4507887084503040.ingest.us.sentry.io/4507887098724352',
});

updateElectronApp({
	updateSource: {
		type: UpdateSourceType.ElectronPublicUpdateService,
		host: 'https://update.electronjs.org',
		repo: 'ailtonloures/vscode-bookmark',
	},
	onNotifyUser: makeUserNotifier({
		title: 'VSCode Bookmark Update',
	}),
});

makeApp(async () => {
	registerStartupConfig();

	await app.whenReady();

	const context = createAppContext();

	registerAutoUpdaterEvents(context);
	registerIpcMainEvents(context);
	registerAppEvents(context);
	registerStoreEvents(context);

	renderApp(context);
});

/**
 * Types
 *
 * @typedef AppContext
 * @type {object}
 * @property {Electron.Tray} tray
 * @property {Electron.BrowserWindow} win
 * @property {BookmarkStore} store
 */

/**
 * Create an App on a single instance
 * @param {() => Promise<void>} fn
 */
function makeApp(fn) {
	const hasSecondInstance = !app.requestSingleInstanceLock();
	const hasSquirrelInstance = electronSquirrelStartup;

	if (hasSecondInstance || hasSquirrelInstance) app.quit();

	fn();
}

/**
 * Register the Startup configuration
 */
function registerStartupConfig() {
	if (app.isPackaged) {
		app.setLoginItemSettings({
			openAtLogin: true,
		});
	}
}

/**
 * Create and configure the context
 * @returns {AppContext}
 */
function createAppContext() {
	const tray = createTray();
	const win = createWindow();
	const store = createStore();

	return { tray, win, store };
}

/**
 * Register the Auto Updater Events
 * @param {AppContext} context
 */
function registerAutoUpdaterEvents(context) {
	autoUpdater.on('before-quit-for-update', () => {
		destroyApp(context);
	});
}

/**
 * Register the IPC Events
 * @param {AppContext} context
 */
function registerIpcMainEvents(context) {
	const { store } = context;

	ipcMain.on('save-bookmark', (event, path) => {
		const bookmark = Bookmark.create(path);

		store.save(bookmark);
		event.reply('save-bookmark', 'OK');
	});
}

/**
 * Register the App Events
 * @param {AppContext} context
 */
function registerAppEvents(context) {
	const { tray, win } = context;

	tray.on('click', () => tray.popUpContextMenu());

	win.on('close', (event) => {
		event.preventDefault();
		win.hide();
	});
}

/**
 * Register the Store Events
 * @param {AppContext} context
 */
function registerStoreEvents(context) {
	const { store } = context;

	fs.watch(
		store.path,
		{
			recursive: false,
		},
		() => {
			renderApp(context);
		}
	);
}

/**
 * Renders a context menu in the tray app
 * @param {AppContext} context
 */
function renderApp(context) {
	const { tray, win, store } = context;

	/**
	 * Create the menu item to add bookmarks
	 * @param {string} label
	 * @param {Electron.OpenDialogOptions['properties']} properties
	 * @returns {Electron.MenuItem}
	 */
	const bookmarkAddMenuItem = (label, properties) => ({
		label,
		type: 'normal',
		click: async () => {
			const { canceled, filePaths } = await dialog.showOpenDialog({
				properties,
			});

			if (canceled) return;

			const bookmark = Bookmark.create(filePaths.at(0));

			store.save(bookmark);
		},
	});

	/**
	 * A list of menu items from bookmarks
	 * @type {Array<Electron.MenuItem>}
	 */
	const bookmarkListMenuItem = store.get().map((bookmark) => ({
		label: bookmark.remotePath
			? `${bookmark.basename} (remote)`
			: bookmark.basename,
		submenu: [
			{
				label: 'Open',
				click: () => {
					if (bookmark.remotePath) {
						if (fs.statSync(bookmark.path).isFile()) {
							openEditor(bookmark.remotePath, ['--file-uri']);
							return;
						}

						openEditor(bookmark.remotePath, ['--folder-uri']);
						return;
					}

					openEditor(bookmark.path);
				},
			},
			{
				label: 'Remove',
				click: () => {
					store.remove(bookmark.id);
				},
			},
		],
	}));

	const contextMenu = createMenu([
		{
			label: 'Add by drag and drop',
			type: 'normal',
			click: () => {
				win.show();
				win.focus();
			},
		},
		bookmarkAddMenuItem('Add project', ['openDirectory']),
		bookmarkAddMenuItem('Add file', ['openFile']),
		{ type: 'separator' },
		...bookmarkListMenuItem,
		{ type: 'separator' },
		{
			label: 'Settings',
			click: () => {
				openEditor(store.path);
			},
		},
		{
			label: 'Quit',
			click: () => {
				destroyApp(context);
			},
		},
	]);

	tray.setContextMenu(contextMenu);
}

/**
 * Destroy the App and context
 * @param {AppContext} context
 */
function destroyApp(context) {
	const { tray, win } = context;

	tray.closeContextMenu();

	win.removeAllListeners('close');
	win.close();

	app.quit();
}

/**
 * Returns the formatted App label
 * @returns {string}
 */
function getLabel() {
	return `${app.getName()} - v${app.getVersion()}`;
}

/**
 * Returns an App icon by iconName
 * @param {string} iconName
 * @returns {Electron.NativeImage}
 */
function getIcon(iconName) {
	return nativeImage.createFromPath(
		path.resolve(__dirname, 'icons', 'main', iconName)
	);
}

/**
 * Create and configure a Electron Tray
 * @returns {Electron.Tray}
 */
function createTray() {
	const icon = getIcon('tray-icon.png');
	const label = getLabel();

	const tray = new Tray(icon);
	tray.setToolTip(label);

	return tray;
}

/**
 * Create and configure a Electron Window
 * @returns {Electron.BrowserWindow}
 */
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
			preload: path.resolve(__dirname, 'preload.js'),
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
		win.loadFile(path.resolve(__dirname, 'index.html'));
	}

	return win;
}

/**
 * Create a Electron Menu from menu items template
 * @param {Array<Electron.MenuItem>} menuItems
 * @returns {Electron.Menu}
 */
function createMenu(menuItems = []) {
	return Menu.buildFromTemplate(menuItems);
}

/**
 * Create the BookmarkStore
 * @returns {BookmarkStore}
 */
function createStore() {
	return new BookmarkStore();
}

/**
 * Open bookmark path into Visual Studio Code
 * @param {string} path
 * @param {Array<string>} args
 */
function openEditor(path, args = []) {
	process.spawn('code', [...args, `"${path}"`], { shell: true });
}
