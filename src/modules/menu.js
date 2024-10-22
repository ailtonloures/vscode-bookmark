import { Menu } from 'electron/main';

function createMenu(template = []) {
	return Menu.buildFromTemplate(template);
}

export { createMenu };
