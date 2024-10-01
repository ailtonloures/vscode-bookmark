import ElectronStore from 'electron-store';

/**
 * Store configuration
 */
export const Store = {
	/**
	 * Instance of Store
	 * @type {ElectronStore|null}
	 * @private
	 */
	instance: null,

	/**
	 * Returns a ElectronStore instance.
	 * @return {ElectronStore}
	 */
	getInstance() {
		if (!this.instance) {
			this.instance = new ElectronStore();
		}

		return this.instance;
	},
};
