import { app, nativeImage } from 'electron/main';
import { resolve } from 'node:path';

/**
 * App configuration
 */
const App = {
	/**
	 * Get the application label
	 * @type {string}
	 */
	label: `${app.getName()} - v${app.getVersion()}`,

	/**
	 * Get the application icon
	 * @type {import('electron').NativeImage}
	 */
	icon: nativeImage.createFromPath(
		resolve(import.meta.dirname, '..', '..', 'assets/icons/png/16x16.png')
	),
};

export { App };
