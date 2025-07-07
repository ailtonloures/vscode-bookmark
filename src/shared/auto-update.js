import {
	updateElectronApp,
	makeUserNotifier,
	UpdateSourceType,
} from 'update-electron-app';

/**
 * Configures and initializes automatic updates for the Electron application
 * using the Electron Public Update Service.
 *
 * This function sets up update checking and user notifications for the VSCode Bookmark application,
 * using a predefined update source and notification configuration.
 */
export function setAutoUpdate() {
	updateElectronApp({
		updateSource: {
			type: UpdateSourceType.ElectronPublicUpdateService,
			host: 'https://update.electronjs.org',
			repo: 'ailtonloures/vscode-bookmark',
		},
		onNotifyUser: makeUserNotifier({
			title: 'VSCode Bookmark Update',
		}),
	});
}
