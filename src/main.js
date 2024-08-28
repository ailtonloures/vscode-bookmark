const { app, dialog, Tray, Menu, nativeImage } = require('electron/main');
const { spawn } = require('node:child_process');
const path = require('node:path');

const {
	listBookmarks,
	createBookmark,
	deleteBookmark,
} = require('./repository/main-repository');

let tray = null;

function createTray({ contextMenu }) {
	const appLabel = getAppLabel();
	const appIcon = getAppIcon();

	if (!tray) tray = new Tray(appIcon);

	tray.setToolTip(appLabel);
	tray.setContextMenu(contextMenu);

	tray.on('click', () => tray.popUpContextMenu());
}

function getAppLabel() {
	return `${app.getName()} - v${app.getVersion()}`;
}

function getAppIcon() {
	return nativeImage.createFromPath(
		path.resolve(__dirname, '..', 'assets/icons/png/16x16.png'),
	);
}

function createContextMenu() {
	const bookmarks = listBookmarks().map(({ basename, path }) => ({
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
					deleteBookmark({ path });
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
