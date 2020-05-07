import { destroy, render } from './App';
import { DialogWrap as FyneApp } from './dialog.Wrap';
//import { Form as FyneApp } from './form';
const { on } = window.Hubster;

on(
	'render:dialog',
	({ onRender = () => {}, element, ...props } = {}) => {

		console.log("DIALOG render", {element, props, onRender});
		
		render({...props, FyneApp, onRender, element});
		
	}
)

on('destroy:dialog', ({ onDestroy = () => {}, element } = {}) => {
	
	destroy({onDestroy, element});
})



