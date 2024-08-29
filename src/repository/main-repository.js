import { dbInstance } from './../factory/index.js';

const collectionName = 'bookmarks';
const collection =
	dbInstance().getCollection(collectionName) ||
	dbInstance().addCollection(collectionName);

export function createBookmark(input) {
	const createdBookmark = collection.insert(input);

	return createdBookmark;
}

export function listBookmarks() {
	return collection.chain().simplesort('basename').data();
}

export function deleteBookmark(input) {
	collection.findAndRemove({
		path: {
			$eq: input.path,
		},
	});
}
