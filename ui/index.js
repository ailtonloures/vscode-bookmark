// API
const { ipc, web } = window.electronAPI;
// Elements
const dropAreaDiv = document.getElementById('drop-area');
const infoSpan = document.querySelector('#information span');
// Elements state
const state = {
	dropAreaDiv: {
		initial: 'Drag and drop your files or projects here',
		drop: 'Drop...',
	},
	infoSpan: {
		initial: 'No files or projects found',
	},
};

function onInit() {
	dropAreaDiv.innerText = state.dropAreaDiv.initial;
	infoSpan.textContent = state.infoSpan.initial;
}

function onDrop(event) {
	const filePath = web.getPathForFile(event.dataTransfer.files[0]);
	infoSpan.textContent = filePath;

	ipc.toMain('create-bookmark', filePath);
	console.log(filePath);
}

function onDropOrLeave() {
	dropAreaDiv.classList.remove('hover');
	dropAreaDiv.innerText = state.dropAreaDiv.initial;
}

function onEnterOrOver() {
	dropAreaDiv.classList.add('hover');
	dropAreaDiv.innerText = state.dropAreaDiv.drop;
}

function registerDOMEvents() {
	// Window events
	window.addEventListener('DOMContentLoaded', onInit);

	// Drop Area events
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach((event) =>
		dropAreaDiv.addEventListener(event, (e) => e.preventDefault())
	);
	['dragleave', 'drop'].forEach((event) => {
		dropAreaDiv.addEventListener(event, onDropOrLeave);
	});
	['dragenter', 'dragover'].forEach((event) => {
		dropAreaDiv.addEventListener(event, onEnterOrOver);
	});
	dropAreaDiv.addEventListener('drop', onDrop);
}

registerDOMEvents();
