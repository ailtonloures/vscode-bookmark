import { app, dialog, Menu, nativeImage, Tray } from 'electron/main';
import { spawn } from 'node:child_process';
import path from 'node:path';

import { createBookmark, deleteBookmark, getBookmarks } from './store.js';

let tray = null;

export function renderTray() {
	if (!tray) {
		const label = getLabel();
		const icon = getIcon();

		tray = new Tray(icon);
		tray.setToolTip(label);

		tray.on('click', () => tray.popUpContextMenu());
	}

	const contextMenu = createContextMenu();

	tray.setContextMenu(contextMenu);
}

function getLabel() {
	return `${app.getName()} - v${app.getVersion()}`;
}

function getIcon() {
	return nativeImage.createFromPath(
		path.resolve(import.meta.dirname, '..', 'assets/icons/png/16x16.png'),
	);
}

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
						renderTray();
					},
				},
			],
		}));

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Add a vscode bookmark',
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

				renderTray();
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
