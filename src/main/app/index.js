import { app } from 'electron/main';

import { BookmarkStore } from '../store/bookmark';
import { Tray } from './components';
import { requestNewInstance, setStartupOnLogin } from './core';

/**
 * @typedef Store
 * @property {BookmarkStore} bookmarkStore
 */

/**
 * @typedef Context
 * @property {Electron.App} app
 * @property {Store} store
 */

/**
 * The main application
 */
export const App = {
	start() {
		if (requestNewInstance()) app.quit();

		const context = {
			app,
			store: { bookmarkStore: BookmarkStore },
		};

		setStartupOnLogin();
		app
			.whenReady()
			.then(() => console.log('Application is ready'))
			.then(Tray(context).render());
	},
};
