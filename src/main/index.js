import * as Sentry from '@sentry/electron';

import { app } from 'electron/main';
import { App } from './app/index.js';
import { Setup } from './core/index.js';

Sentry.init({
	dsn: 'https://713782327975276ae010040b1db6ab8a@o4507887084503040.ingest.us.sentry.io/4507887098724352',
});

const setup = Setup(app);

setup.setStartupOnLogin();
setup.requestNewInstance() ? app.quit() : App(app).start();
