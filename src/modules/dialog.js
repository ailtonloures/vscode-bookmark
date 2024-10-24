import { dialog } from 'electron/main';

async function openDialog(properties = ['openDirectory']) {
	return dialog.showOpenDialog({
		properties,
	});
}

export { openDialog };
