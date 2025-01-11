import * as Sentry from '@sentry/electron';
import { app, ipcMain } from 'electron';

import './core/auto-update';

import { createMenu, createTray, createWindow } from './components';
import { openDialog } from './components/utils';
import { isFile } from './core/file-system';
import { isWindows } from './core/platform';
import { makeAppToInitOnASingleInstance } from './core/setup';
import { openIntoVsCode } from './core/vscode';
import { isPathFromWsl, wslBookmarkDataAdapter } from './core/wsl';
import store from './data/store';
import {
	createBookmark,
	deleteBookmarkById,
	getBookmarks,
} from './data/store/bookmark';

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
		const bookmarkData = getBookmarkDataFromFilePath(context, filePath);

		if (!bookmarkData) {
			event.reply('create-bookmark', 'ERROR');
			return;
		}

		createBookmark(bookmarkData);
		renderApp(context);

		event.reply('create-bookmark', 'OK');
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

	const addItemMenu = (label, dialogProperties) => ({
		label,
		type: 'normal',
		click: async () => {
			const filePaths = await openDialog(dialogProperties);

			if (!filePaths) return;

			const filePathData = getBookmarkDataFromFilePath(
				context,
				filePaths.at(0)
			);

			if (!filePathData) return;

			createBookmark(filePathData);
			renderApp(context);
		},
	});

	const bookmarkItemsMenu = getBookmarks().map((bookmarkData) => ({
		label: getBasenameFromBookmarkData(bookmarkData),
		submenu: [
			{
				label: 'Open',
				click: () => {
					openBookmarkIntoVsCode(bookmarkData);
				},
			},
			{
				label: 'Remove',
				click: () => {
					const { id } = bookmarkData;

					deleteBookmarkById(id);
					renderApp(context);
				},
			},
		],
	}));

	const contextMenu = createMenu([
		{
			label: 'Add project by drag and drop',
			type: 'normal',
			click: async () => {
				win.show();
				win.focus();
			},
		},
		addItemMenu('Add project', ['openDirectory']),
		addItemMenu('Add file', ['openFile']),
		{ type: 'separator' },
		...bookmarkItemsMenu,
		{ type: 'separator' },
		{
			label: 'Settings',
			click: () => {
				openIntoVsCode(store.path);
			},
		},
		{
			label: 'Quit',
			click: () => {
				win.removeAllListeners('close');
				win.close();
				app.quit();
			},
		},
	]);

	tray.setContextMenu(contextMenu);
}

function getBookmarkDataFromFilePath(context, filePath) {
	const { tray } = context;

	if (isWindows() && isPathFromWsl(filePath)) {
		if (isFile(filePath)) {
			tray.displayBalloon({
				iconType: 'warning',
				title: 'Unsupported WSL path',
				content: 'You can only save folders from WSL',
			});

			return null;
		}

		return wslBookmarkDataAdapter(filePath);
	}

	return { filePath };
}

function getBasenameFromBookmarkData(bookmarkData) {
	if (bookmarkData.wsl) return `[WSL] ${bookmarkData.basename}`;

	return bookmarkData.basename;
}

function openBookmarkIntoVsCode(bookmarkData) {
	if (bookmarkData.wsl) {
		openIntoVsCode(bookmarkData.path, ['--folder-uri']);
		return;
	}

	openIntoVsCode(bookmarkData.path);
}
