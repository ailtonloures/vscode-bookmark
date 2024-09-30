import squirrelStartup from 'electron-squirrel-startup';

/**
 * Define Core application setup
 * @param {Electron.App} app
 */
export const Setup = (app) => {
	/**
	 * Set application to open at login on startup
	 */
	function setStartupOnLogin() {
		const { openAtLogin } = app.getLoginItemSettings();

		if (openAtLogin === false)
			app.setLoginItemSettings({
				openAtLogin: true,
			});
	}

	/**
	 * Check if the application is requesting a new instance
	 * @returns {boolean}
	 */
	function requestNewInstance() {
		const primaryInstance = app.requestSingleInstanceLock();

		return squirrelStartup || !primaryInstance;
	}

	return {
		requestNewInstance,
		setStartupOnLogin,
	};
};
