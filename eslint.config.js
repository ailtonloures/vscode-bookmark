import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
	},
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	{
		ignores: ['node_modules'],
	},
	eslintConfigPrettier,
];
