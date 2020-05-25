import { destroy, render } from './App';
import { DialogWrap as FyneApp } from './dialog.Wrap';
//import { Form as FyneApp } from './form';
const { on } = window.Hubster;

import { AppID } from './../fyne/globals';
export const app_name = AppID('dialog');

//console.log('LOADED DIALOG',{app_name});

on(
	'render:' + app_name,
	({ onRender = () => {}, element, ...props } = {}) => {

		//console.log("DIALOG render", {element, props, onRender});
		
		render({...props, FyneApp, onRender, element});
		
	}
)

on('destroy:' + app_name, ({ onDestroy = () => {}, element } = {}) => {
	
	destroy({onDestroy, element});
})



