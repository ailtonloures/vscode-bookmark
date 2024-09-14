if (require('electron-squirrel-startup')) app.quit();

import * as Sentry from '@sentry/electron';

import { app } from 'electron/main';
import { renderTray } from './tray.js';

Sentry.init({
	dsn: 'https://713782327975276ae010040b1db6ab8a@o4507887084503040.ingest.us.sentry.io/4507887098724352',
});

app.whenReady().then(() => renderTray());
