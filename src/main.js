import * as Sentry from '@sentry/electron';

import { app, ipcMain } from 'electron/main';

import { spawn } from 'node:child_process';
import { basename } from 'node:path';

import {
	createBookmark,
	deleteBookmark,
	getBookmarks,
} from './data/store/bookmark.js';
import {
	createMenu,
	createTray,
	createWindow,
	openDialog,
} from './modules/index.js';
import { makeAppToInitOnASingleInstance } from './setup.js';

Sentry.init({
	dsn: 'https://713782327975276ae010040b1db6ab8a@o4507887084503040.ingest.us.sentry.io/4507887098724352',
});

function registerIPCEvents(context) {
	ipcMain.on('create-bookmark', (event, filePath) => {
		addBookmark(filePath);
		renderApp(context);

		event.reply('create-bookmark', true);
	});
}

function registerAPPEvents(context) {
	const { tray, win } = context;

	tray.on('click', () => tray.popUpContextMenu());

	win.on('close', (event) => {
		event.preventDefault();
		win.hide();
	});
}

function addBookmark(filePath) {
	createBookmark({
		path: filePath,
		basename: basename(filePath),
	});
}

async function getFilePath(properties = ['openDirectory']) {
	const { canceled, filePaths } = await openDialog(properties);

	if (canceled) return;
	const filePath = filePaths.at(0);

	return filePath;
}

function renderApp(context) {
	const { tray, win } = context;

	const dragAndDropMenuItem = {
		label: 'Add by drag and drop',
		type: 'normal',
		click: async () => {
			win.show();
			win.focus();
		},
	};

	const searchProjectMenuItem = {
		label: 'Search project',
		type: 'normal',
		click: async () => {
			const filePath = await getFilePath();

			addBookmark(filePath);
			renderApp({ tray, win });
		},
	};

	const searchFileMenuItem = {
		label: 'Search file',
		type: 'normal',
		click: async () => {
			const filePath = await getFilePath(['openFile']);

			addBookmark(filePath);
			renderApp({ tray, win });
		},
	};

	const separatorMenuItem = { type: 'separator' };

	const bookmarkMenuItems = getBookmarks()
		.slice(0, 10)
		.map(({ basename, path, id }) => ({
			label: basename,
			submenu: [
				{
					label: 'Open',
					click: () => {
						spawn('code', [path], { shell: true });
					},
				},
				{
					label: 'Remove',
					click: () => {
						deleteBookmark(id);
						renderApp({ tray, win });
					},
				},
			],
		}));

	const exitMenuItem = {
		label: 'Quit',
		click: () => {
			win.removeAllListeners('close');
			win.close();
			app.quit();
		},
	};

	const contextMenu = createMenu([
		dragAndDropMenuItem,
		searchProjectMenuItem,
		searchFileMenuItem,
		separatorMenuItem,
		...bookmarkMenuItems,
		separatorMenuItem,
		exitMenuItem,
	]);

	tray.setContextMenu(contextMenu);
}

makeAppToInitOnASingleInstance(async () => {
	if (app.isPackaged) {
		app.setLoginItemSettings({
			openAtLogin: true,
		});
	}

	await app.whenReady();

	const tray = createTray();
	const win = createWindow();

	const context = { tray, win };

	registerIPCEvents(context);
	registerAPPEvents(context);
	renderApp(context);
});
