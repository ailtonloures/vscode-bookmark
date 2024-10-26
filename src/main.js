import * as Sentry from '@sentry/electron';

import { app, ipcMain } from 'electron';
import { spawn } from 'node:child_process';

import {
	createBookmark,
	deleteBookmark,
	getBookmarks,
} from './data/store/bookmark-store';
import { createMenu, createTray, createWindow, openDialog } from './modules';
import { makeAppToInitOnASingleInstance } from './setup';

Sentry.init({
	dsn: 'https://713782327975276ae010040b1db6ab8a@o4507887084503040.ingest.us.sentry.io/4507887098724352',
});

makeAppToInitOnASingleInstance(async () => {
	if (app.isPackaged) {
		app.setLoginItemSettings({
			openAtLogin: true,
		});
	}

	await app.whenReady();

	const context = createAppContext();

	registerIpcMainEvents(context);
	registerAppEvents(context);
	renderApp(context);
});

function createAppContext() {
	const tray = createTray();
	const win = createWindow();

	return { tray, win };
}

function registerIpcMainEvents(context) {
	ipcMain.on('create-bookmark', (event, filePath) => {
		createBookmark(filePath);
		renderApp(context);

		event.reply('create-bookmark', true);
	});
}

function registerAppEvents(context) {
	const { tray, win } = context;

	tray.on('click', () => tray.popUpContextMenu());

	win.on('close', (event) => {
		event.preventDefault();
		win.hide();
	});
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

	const searchMenuItem = (label, dialogProperties) => ({
		label,
		type: 'normal',
		click: async () => {
			const filePath = await openDialog(dialogProperties);

			if (!filePath) return;

			createBookmark(filePath);
			renderApp(context);
		},
	});

	const separatorMenuItem = { type: 'separator' };

	const bookmarkMenuItems = getBookmarks().map(({ basename, path, id }) => ({
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
					renderApp(context);
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
		searchMenuItem('Search project', ['openDirectory']),
		searchMenuItem('Search file', ['openFile']),
		separatorMenuItem,
		...bookmarkMenuItems,
		separatorMenuItem,
		exitMenuItem,
	]);

	tray.setContextMenu(contextMenu);
}
