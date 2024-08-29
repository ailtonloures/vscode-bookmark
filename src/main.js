import { app, dialog, Menu, nativeImage, Tray } from 'electron/main';
import { spawn } from 'node:child_process';
import path from 'node:path';

import { createBookmark, deleteBookmark, getBookmarks } from './store.js';

let tray = null;

function createTray({ contextMenu }) {
	if (!tray) {
		const appLabel = getAppLabel();
		const appIcon = getAppIcon();

		tray = new Tray(appIcon);
		tray.setToolTip(appLabel);

		tray.on('click', () => tray.popUpContextMenu());
	}

	tray.setContextMenu(contextMenu);
}

function getAppLabel() {
	return `${app.getName()} - v${app.getVersion()}`;
}

function getAppIcon() {
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
		{
			label: 'Quit',
			click: () => app.quit(),
		},
	]);

	return contextMenu;
}

function renderTray() {
	const contextMenu = createContextMenu();

	createTray({
		contextMenu,
	});
}

app.whenReady().then(() => renderTray());
