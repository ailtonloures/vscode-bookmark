import { Menu } from 'electron';

function createMenu(template = []) {
	return Menu.buildFromTemplate(template);
}

export { createMenu };
