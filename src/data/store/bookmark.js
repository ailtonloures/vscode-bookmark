import { basename } from 'node:path';

import store from './store';

const storeName = 'bookmarks';

function createBookmark(filePath) {
	const bookmarkList = getBookmarks();

	store.set(storeName, [
		{
			path: filePath,
			basename: basename(filePath),
			id: new Date().getTime(),
		},
		...bookmarkList,
	]);
}

function getBookmarks(limit = 10) {
	return store.get(storeName).slice(0, limit);
}

function deleteBookmark(id) {
	const bookmarkList = getBookmarks();

	store.set(
		storeName,
		bookmarkList.filter((item) => item.id !== id)
	);
}

export { createBookmark, deleteBookmark, getBookmarks };
