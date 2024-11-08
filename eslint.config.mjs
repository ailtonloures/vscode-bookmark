import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
	{
		files: ['src/**/*.js', 'ui/**/*.js'],
	},
	js.configs.recommended,
	{ languageOptions: { globals: { ...globals.node, ...globals.browser } } },
	{
		ignores: ['node_modules', '.vite'],
	},
	eslintConfigPrettier,
	eslintPluginPrettierRecommended,
	importPlugin.flatConfigs.recommended,
	{
		rules: {
			'import/no-unresolved': 'error',
			'import/order': [
				'error',
				{
					'groups': [
						'builtin',
						'external',
						'internal',
						['sibling', 'parent'],
						'index',
						'unknown',
					],
					'newlines-between': 'always',
					'alphabetize': {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],
			'import/default': 'off',
			'import/no-named-as-default': 'off',
			'import/namespace': 'off',
			'import/no-named-as-default-member': 'off',
		},
	},
];
