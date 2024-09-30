import { Store } from './config/index.js';

const store = Store.getInstance();
const storeName = 'bookmarks';

/**
 * Define BookmarkData
 * @typedef BookmarkData
 * @property {string} path - File path
 * @property {string} basename - File basename
 * @property {number|undefined} id - Timestamp id
 */

/**
 * Define Bookmark store access method
 */
export const BookmarkStore = {
	/**
	 * Create a new bookmark
	 * @param {BookmarkData}
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
	 * @returns {BookmarkData[]}
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
