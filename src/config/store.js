import ElectronStore from 'electron-store';

/**
 * Store configuration
 */
const Store = {
	/**
	 * @private
	 * @type {ElectronStore}
	 */
	instance: null,

	/**
	 * Returns a ElectronStore instance.
	 * @return {ElectronStore}
	 */
	getInstance: () => {
		if (!Store.instance) {
			Store.instance = new ElectronStore();
		}

		return Store.instance;
	},
};

export { Store };
