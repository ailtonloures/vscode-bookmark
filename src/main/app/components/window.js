import { BrowserWindow, nativeImage } from 'electron/main';
import { resolve } from 'node:path';

/**
 * Define Window application component
 * @param {import('..').Context} context
 */
export const Window = ({ app }) => {
	/**
	 * Electron Browser window instance
	 * @type {Electron.BrowserWindow|undefined}
	 */
	let win = null;

	/**
	 * Get window title
	 * @type {string}
	 * @private
	 */
	const title = app.getName();

	/**
	 * Get window icon
	 * @type {Electron.NativeImage}
	 * @private
	 */
	const icon = nativeImage.createFromPath(
		resolve('src', 'resources', 'icons', 'tray-icon.png')
	);

	/**
	 * Create a new window instance
	 */
	function render() {
		win = new BrowserWindow({
			icon,
			title,
			width: 520,
			height: 400,
			webPreferences: {
				preload: resolve('src', 'main', 'preload.js'),
			},
		});

		win.loadFile(resolve('src', 'renderer', 'index.html'));
	}

	return { render, win };
};
