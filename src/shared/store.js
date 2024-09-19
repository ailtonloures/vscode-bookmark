import Store from 'electron-store';

const store = new Store();
const storeName = 'bookmarks';

export function createBookmark({ path, basename }) {
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

export function getBookmarks() {
	const storedBookmarks = store.get(storeName);
	const bookmarksList = storedBookmarks ? JSON.parse(storedBookmarks) : [];

	return bookmarksList;
}

export function deleteBookmark(id) {
	store.set(
		storeName,
		JSON.stringify(getBookmarks().filter((item) => item.id !== id))
	);
}
