import electronSquirrelStartup from 'electron-squirrel-startup';

import { App } from './app';
import { setAutoUpdate } from './shared';

/**
 * Windows App Factory
 * @class
 */
export class WindowsApp extends App {
	/**
	 *
	 * @param {Electron} electron
	 */
	constructor(electron) {
		super(electron);

		console.log('WindowsApp::instance');

		setAutoUpdate();
	}

	/**
	 * Create an App on a single instance
	 * @param {(app: App) => Promise<void>|void} fn
	 */
	async make(fn) {
		const hasSecondInstance = !this.app.requestSingleInstanceLock();
		const hasSquirrelInstance = electronSquirrelStartup;

		if (hasSecondInstance || hasSquirrelInstance) this.app.quit();

		if (this.app.isPackaged) {
			this.app.setLoginItemSettings({
				openAtLogin: true,
			});
		}

		await this.app.whenReady();

		this.electron.autoUpdater.on('before-quit-for-update', () => {
			this.destroyApp();
		});

		fn(this);
	}
}
