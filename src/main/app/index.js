import { nativeImage } from 'electron/main';
import { resolve } from 'node:path';

import { Tray } from './components/index.js';
import { BookmarkStore } from './store/index.js';

/**
 * @typedef Info
 * @property {string} title
 * @property {Electron.NativeImage} icon
 */

/**
 * @typedef Store
 * @property {BookmarkStore} bookmarkStore
 */

/**
 * @typedef Context
 * @property {Electron.App} app
 * @property {Info} info
 * @property {Store} store
 */

/**
 * The main application
 * @param {Electron.App} app
 */
export const App = (app) => {
	/**
	 * Get application info.
	 * @return {Info}
	 */
	function getInfo() {
		return {
			title: `${app.getName()} - ${app.getVersion()}`,
			icon: nativeImage.createFromPath(
				resolve('src', 'resources', 'icons', 'main-icon.png')
			),
		};
	}

	/**
	 * Get store configuration.
	 * @return {Store}
	 */
	function getStore() {
		return { bookmarkStore: BookmarkStore };
	}

	function start() {
		const context = {
			app,
			info: getInfo(),
			store: getStore(),
		};

		app
			.whenReady()
			.then(() => console.log('Application is ready\n'))
			.then(() => Tray(context).render());
	}

	return {
		start,
	};
};
