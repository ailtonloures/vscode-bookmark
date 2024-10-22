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

let tray = null;

function getTrayMenu() {
	const bookmarksMenu = () =>
		getBookmarks()
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
							renderApp();
						},
					},
				],
			}));

	return createMenu([
		{
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
				renderApp();
			},
		},
		{ type: 'separator' },
		...bookmarksMenu(),
		{ type: 'separator' },
		{
			label: 'Quit',
			click: () => app.quit(),
		},
	]);
}

function renderApp() {
	tray = createTray(tray);
	tray.setContextMenu(getTrayMenu());
}

makeAppToInitOnASingleInstance(async () => {
	app.setLoginItemSettings({
		openAtLogin: true,
	});

	await app.whenReady();

	renderApp();
});
