import Loki from 'lokijs';
import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { dbInstance } from './loki-factory';

const databasePath = path.resolve(__dirname, '..', '..', 'data.db');

describe('loki-factory integration test', () => {
	test('should be have a instance from loki', () => {
		const instance = dbInstance();

		expect(instance).toBeInstanceOf(Loki);
		expect(fs.existsSync(databasePath)).toBeTruthy();
	});
});
