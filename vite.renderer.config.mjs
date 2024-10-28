import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	root: 'ui',
	build: {
		outDir: resolve(__dirname, '.vite', 'build'),
		minify: true,
	},
});
