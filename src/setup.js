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

export { makeAppToInitOnASingleInstance };
