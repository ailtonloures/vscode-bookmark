// Electron API
const { ipc, web } = window.electronAPI;
// IPC Channels
const ipcChannels = {
	SAVE_BOOKMARK: 'save-bookmark',
};
// Global state
const globalState = {
	isSendingFile: false,
	dropAreaDivText: {
		initial: 'Drag and drop your files or projects here.',
		drop: 'Drop...',
		wait: 'Wait...',
		success: 'Done!',
		wrong: 'Wrong!',
	},
};
// Elements
const dropAreaDiv = document.querySelector('#drop-area');

function onInit() {
	setDropAreaDivText(globalState.dropAreaDivText.initial);
}

function onDrop(event) {
	if (isSendingFile()) {
		event.preventDefault();
		return;
	}

	setSendingFileState(true);
	setDropAreaDivText(globalState.dropAreaDivText.wait);

	const file = event.dataTransfer.files[0];
	const path = web.getPathForFile(file);

	ipc.toMain(ipcChannels.SAVE_BOOKMARK, path);
}

function onCreatedBookmark(_, status) {
	const { dropAreaDivText } = globalState;

	if (status === 'OK') {
		setDropAreaDivText(
			`<span class="success">${dropAreaDivText.success}</span>`
		);
	} else {
		setDropAreaDivText(
			`<span class="danger">${dropAreaDivText.wrong}</span>`
		);
	}

	setTimeout(() => {
		setSendingFileState(false);
		setDropAreaDivText(dropAreaDivText.initial);
	}, 1500);
}

function onDropOrLeave(event) {
	if (isSendingFile()) {
		event.preventDefault();
		return;
	}

	dropAreaDiv.classList.remove('hover');
	setDropAreaDivText(globalState.dropAreaDivText.initial);
}

function onEnterOrOver(event) {
	if (isSendingFile()) {
		event.preventDefault();
		return;
	}

	dropAreaDiv.classList.add('hover');
	setDropAreaDivText(globalState.dropAreaDivText.drop);
}

function isSendingFile() {
	return globalState.isSendingFile;
}

function setSendingFileState(sending) {
	globalState.isSendingFile = sending;
}

function setDropAreaDivText(value) {
	dropAreaDiv.innerHTML = value;
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

function registerIpcRendererEvents() {
	ipc.onRenderer(ipcChannels.SAVE_BOOKMARK, onCreatedBookmark);
}

registerDOMEvents();
registerIpcRendererEvents();
