import React from 'react';
import ReactDOM from 'react-dom';
import { Form as FyneApp } from './form';

// will bundle with full depedencies, no lazy load

const inline_eid = window.FYNE_INLINE_ID || 'fwxfrm-inline';
const inline_ele = document.getElementById(inline_eid);

console.log('Render plain FyneApp?', { inline_eid, inline_ele });

if(inline_ele){
    console.log('Render plain FyneApp immediately!', { inline_eid, inline_ele });
    ReactDOM.render(<FyneApp/>, inline_ele)
}
