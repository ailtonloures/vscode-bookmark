import * as Sentry from '@sentry/electron';

import squirrelStartup from 'electron-squirrel-startup';
import { app } from 'electron/main';

import { TrayApp } from './components/tray.js';

Sentry.init({
	dsn: 'https://713782327975276ae010040b1db6ab8a@o4507887084503040.ingest.us.sentry.io/4507887098724352',
});

if (squirrelStartup || !app.requestSingleInstanceLock()) app.quit();

const { openAtLogin } = app.getLoginItemSettings();

if (openAtLogin === false)
	app.setLoginItemSettings({
		openAtLogin: true,
	});

app.whenReady().then(() => TrayApp.render());
