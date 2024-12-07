function wslBookmarkDataAdapter(path) {
	const sanitizedPath = String(path)
		.replaceAll('\\', '/')
		.replace('.localhost/', '+');
	const filePath = `vscode-remote:${sanitizedPath}`;

	return {
		filePath,
		wsl: true,
	};
}

function isFilePathFromWsl(path) {
	return String(path).startsWith('\\\\wsl');
}

export { wslBookmarkDataAdapter, isFilePathFromWsl };
