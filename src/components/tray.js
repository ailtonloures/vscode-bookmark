import { app, dialog, Menu, Tray } from 'electron/main';
import { spawn } from 'node:child_process';
import { basename } from 'node:path';

import { App } from '../config/app.js';
import { BookmarkRepository } from '../repository/bookmark.js';

const SearchProjectMenu = {
	label: 'Search project...',
	type: 'normal',
	click: async () => {
		const { canceled, filePaths } = await dialog.showOpenDialog({
			properties: ['openDirectory'],
		});

		if (canceled) return;

		const filePath = filePaths.at(0);

		BookmarkRepository.create({
			path: filePath,
			basename: basename(filePath),
		});

		TrayApp.render();
	},
};

const BookmarksMenu = BookmarkRepository.get()
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
					BookmarkRepository.delete(id);
					TrayApp.render();
				},
			},
		],
	}));

const QuitMenu = {
	label: 'Quit',
	click: app.quit,
};

const TrayApp = {
	/**
	 * Electron Tray instance
	 * @private
	 * @type {Tray}
	 */
	tray: null,

	/**
	 * Render the tray icon on the taskbar menu
	 */
	render() {
		if (!TrayApp.tray) {
			TrayApp.tray = new Tray(App.icon);
			TrayApp.tray.setToolTip(App.label);

			TrayApp.tray.on('click', () => TrayApp.tray.popUpContextMenu());
		}

		const contextMenu = TrayApp.createContextMenu();
		TrayApp.tray.setContextMenu(contextMenu);
	},

	/**
	 * Create the context menu for the tray icon
	 * @private
	 * @returns {Menu}
	 */
	createContextMenu() {
		const contextMenu = Menu.buildFromTemplate([
			SearchProjectMenu,
			{ type: 'separator' },
			...BookmarksMenu,
			{ type: 'separator' },
			QuitMenu,
		]);

		return contextMenu;
	},
};

export { TrayApp };
