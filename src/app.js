import process from 'node:child_process';
import path from 'node:path';

export class App {
	/**
	 *
	 * @param {Electron} electron
	 */
	constructor(electron) {
		this.electron = electron;
		this.app = electron.app;

		this.win = null;
		this.tray = null;
	}

	/**
	 * Create an App
	 * @param {(app: App) => Promise<void>} fn
	 */
	make() {
		throw new Error('Not implemented');
	}

	/**
	 * Destroy the App and context
	 */
	destroyApp() {
		this.tray.closeContextMenu();

		this.win.removeAllListeners('close');
		this.win.close();

		this.app.quit();
	}

	/**
	 * Create and configure a Electron Tray
	 * @returns {Electron.Tray}
	 */
	createTray() {
		const icon = this.getIcon('tray-icon.png');
		const label = this.getLabel();

		if (!this.tray) {
			this.tray = new this.electron.Tray(icon);
			this.tray.setToolTip(label);
		}

		return this.tray;
	}

	/**
	 * Create and configure a Electron Window
	 * @returns {Electron.BrowserWindow}
	 */
	createWindow() {
		if (!this.win) {
			this.win = new this.electron.BrowserWindow({
				width: 380,
				height: 330,
				show: false,
				autoHideMenuBar: true,
				maximizable: false,
				resizable: false,
				fullscreen: false,
				fullscreenable: false,
				focusable: true,
				title: this.getLabel(),
				icon: this.getIcon('win-icon.png'),
				webPreferences: {
					preload: path.resolve(__dirname, 'preload.js'),
					contextIsolation: true,
					sandbox: true,
				},
			});

			// eslint-disable-next-line no-undef
			const devURL = MAIN_WINDOW_VITE_DEV_SERVER_URL;

			if (devURL) {
				this.win.loadURL(devURL);
				this.win.webContents.openDevTools({
					mode: 'detach',
					activate: true,
				});
			} else {
				this.win.loadFile(path.resolve(__dirname, 'index.html'));
			}
		}

		return this.win;
	}

	/**
	 * Create a Electron Menu from menu items template
	 * @param {Array<Electron.MenuItem>} menuItems
	 * @returns {Electron.Menu}
	 */
	createMenu(menuItems = []) {
		return this.electron.Menu.buildFromTemplate(menuItems);
	}

	/**
	 * Returns the formatted App label
	 * @returns {string}
	 */
	getLabel() {
		return `${this.app.getName()} - v${this.app.getVersion()}`;
	}

	/**
	 * Returns an App icon by iconName
	 * @param {string} iconName
	 * @returns {Electron.NativeImage}
	 */
	getIcon(iconName) {
		return this.electron.nativeImage.createFromPath(
			path.resolve(__dirname, 'icons', 'main', iconName)
		);
	}

	/**
	 * Open bookmark path into Visual Studio Code
	 * @param {string} path
	 * @param {Array<string>} args
	 */
	openEditor(path, args = []) {
		process.spawn('code', [...args, `"${path}"`], { shell: true });
	}
}
