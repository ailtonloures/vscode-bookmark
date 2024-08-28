const { dbInstance } = require('./../factory');

const collectionName = 'bookmarks';
const collection =
	dbInstance().getCollection(collectionName) ||
	dbInstance().addCollection(collectionName);

function createBookmark(input) {
	const createdBookmark = collection.insert(input);

	return createdBookmark;
}

function listBookmarks() {
	return collection.chain().simplesort('basename').data();
}

function deleteBookmark(input) {
	collection.findAndRemove({
		path: {
			$eq: input.path,
		},
	});
}

module.exports = {
	createBookmark,
	listBookmarks,
	deleteBookmark,
};
