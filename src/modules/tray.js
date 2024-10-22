import { app, nativeImage, Tray } from 'electron/main';
import path from 'node:path';

function getLabel() {
	return `${app.getName()} - v${app.getVersion()}`;
}

function getIcon() {
	return nativeImage.createFromPath(
		path.resolve(
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

function createTray(tray = null) {
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
