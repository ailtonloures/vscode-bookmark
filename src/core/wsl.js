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

function isPathFromWsl(path) {
	return String(path).startsWith('\\\\wsl');
}

export { wslBookmarkDataAdapter, isPathFromWsl };
