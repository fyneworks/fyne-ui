import { render } from './App';
//import { InlineWrap as FyneApp } from './inline.Wrap';
import { Form as FyneApp } from './form';
const { on } = window.Hubster;

import { AppID } from './../fyne/globals'
const app_name = AppID('inline');

//console.log('LOADED INLINE',{app_name});

on(
	'render:' + app_name,
	({ onRender = () => {}, element, ...props } = {}) => {

		//console.log("INLINE render", {element, props, onRender});
		
		render({...props, FyneApp, onRender, element});
		
	}
)

on('destroy:' + app_name, ({ onDestroy = () => {}, element } = {}) => {
	
	destroy({onDestroy, element});
})