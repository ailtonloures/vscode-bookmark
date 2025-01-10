/* eslint-disable no-undef */
function isDevMode() {
	return !!MAIN_WINDOW_VITE_DEV_SERVER_URL;
}

function devURL() {
	return MAIN_WINDOW_VITE_DEV_SERVER_URL;
}

export { devURL, isDevMode };
