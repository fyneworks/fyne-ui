import React from 'react';
import ReactDOM from 'react-dom';
//import { Form as FyneApp } from './form';
import { App as FyneApp } from './App';

// will bundle with full depedencies, no lazy load

const inline_eid = window.FYNE_UI_PLAIN_EID || 'fyne-ui-plain';
const inline_ele = document.getElementById(inline_eid);

console.log('Render plain FyneApp?', { inline_eid, inline_ele });

if(inline_ele){
    console.log('Render plain FyneApp immediately!', { inline_eid, inline_ele });
    ReactDOM.render(<FyneApp/>, inline_ele)
}
