const path = require('node:path');
const fs = require('node:fs');

const Loki = require('lokijs');

const factory = {
	instance: null,
	createInstance: () => {
		const databasePath = path.resolve(__dirname, '..', '..', 'data.db');

		if (!fs.existsSync(databasePath)) {
			fs.openSync(databasePath, 'w+');
		}

		if (!factory.instance) {
			factory.instance = new Loki(databasePath);
		}

		return factory.instance;
	},
};

module.exports = {
	dbInstance: () => factory.createInstance(),
};
