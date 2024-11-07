import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	{
		files: ['src/**/*.js', 'ui/**/*.js'],
	},
	{ languageOptions: { globals: { ...globals.node, ...globals.browser } } },
	pluginJs.configs.recommended,
	{
		ignores: ['node_modules', '.vite'],
	},
	eslintConfigPrettier,
	{
		rules: {
			indent: ['error', 'tab'],
			quotes: ['error', 'single'],
			'comma-dangle': ['error', 'always-multiline'],
			'semi-spacing': ['error', {'before': false, 'after': true}],
			semi: ['error', 'always'],
		},
	},
];
