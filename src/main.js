import { app } from 'electron/main';
import { renderTray } from './tray.js';

app.whenReady().then(() => renderTray());
