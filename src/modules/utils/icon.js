import { nativeImage } from 'electron';
import { resolve } from 'node:path';

function getIcon(iconName) {
	return nativeImage.createFromPath(
		resolve(__dirname, 'icons', 'main', iconName)
	);
}

export { getIcon };
