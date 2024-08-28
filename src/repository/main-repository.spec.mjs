import path from 'node:path';

import { describe, expect, test } from 'vitest';

import {
	createBookmark,
	deleteBookmark,
	listBookmarks,
} from './main-repository';

describe('main-repository test', () => {
	test('should be created a bookmark', () => {
		const input = {
			path: '/foo/bar',
			basename: path.basename('/foo/bar'),
		};

		const bookmark = createBookmark(input);

		expect(bookmark).toHaveProperty('path');
		expect(bookmark).toHaveProperty('basename');
	});

	test('should be list all bookmarks', () => {
		const input = {
			path: '/foo/bar',
			basename: path.basename('/foo/bar'),
		};

		createBookmark(input);
		const bookmarks = listBookmarks();

		expect(bookmarks.length).toBeGreaterThanOrEqual(1);
		expect(bookmarks.some((v) => v.path == input.path)).toBeTruthy();
	});

	test('should be remove bookmarks and return a empty list of bookmarks', () => {
		const input = {
			path: '/foo/bar',
			basename: path.basename('/foo/bar'),
		};

		deleteBookmark(input);
		const bookmarks = listBookmarks();

		expect(bookmarks.length).toBeGreaterThanOrEqual(0);
		expect(bookmarks.some((v) => v.path == input.path)).not.toBeTruthy();
	});
});
