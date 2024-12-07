import { basename } from 'node:path';

import store from './store';

const storeName = 'bookmarks';

function createBookmark({ filePath, wsl = false }) {
	const bookmarkList = getBookmarks();
	const bookmarkData = {
		path: filePath,
		basename: basename(filePath),
		id: new Date().getTime(),
		wsl,
	};

	store.set(storeName, [bookmarkData, ...bookmarkList]);
}

function getBookmarks(limit = 10) {
	const bookmarkList = store.get(storeName) || [];
	return bookmarkList.slice(0, limit);
}

function deleteBookmarkById(id) {
	const bookmarkList = getBookmarks();

	store.set(
		storeName,
		bookmarkList.filter((item) => item.id !== id)
	);
}

export { createBookmark, deleteBookmarkById, getBookmarks };
