import { app, nativeImage, Tray } from 'electron/main';
import path from 'node:path';

let tray = null;

function getLabel() {
	return `${app.getName()} - v${app.getVersion()}`;
}

function getIcon() {
	return nativeImage.createFromPath(
		path.resolve('assets', 'icons', 'png', 'tray-icon.png')
	);
}

function createTray() {
	if (!tray) {
		const label = getLabel();
		const icon = getIcon();

		tray = new Tray(icon);
		tray.setToolTip(label);

		tray.on('click', () => tray.popUpContextMenu());
	}

	return tray;
}

export { createTray };
