import Store from 'electron-store';

const factory = {
	instance: null,
	createInstance: (params) => {
		if (!factory.instance) factory.instance = new Store(params);

		return factory.instance;
	},
};

export function dbInstance(params = {}) {
	return factory.createInstance(params);
}
