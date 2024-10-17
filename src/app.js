import { app, dialog, Menu } from 'electron/main';

import { createTray } from './modules/index.js';
import { createBookmark, deleteBookmark, getBookmarks } from './store.js';

import { spawn } from 'node:child_process';
import path from 'node:path';

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
						renderApp();
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
				renderApp();
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

function renderApp() {
	const tray = createTray();
	const contextMenu = createContextMenu();

	tray.setContextMenu(contextMenu);
}

function startApp() {
	app.whenReady().then(() => renderApp());
}

export { startApp };
