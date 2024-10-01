import { Tray, Window } from './components/index.js';
import { BookmarkStore } from './store/index.js';

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
 * @param {Electron.App} app
 */
export const App = (app) => {
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
			store: getStore(),
		};

		app
			.whenReady()
			.then(() => console.log('Application is ready\n'))
			.then(() => {
				Tray(context).render();
				Window(context).render();
			});
	}

	return {
		start,
	};
};
