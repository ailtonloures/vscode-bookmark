const { app, Tray, Menu, nativeImage } = require('electron/main');
const path = require('node:path');

function createContextMenu() {
	const contextMenu = Menu.buildFromTemplate([
		{ label: getTitle(), type: 'normal', role: 'about', icon: getIcon() },
		{ label: 'Item2', type: 'radio' },
		{ label: 'Item3', type: 'radio' },
		{ label: 'Item4', type: 'radio' },
	]);

	return contextMenu;
}

function createTray({ title, icon, contextMenu }) {
	const tray = new Tray(icon);

	tray.setToolTip(title);
	tray.setContextMenu(contextMenu);

	tray.on('click', () => tray.popUpContextMenu());
}

function getIcon() {
	return nativeImage.createFromPath(
		path.resolve(__dirname, '..', 'assets/icons/png/16x16.png'),
	);
}

function getTitle() {
	return `${app.getName()} - v${app.getVersion()}`;
}

app.whenReady().then(() => {
	const contextMenu = createContextMenu();

	createTray({
		title: getTitle(),
		icon: getIcon(),
		contextMenu,
	});
});
