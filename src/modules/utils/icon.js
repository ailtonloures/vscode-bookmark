import { app, nativeImage } from 'electron';
import { resolve } from 'node:path';

import { isDevMode } from './vite';

function getIcon(iconName) {
	let iconPath = resolve(
		app.getAppPath(),
		'app.asar',
		'icons',
		'main',
		iconName
	);

	if (isDevMode()) {
		iconPath = resolve(
			app.getAppPath(),
			'public',
			'icons',
			'main',
			iconName
		);
	}

	return nativeImage.createFromPath(iconPath);
}

export { getIcon };
