// Electron API
const { ipc, web } = window.electronAPI;
// IPC Channels
const ipcChannels = {
	CREATE_BOOKMARK: 'create-bookmark',
};
// Global state
const globalState = {
	sendingFile: false,
	dropAreaDiv: {
		initial: 'Drag and drop your files or projects here.',
		drop: 'Drop...',
		wait: 'Wait...',
		success: 'Success!',
	},
};
// Elements
const dropAreaDiv = document.querySelector('#drop-area');

function onInit() {
	dropAreaDiv.textContent = globalState.dropAreaDiv.initial;
}

function onDrop(event) {
	if (globalState.sendingFile === true) {
		event.preventDefault();
		return;
	}

	globalState.sendingFile = true;
	dropAreaDiv.textContent = globalState.dropAreaDiv.wait;

	const file = event.dataTransfer.files[0];
	const filePath = web.getPathForFile(file);

	ipc.toMain(ipcChannels.CREATE_BOOKMARK, filePath);
}

function onCreatedBookmark(success) {
	if (success) {
		dropAreaDiv.innerHTML = `<span class="success">${globalState.dropAreaDiv.success}</span>`;
	}

	setTimeout(() => {
		globalState.sendingFile = false;
		dropAreaDiv.textContent = globalState.dropAreaDiv.initial;
	}, 1500);
}

function onDropOrLeave(event) {
	if (globalState.sendingFile === true) {
		event.preventDefault();
		return;
	}

	dropAreaDiv.classList.remove('hover');
	dropAreaDiv.textContent = globalState.dropAreaDiv.initial;
}

function onEnterOrOver(event) {
	if (globalState.sendingFile === true) {
		event.preventDefault();
		return;
	}

	dropAreaDiv.classList.add('hover');
	dropAreaDiv.textContent = globalState.dropAreaDiv.drop;
}

function registerDOMEvents() {
	// Window events
	window.addEventListener('DOMContentLoaded', onInit);

	// Drop Area events
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach((event) =>
		dropAreaDiv.addEventListener(event, (e) => e.preventDefault())
	);
	['dragleave', 'drop'].forEach((event) =>
		dropAreaDiv.addEventListener(event, onDropOrLeave)
	);
	['dragenter', 'dragover'].forEach((event) =>
		dropAreaDiv.addEventListener(event, onEnterOrOver)
	);
	dropAreaDiv.addEventListener('drop', onDrop);
}

function registerIPCEvents() {
	ipc.onRenderer(ipcChannels.CREATE_BOOKMARK, onCreatedBookmark);
}

registerDOMEvents();
registerIPCEvents();
