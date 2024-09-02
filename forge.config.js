import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const commonLinuxConfig = {
	executableName: 'vscode-bookmark',
	config: {
		options: {
			maintainer: 'Ailton Loures',
			categories: ['Development', 'Utility'],
			icon: {
				'1024x1024': 'assets/icons/png/1024x1024.png',
			},
		},
	},
};

export default {
	buildIdentifier: 'vscode-bookmark',
	packagerConfig: {
		asar: true,
		icon: 'assets/icons/icon',
		executableName: 'my-electron-app',
	},
	plugins: [
		{
			name: '@electron-forge/plugin-auto-unpack-natives',
			config: {},
		},
		// Fuses are used to enable/disable various Electron functionality
		// at package time, before code signing the application
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
			[FuseV1Options.OnlyLoadAppFromAsar]: true,
		}),
	],
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			platforms: ['win32'],
			config: {
				setupIcon: 'assets/icons/win/icon.ico',
			},
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin'],
		},
		{
			name: '@electron-forge/maker-deb',
			platforms: ['linux'],
			config: commonLinuxConfig,
		},
		{
			name: '@electron-forge/maker-rpm',
			platforms: ['linux'],
			config: commonLinuxConfig,
		},
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: {
					owner: 'ailtonloures',
					name: 'vscode-bookmark',
				},
				draft: true,
			},
		},
	],
};
