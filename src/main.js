import * as Sentry from '@sentry/electron';
import { app, ipcMain } from 'electron';

import { isFile } from './core/file-system';
import { makeAppToInitOnASingleInstance } from './core/setup';
import { openIntoVsCode } from './core/vscode';
import { isFilePathFromWsl, wslBookmarkDataAdapter } from './core/wsl';
import store from './data/store';
import {
	createBookmark,
	deleteBookmarkById,
	getBookmarks,
} from './data/store/bookmark';
import { createMenu, createTray, createWindow } from './electron';
import { isWindows, openDialog } from './electron/utils';

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
			const filePaths = await openDialog(dialogProperties);

			if (!filePaths) return;

			const filePathData = getBookmarkDataFromFilePath(filePaths.at(0));

			createBookmark(filePathData);
			renderApp(context);
		},
	});

	const separatorMenuItem = { type: 'separator' };

	const bookmarkMenuItems = getBookmarks().map((bookmarkData) => ({
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

	const openConfigMenuItem = {
		label: 'Open config',
		click: () => {
			openIntoVsCode(store.path);
		},
	};

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
		openConfigMenuItem,
		exitMenuItem,
	]);

	tray.setContextMenu(contextMenu);
}

function getBookmarkDataFromFilePath(context, filePath) {
	const { tray } = context;

	if (isWindows() && isFilePathFromWsl(filePath)) {
		if (!isFile(filePath)) return wslBookmarkDataAdapter(filePath);

		tray.displayBalloon({
			iconType: 'warning',
			title: 'Unsupported WSL path',
			content: 'You can only save folders from WSL',
		});

		return null;
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
