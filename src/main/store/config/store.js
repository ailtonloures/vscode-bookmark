import ElectronStore from 'electron-store';

/**
 * Store configuration
 * @class
 */
export const Store = {
	/**
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
