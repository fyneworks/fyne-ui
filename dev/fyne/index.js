const APP_NAME = 'form';

if (process.env.NODE_ENV === 'production') {
    console.log('Welcome to production');
}
if (process.env.DEBUG) {
    console.log('Debugging output');
}
console.log('fyne.js process.env', {APP_NAME,ENV:process.env})

import { ready } from '@fyne-ui';

import * as api from './api';

// initialize when doc ready
ready(api.init);

// expose global methods to window
// bind to global fwx.fyne object for other fyne apps
window.fwx = window.fwx || {};
window.fwx.fyne = window.fwx.fyne || {};
window.fwx.fyne[APP_NAME] = api;