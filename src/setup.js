import squirrelStartup from 'electron-squirrel-startup';
import { app } from 'electron/main';

function hasSecondInstance() {
	const isPrimaryInstance = app.requestSingleInstanceLock();

	return !isPrimaryInstance;
}

function hasSquirrelInstance() {
	return squirrelStartup;
}

function makeAppToInitOnASingleInstance(fn) {
	if (hasSecondInstance() || hasSquirrelInstance()) app.quit();

	fn();
}

function setAppToOpenAtLogin() {
	const { openAtLogin } = app.getLoginItemSettings();

	if (openAtLogin === false)
		app.setLoginItemSettings({
			openAtLogin: true,
		});
}

export { makeAppToInitOnASingleInstance, setAppToOpenAtLogin };
