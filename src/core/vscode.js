import { spawn } from 'node:child_process';

function openIntoVsCode(path, extraArgs = []) {
	const commandArgs = [...extraArgs, `"${path}"`];

	spawn('code', commandArgs, { shell: true });
}

export { openIntoVsCode };
