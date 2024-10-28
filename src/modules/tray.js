import { Tray } from 'electron';

import { getIcon, getLabel } from './utils';

function createTray() {
	const icon = getIcon('tray-icon.png');
	const label = getLabel();

	const tray = new Tray(icon);
	tray.setToolTip(label);

	return tray;
}

export { createTray };
