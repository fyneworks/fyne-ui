import { render } from './App';
//import { InlineWrap as FyneApp } from './inline.Wrap';
import { Form as FyneApp } from './form';
const { on } = window.Hubster;

on(
	'render:inline',
	({ onRender = () => {}, element, ...props } = {}) => {

		console.log("INLINE render", {element, props, onRender});
		
		render({...props, FyneApp, onRender, element});
		
	}
)

on('destroy:inline', ({ onDestroy = () => {}, element } = {}) => {
	
	destroy({onDestroy, element});
})


