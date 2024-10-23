const { ipc, web } = window.electronAPI;

const dropAreaDiv = document.getElementById('drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach((event) => {
	dropAreaDiv.addEventListener(event, (e) => e.preventDefault());
});

// Adiciona classes de estilo ao arrastar o arquivo
['dragenter', 'dragover'].forEach((event) => {
	dropAreaDiv.addEventListener(event, () => {
		dropAreaDiv.classList.add('hover');
		dropAreaDiv.innerText = 'Solte...';
	});
});

// Remove a classe quando o arquivo não está mais sobre a área
['dragleave', 'drop'].forEach((event) => {
	dropAreaDiv.addEventListener(event, () => {
		dropAreaDiv.classList.remove('hover');
		dropAreaDiv.innerText = 'Arraste e solte seus arquivos aqui';
	});
});

dropAreaDiv.addEventListener('drop', function (event) {
	const filePath = web.getPathForFile(event.dataTransfer.files[0]);
	ipc.toMain('create-bookmark', filePath);

	console.log(filePath);
});

// toMain('create-bookmark', '/path/to/bookmark');
