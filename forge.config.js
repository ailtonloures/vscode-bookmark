const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { VitePlugin } = require('@electron-forge/plugin-vite');

const {
	name: projectName,
	author,
	productName,
	repository: { owner },
} = require('./package.json');

const commonLinuxConfig = {
	config: {
		options: {
			icon: 'public/icons/build/icon.png',
			maintainer: author,
			categories: ['Development', 'Utility'],
			productName: productName.trim(),
			genericName: productName,
		},
	},
};

module.exports = {
	buildIdentifier: 'product',
	packagerConfig: {
		asar: true,
		executableName: projectName,
		icon: 'public/icons/build/icon',
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
		new VitePlugin({
			build: [
				{
					entry: 'src/main.js',
					config: 'vite.main.config.mjs',
				},
				{
					entry: 'src/preload.js',
					config: 'vite.preload.config.mjs',
				},
			],
			renderer: [
				{
					name: 'main_window',
					config: 'vite.renderer.config.mjs',
				},
			],
		}),
	],
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			platforms: ['win32'],
			config: {
				setupIcon: 'public/icons/build/icon.ico',
			},
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin'],
		},
		{
			name: '@electron-forge/maker-deb',
			platforms: ['linux'],
			...commonLinuxConfig,
		},
		{
			name: '@electron-forge/maker-rpm',
			platforms: ['linux'],
			...commonLinuxConfig,
		},
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: {
					owner: owner,
					name: projectName,
				},
				draft: true,
			},
		},
	],
};
