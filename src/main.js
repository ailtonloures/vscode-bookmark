import fs from 'node:fs';

import * as Sentry from '@sentry/electron';
import electron, { ipcMain, dialog } from 'electron';

import { Bookmark, BookmarkStore } from './core/index.js';
import { platform } from './shared';

Sentry.init({
	dsn: 'https://713782327975276ae010040b1db6ab8a@o4507887084503040.ingest.us.sentry.io/4507887098724352',
});

async function createApp() {
	if (platform('win32'))
		return new (await import('./app.windows.js')).WindowsApp(electron);

	if (platform('linux'))
		return new (await import('./app.linux.js')).LinuxApp(electron);

	if (platform('darwin'))
		return new (await import('./app.darwin.js')).DarwinApp(electron);

	throw new Error('Unsupported platform');
}

function createStore() {
	return new BookmarkStore();
}

function renderApp(app, store) {
	const { tray, win } = app;

	const addByBrowserMenuItem = (label, properties) => ({
		label,
		type: 'normal',
		click: async () => {
			const { canceled, filePaths } = await dialog.showOpenDialog({
				properties,
			});

			if (canceled) return;

			const bookmark = Bookmark.create(filePaths.at(0));
			store.save(bookmark);

			renderApp(app, store);
		},
	});

	const listMenuItem = store.get().map((bookmark) => ({
		label: bookmark.remotePath
			? `${bookmark.basename} (remote)`
			: bookmark.basename,
		submenu: [
			{
				label: 'Open',
				click: () => {
					if (bookmark.remotePath) {
						if (fs.statSync(bookmark.path).isFile()) {
							app.openEditor(bookmark.remotePath, ['--file-uri']);
							return;
						}

						app.openEditor(bookmark.remotePath, ['--folder-uri']);
						return;
					}

					app.openEditor(bookmark.path);
				},
			},
			{
				label: 'Remove',
				click: () => {
					store.remove(bookmark.id);

					renderApp(app, store);
				},
			},
		],
	}));

	const contextMenu = app.createMenu([
		...(platform(['win32'])
			? [
					{
						label: 'Add by drag and drop',
						type: 'normal',
						click: () => {
							win.show();
							win.focus();
						},
					},
				]
			: []),
		addByBrowserMenuItem('Add project', ['openDirectory']),
		...(platform(['win32'])
			? [addByBrowserMenuItem('Add file', ['openFile'])]
			: []),
		{ type: 'separator' },
		...listMenuItem,
		{ type: 'separator' },
		{
			label: 'Quit',
			click: () => {
				app.destroyApp();
			},
		},
	]);

	tray.setContextMenu(contextMenu);
}

function registerAppEvents(app) {
	const { tray, win } = app;

	tray.on('click', () => tray.popUpContextMenu());

	win.on('close', (event) => {
		event.preventDefault();
		win.hide();
	});
}

function registerIpcMainEvents(app, store) {
	ipcMain.on('save-bookmark', (event, path) => {
		const bookmark = Bookmark.create(path);

		store.save(bookmark);
		event.reply('save-bookmark', 'OK');

		renderApp(app, store);
	});
}

async function main() {
	const application = await createApp();
	const store = createStore();

	application.make(async (app) => {
		app.createTray();
		app.createWindow();

		registerIpcMainEvents(app, store);
		registerAppEvents(app);

		renderApp(app, store);
	});
}

main();
