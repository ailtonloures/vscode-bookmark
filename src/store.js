import Store from 'electron-store';

const store = new Store();
const storeName = 'bookmarks';

function createBookmark({ path, basename }) {
	store.set(
		storeName,
		JSON.stringify([
			{
				path,
				basename,
				id: new Date().getTime(),
			},
			...getBookmarks(),
		])
	);
}

function getBookmarks() {
	const storedBookmarks = store.get(storeName);
	const bookmarksList = storedBookmarks ? JSON.parse(storedBookmarks) : [];

	return bookmarksList;
}

function deleteBookmark(id) {
	store.set(
		storeName,
		JSON.stringify(getBookmarks().filter((item) => item.id !== id))
	);
}

export { createBookmark, deleteBookmark, getBookmarks };
