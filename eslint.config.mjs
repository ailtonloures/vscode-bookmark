import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	{
		files: ['src/**/*.{js, mjs, cjs}'],
		languageOptions: { sourceType: 'commonjs' },
	},
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	{
		ignores: ['node_modules'],
	},
	eslintConfigPrettier,
];
