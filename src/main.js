import * as Sentry from '@sentry/electron';

import { app, dialog, Menu } from 'electron/main';

import { createTray } from './modules/index.js';
import { makeSetup } from './setup.js';
import { createBookmark, deleteBookmark, getBookmarks } from './store.js';

import { spawn } from 'node:child_process';
import path from 'node:path';

Sentry.init({
	dsn: 'https://713782327975276ae010040b1db6ab8a@o4507887084503040.ingest.us.sentry.io/4507887098724352',
});

function createContextMenu() {
	const bookmarks = getBookmarks()
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
						render();
					},
				},
			],
		}));

	const contextMenu = Menu.buildFromTemplate([
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
				render();
			},
		},
		{ type: 'separator' },
		...bookmarks,
		{ type: 'separator' },
		{
			label: 'Quit',
			click: () => app.quit(),
		},
	]);

	return contextMenu;
}

function render() {
	const tray = createTray();
	const contextMenu = createContextMenu();

	tray.setContextMenu(contextMenu);
}

function runApp() {
	app.whenReady().then(() => render());
}

makeSetup(runApp);
