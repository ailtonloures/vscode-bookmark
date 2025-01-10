import { updateElectronApp, UpdateSourceType } from 'update-electron-app';

import { name, repository } from './../../package.json';

export default updateElectronApp({
	updateSource: {
		host: 'https://update.electronjs.org',
		type: UpdateSourceType.ElectronPublicUpdateService,
		repo: `${repository.owner}/${name}`,
	},
});
