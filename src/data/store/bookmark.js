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

function getBookmarks() {
	return store.get(storeName).slice(0, 10);
}

function deleteBookmark(id) {
	const bookmarkList = getBookmarks();

	store.set(
		storeName,
		bookmarkList.filter((item) => item.id !== id)
	);
}

export { createBookmark, deleteBookmark, getBookmarks };
