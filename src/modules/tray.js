import { app, nativeImage, Tray } from 'electron/main';
import { resolve } from 'node:path';

function getLabel() {
	return `${app.getName()} - v${app.getVersion()}`;
}

function getIcon() {
	return nativeImage.createFromPath(
		resolve(
			import.meta.dirname,
			'..',
			'..',
			'assets',
			'icons',
			'png',
			'tray-icon.png'
		)
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
