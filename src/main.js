import { spawn } from 'node:child_process';
import { statSync } from 'node:fs';
import { resolve, basename } from 'node:path';

import * as Sentry from '@sentry/electron';
import {
	app,
	ipcMain,
	nativeImage,
	dialog,
	Tray,
	BrowserWindow,
	Menu,
} from 'electron';
import electronSquirrelStartup from 'electron-squirrel-startup';
import ElectronStore from 'electron-store';
import {
	updateElectronApp,
	makeUserNotifier,
	UpdateSourceType,
} from 'update-electron-app';

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

/**
 * Types
 *
 * @typedef AppContext
 * @type {object}
 * @property {Electron.Tray} tray
 * @property {Electron.BrowserWindow} win
 * @property {Store} store
 *
 * @typedef Store
 * @type {object}
 * @property {string} path
 * @property {(bookmark: Bookmark) => void} saveBookmark
 * @property {() => Array<Bookmark>} getBookmarks
 * @property {(id: Bookmark['id']) => void} removeBookmark
 *
 * @typedef Bookmark
 * @type {object}
 * @property {number} id
 * @property {string} path
 * @property {string} basename
 * @property {boolean} wsl
 */

makeApp(async () => {
	if (app.isPackaged) {
		app.setLoginItemSettings({
			openAtLogin: true,
		});
	}

	await app.whenReady();

	const context = createAppContext();

	registerIpcMainEvents(context);
	registerAppEvents(context);

	renderContextMenu(context);
});

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
 * Register the IPC Events
 * @param {AppContext} context
 */
function registerIpcMainEvents(context) {
	const {
		store: { saveBookmark },
	} = context;

	ipcMain.on('save-bookmark', (event, path) => {
		const bookmark = createBookmark(path);

		saveBookmark(bookmark);
		renderContextMenu(context);

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
 * Renders a context menu in the tray app
 * @param {AppContext} context
 */
function renderContextMenu(context) {
	const {
		tray,
		win,
		store: { path: storePath, removeBookmark, getBookmarks, saveBookmark },
	} = context;

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

			const bookmark = createBookmark(filePaths.at(0));

			saveBookmark(bookmark);
			renderContextMenu(context);
		},
	});

	/**
	 * A list of menu items from bookmarks
	 * @type {Array<Electron.MenuItem>}
	 */
	const bookmarkListMenuItem = getBookmarks().map((bookmark) => ({
		label: bookmark.wsl ? `[WSL] ${bookmark.basename}` : bookmark.basename,
		submenu: [
			{
				label: 'Open',
				click: () => {
					if (bookmark.wsl) {
						if (statSync(bookmark.path).isFile()) {
							openVsCode(bookmark.wsl.remotePath, ['--file-uri']);
							return;
						}

						openVsCode(bookmark.wsl.remotePath, ['--folder-uri']);
						return;
					}

					openVsCode(bookmark.path);
				},
			},
			{
				label: 'Remove',
				click: () => {
					removeBookmark(bookmark.id);
					renderContextMenu(context);
				},
			},
		],
	}));

	const contextMenu = createMenu([
		{
			label: 'Add project by drag and drop',
			type: 'normal',
			click: async () => {
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
				openVsCode(storePath);
			},
		},
		{
			label: 'Quit',
			click: () => {
				win.removeAllListeners('close');
				win.close();
				app.quit();
			},
		},
	]);

	tray.setContextMenu(contextMenu);
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
		resolve(__dirname, 'icons', 'main', iconName)
	);
}

/**
 * Create and configure a Electron Tray object
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
 * Create and configure a Electron Window object
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

/**
 * Create a Electron Menu object from menu items template
 * @param {Array<Electron.MenuItem>} menuItems
 * @returns {Electron.Menu}
 */
function createMenu(menuItems = []) {
	return Menu.buildFromTemplate(menuItems);
}

/**
 * Create and configure the ElectronStore instance and returns store bookmark functions
 * @returns {Store}
 */
function createStore() {
	const storeName = 'bookmarks';
	const store = new ElectronStore({
		[storeName]: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					id: { type: 'number' },
					path: { type: 'string' },
					basename: { type: 'string' },
					wsl: { type: 'boolean' },
				},
				required: ['id', 'path', 'basename'],
			},
		},
	});

	/**
	 * Save bookmark into Store
	 * @param {Pick<Bookmark, 'path' | 'wsl'>} bookmark
	 */
	const saveBookmark = ({ path, wsl }) => {
		store.set(storeName, [
			{
				id: new Date().getTime(),
				basename: basename(path),
				path,
				wsl,
			},
			...getBookmarks(),
		]);
	};

	/**
	 * Fetch bookmark list from Store
	 * @returns {Array<Bookmark>}
	 */
	const getBookmarks = () => {
		return store.get(storeName) || [];
	};

	/**
	 * Remove bookmark by id from Store
	 * @param {Bookmark['id']} id
	 */
	const removeBookmark = (id) => {
		const filteredBookmarkList = getBookmarks().filter(
			(bookmark) => bookmark.id !== id
		);

		store.set(storeName, filteredBookmarkList);
	};

	return {
		path: store.path,
		saveBookmark,
		getBookmarks,
		removeBookmark,
	};
}

/**
 * Creates the bookmark object from the file path and adapts the path to a remote path in cases of WSL origin
 * @param {string} path
 * @returns {Pick<Bookmark, 'path' | 'wsl'>}
 */
function createBookmark(path) {
	/**
	 * Check if the path is WSL
	 * @param {string} path
	 * @returns {boolean}
	 */
	const isWslPath = (path) => path.startsWith('\\\\wsl');

	if (isWslPath(path)) {
		/**
		 * Sanitize and format the WSL path to open correctly in Visual Studio Code
		 * @param {string} path
		 * @returns {string}
		 */
		const getWslPath = (path) => {
			const sanitizedPath = path
				.replaceAll('\\', '/')
				.replace('.localhost/', '+');

			return `vscode-remote:${sanitizedPath}`;
		};

		return {
			path,
			wsl: {
				remotePath: getWslPath(path),
			},
		};
	}

	return { path, wsl: null };
}

/**
 * Open bookmark path into Visual Studio Code
 * @param {string} path
 * @param {Array<string>} args
 */
function openVsCode(path, args = []) {
	spawn('code', [...args, `"${path}"`], { shell: true });
}
