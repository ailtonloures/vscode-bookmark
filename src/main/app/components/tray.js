import { dialog, Tray as ElectronTray, Menu } from 'electron/main';
import { spawn } from 'node:child_process';
import { basename } from 'node:path';

/**
 * Define Tray application component
 * @param {import('..').Context} context
 */
export const Tray = ({
	app,
	info: { title, icon },
	store: { bookmarkStore },
}) => {
	/**
	 * Electron Tray instance
	 * @type {Electron.Tray|undefined} tray
	 * @private
	 */
	let tray = null;

	/**
	 * Create a new tray instance
	 */
	function render() {
		if (!tray) {
			tray = new ElectronTray(icon);
			tray.setToolTip(title);

			tray.on('click', () => tray.popUpContextMenu());
		}

		tray.setContextMenu(createContextMenu());
	}

	/**
	 * Create a new context menu for the tray
	 */
	function createContextMenu() {
		return Menu.buildFromTemplate([
			{
				label: 'Search project...',
				type: 'normal',
				click: async () => {
					const { canceled, filePaths } = await dialog.showOpenDialog({
						properties: ['openDirectory'],
					});

					if (canceled) return;

					const filePath = filePaths.at(0);

					bookmarkStore.create({
						path: filePath,
						basename: basename(filePath),
					});

					render();
				},
			},
			{ type: 'separator' },
			...bookmarkStore
				.get()
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
								bookmarkStore.delete(id);
								render();
							},
						},
					],
				})),
			{ type: 'separator' },
			{
				label: 'Quit',
				click: app.quit,
			},
		]);
	}

	return {
		render,
	};
};
