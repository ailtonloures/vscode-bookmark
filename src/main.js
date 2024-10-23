import * as Sentry from '@sentry/electron';

import { app, dialog } from 'electron/main';

import { spawn } from 'node:child_process';
import { basename } from 'node:path';

import {
	createBookmark,
	deleteBookmark,
	getBookmarks,
} from './data/store/bookmark.js';
import { createMenu, createTray, createWindow } from './modules/index.js';
import { makeAppToInitOnASingleInstance } from './setup.js';

Sentry.init({
	dsn: 'https://713782327975276ae010040b1db6ab8a@o4507887084503040.ingest.us.sentry.io/4507887098724352',
});

function registerAppEvents({ tray, win }) {
	tray.on('click', () => tray.popUpContextMenu());

	win.on('close', (event) => {
		event.preventDefault();
		win.hide();
	});
}

function createApp({ tray, win }) {
	const searchProjectMenuItem = {
		label: 'Search project...',
		type: 'normal',
		click: async () => {
			const { canceled, filePaths } = await dialog.showOpenDialog({
				properties: ['openDirectory'],
			});

			if (canceled) return;

			const filePath = filePaths.at(0);

			createBookmark({
				path: filePath,
				basename: basename(filePath),
			});
			createApp({ tray, win });
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
						createApp({ tray, win });
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
		searchProjectMenuItem,
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

	registerAppEvents(context);
	createApp(context);
});
