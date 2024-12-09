import ElectronStore from 'electron-store';

export default new ElectronStore({
	bookmarks: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				path: { type: 'string' },
				basename: { type: 'string' },
				id: { type: 'number' },
			},
			required: ['path', 'basename', 'id'],
		},
	},
});
