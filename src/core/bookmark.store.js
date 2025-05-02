import ElectronStore from 'electron-store';

/**
 * Types
 *
 * @typedef BookmarkObject
 * @type {object}
 * @property {string} path
 * @property {number} id
 * @property {string} basename
 * @property {string|null} remotePath
 *
 * Bookmark Store
 * @class
 */
export class BookmarkStore {
	/**
	 * @constructor
	 */
	constructor() {
		/**
		 * The name of the store
		 * @private
		 * @type {string}
		 */
		this._storeName = 'bookmarks';

		/**
		 * The store instance
		 * @private
		 * @type {ElectronStore}
		 */
		this._store = new ElectronStore({
			[this._storeName]: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: { type: 'number' },
						path: { type: 'string' },
						basename: { type: 'string' },
						remotePath: { type: 'string' },
					},
					required: ['id', 'path', 'basename'],
				},
			},
		});

		/**
		 * The path of the store
		 * @type {string}
		 */
		this.path = this._store.path;
	}

	/**
	 * Save a bookmark in the store
	 * @param {BookmarkObject} bookmark
	 */
	save(bookmark) {
		this._store.set(this._storeName, [bookmark, ...this.get()]);
	}

	/**
	 * Get all bookmarks
	 * @returns {Array<BookmarkObject>}
	 */
	get() {
		return this._store.get(this._storeName) || [];
	}

	/**
	 * Remove a bookmark by id
	 * @param {BookmarkObject['id']} id
	 */
	remove(id) {
		const filteredBookmarkList = this.get().filter(
			(bookmark) => bookmark.id !== id
		);

		this._store.set(this._storeName, filteredBookmarkList);
	}
}
