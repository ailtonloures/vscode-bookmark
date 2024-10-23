import * as Sentry from '@sentry/electron';

import { app, dialog } from 'electron/main';

import { spawn } from 'node:child_process';
import path from 'node:path';

import {
	createBookmark,
	deleteBookmark,
	getBookmarks,
} from './data/store/bookmark.js';
import { createMenu, createTray } from './modules/index.js';
import { makeAppToInitOnASingleInstance } from './setup.js';

Sentry.init({
	dsn: 'https://713782327975276ae010040b1db6ab8a@o4507887084503040.ingest.us.sentry.io/4507887098724352',
});

function createApp({ tray }) {
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
				basename: path.basename(filePath),
			});
			createApp({ tray });
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
						createApp({ tray });
					},
				},
			],
		}));

	const exitMenuItem = {
		label: 'Quit',
		click: () => app.quit(),
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

	createApp({ tray });
});
