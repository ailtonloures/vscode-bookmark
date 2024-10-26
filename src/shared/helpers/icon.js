import { app, nativeImage } from 'electron';
import { resolve } from 'node:path';

import { VITE } from '../constants';

function getIcon(iconName) {
	let iconPath = resolve(
		app.getAppPath(),
		'app.asar',
		'icons',
		'main',
		iconName
	);

	if (VITE.DEV) {
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
