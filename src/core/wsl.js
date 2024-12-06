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

function filePathIsFromWsl(path) {
	return String(path).includes('wsl');
}

export { wslBookmarkDataAdapter, filePathIsFromWsl };
