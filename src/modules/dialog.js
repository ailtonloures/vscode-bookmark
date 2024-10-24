import { dialog } from 'electron';

async function openDialog(properties = ['openDirectory']) {
	return dialog.showOpenDialog({
		properties,
	});
}

export { openDialog };
