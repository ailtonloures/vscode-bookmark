import { Store } from '../config/store.js';

const store = Store.getInstance();
const storeName = 'bookmarks';

/**
 * Bookmark Repository
 */
const BookmarkRepository = {
	/**
	 * @typedef Bookmark
	 * @property {string} path - File path
	 * @property {string} basename - File basename
	 * @property {number|undefined} id - Timestamp id
	 */

	/**
	 * Create a new bookmark
	 * @param {Bookmark}
	 */
	create({ path, basename }) {
		store.set(
			storeName,
			JSON.stringify([
				{
					path,
					basename,
					id: new Date().getTime(),
				},
				...this.get(),
			])
		);
	},

	/**
	 * Get all bookmarks
	 * @returns {Bookmark[]}
	 */
	get() {
		const storedBookmarks = store.get(storeName);
		const bookmarksList = storedBookmarks ? JSON.parse(storedBookmarks) : [];

		return bookmarksList;
	},

	/**
	 * Delete a selected bookmark
	 * @param {number} id - Timestamp id
	 */
	delete(id) {
		store.set(
			storeName,
			JSON.stringify(this.get().filter((item) => item.id !== id))
		);
	},
};

export { BookmarkRepository };
