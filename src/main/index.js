import * as Sentry from '@sentry/electron';

import { App } from './app';

Sentry.init({
	dsn: 'https://713782327975276ae010040b1db6ab8a@o4507887084503040.ingest.us.sentry.io/4507887098724352',
});

App.start();
