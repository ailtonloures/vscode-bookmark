import { statSync } from 'node:fs';

function isFile(filePath) {
	return statSync(filePath).isFile();
}

export { isFile };
