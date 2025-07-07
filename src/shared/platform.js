/**
 * Checks if the current platform matches the specified platform(s).
 *
 * @param {string | string[]} [platform=[]] - The platform or array of platforms to check against.
 *                                            Supports 'win32', 'darwin', 'linux', or an array of these.
 * @returns {boolean} True if the current platform matches the specified platform(s), false otherwise.
 */
export function platform(platform = [] | 'win32' | 'darwin' | 'linux') {
	if (Array.isArray(platform)) {
		return platform.includes(process.platform);
	}

	return process.platform === platform;
}
