import { app } from 'electron';

function getLabel() {
	return `${app.getName()} - v${app.getVersion()}`;
}

export { getLabel };
