import { resolve } from 'node:path';

import { nativeImage } from 'electron';

function getIcon(iconName) {
	return nativeImage.createFromPath(
		resolve(__dirname, 'icons', 'main', iconName)
	);
}

export { getIcon };
