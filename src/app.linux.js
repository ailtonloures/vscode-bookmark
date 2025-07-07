import { App } from './app';

/**
 * Linux App Factory
 * @class
 */
export class LinuxApp extends App {
	/**
	 *
	 * @param {Electron} electron
	 */
	constructor(electron) {
		super(electron);

		console.log('LinuxApp::instance');
	}

	/**
	 * Create an App on a single instance
	 * @param {(app: App) => Promise<void>|void} fn
	 */
	async make(fn) {
		const hasSecondInstance = !this.app.requestSingleInstanceLock();

		if (hasSecondInstance) this.app.quit();

		this.app.commandLine.appendSwitch('disable-gpu');
		this.app.commandLine.appendSwitch('disable-gpu-compositing');
		this.app.commandLine.appendSwitch('disable-gpu-vsync');

		await this.app.whenReady();

		fn(this);
	}
}
