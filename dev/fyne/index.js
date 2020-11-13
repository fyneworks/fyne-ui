import { FormID } from './globals'

if (process.env.NODE_ENV === 'production') {
    //console.log('fyne/ui: Welcome to production: '+ FormID);
}
if (process.env.DEBUG) {
    //console.log('fyne/ui: Debugging output: '+ FormID);
}
//console.log('fyne/ui: fyne.js process.env', {FormID,ENV:process.env})

import { ready } from '@fyne/ui/helpers'; //'@fyne/ui/src/helpers/ready';

import * as api from './api';

//console.log('fyne/ui: FYNEFORM > DEMO > START?',{readyState:document.readyState,ready:(document.readyState && /loaded|complete/.test(document.readyState)),api});
// initialize when doc ready
ready(api.init);

// expose global methods to window
// bind to global fwx.fyne object for other fyne apps
window.fwx = window.fwx || {};
window.fwx.fyne = window.fwx.fyne || {};
window.fwx.fyne[FormID] = api;
//console.log('fyne/ui: fwx.fyne.form api', {FormID,api});