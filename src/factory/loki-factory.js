import fs from 'node:fs';
import path from 'node:path';

import Loki from 'lokijs';

const factory = {
	instance: null,
	createInstance: () => {
		const databasePath = path.resolve(
			import.meta.dirname,
			'..',
			'..',
			'data.db',
		);

		if (!fs.existsSync(databasePath)) {
			fs.openSync(databasePath, 'w+');
		}

		if (!factory.instance) {
			factory.instance = new Loki(databasePath);
		}

		return factory.instance;
	},
};

export function dbInstance() {
	return factory.createInstance();
}
