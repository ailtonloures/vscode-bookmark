import { App } from './app';
import { setAutoUpdate } from './shared';

/**
 * Darwin App Factory
 * @class
 */
export class DarwinApp extends App {
	/**
	 *
	 * @param {Electron} electron
	 */
	constructor(electron) {
		super(electron);

		console.log('DarwinApp::instance');

		setAutoUpdate();
	}

	/**
	 * Create an App on a single instance
	 * @param {(app: App) => Promise<void>|void} fn
	 */
	async make(fn) {
		const hasSecondInstance = !this.app.requestSingleInstanceLock();

		if (hasSecondInstance) this.app.quit();

		if (this.app.isPackaged) {
			this.app.setLoginItemSettings({
				openAtLogin: true,
			});
		}

		await this.app.whenReady();

		this._electron.autoUpdater.on('before-quit-for-update', () => {
			this.destroyApp();
		});

		fn(this);
	}
}
