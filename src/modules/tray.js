import { app, nativeImage, Tray } from 'electron';
import { resolve } from 'node:path';

function getLabel() {
	return `${app.getName()} - v${app.getVersion()}`;
}

function getIcon() {
	return nativeImage.createFromPath(
		resolve(app.getAppPath(), 'assets', 'icons', 'main', 'tray-icon.png')
	);
}

function createTray() {
	const icon = getIcon();
	const label = getLabel();

	const tray = new Tray(icon);
	tray.setToolTip(label);

	return tray;
}

export { createTray };
