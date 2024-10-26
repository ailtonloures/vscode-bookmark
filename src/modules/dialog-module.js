import { dialog } from 'electron';

async function openDialog(properties) {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties,
	});

	if (canceled) return null;

	return filePaths;
}

export { openDialog };
