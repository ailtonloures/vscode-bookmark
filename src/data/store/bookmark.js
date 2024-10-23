import store from './store.js';

const storeName = 'bookmarks';

function createBookmark({ path, basename }) {
	const bookmarkList = getBookmarks();

	store.set(storeName, [
		{
			path,
			basename,
			id: new Date().getTime(),
		},
		...bookmarkList,
	]);
}

function getBookmarks() {
	return store.get(storeName);
}

function deleteBookmark(id) {
	const bookmarkList = getBookmarks();

	store.set(
		storeName,
		bookmarkList.filter((item) => item.id !== id)
	);
}

export { createBookmark, deleteBookmark, getBookmarks };
