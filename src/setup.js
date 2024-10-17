import squirrelStartup from 'electron-squirrel-startup';
import { app } from 'electron/main';

function hasSecondInstance() {
	const isPrimaryInstance = app.requestSingleInstanceLock();

	return !isPrimaryInstance || squirrelStartup;
}

function setAppToOpenAtLogin() {
	const { openAtLogin } = app.getLoginItemSettings();

	if (openAtLogin === false)
		app.setLoginItemSettings({
			openAtLogin: true,
		});
}

function makeSetup(fn) {
	if (hasSecondInstance()) app.quit();

	setAppToOpenAtLogin();
	fn();
}

export { makeSetup };
