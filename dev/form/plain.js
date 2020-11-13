import React from 'react';
import ReactDOM from 'react-dom';
import { Form as FyneApp } from './form';

// will bundle with full depedencies, no lazy load

import { AppID } from './../fyne/globals';
export const app_name = AppID('inline');

const inline_eid = app_name; //window.FYNE_INLINE_ID || 'fwxfrm-inline';
const inline_ele = document.getElementById(inline_eid);

//console.log('fyne/ui: Render plain FyneApp?', { inline_eid, inline_ele });

if(inline_ele){
    //console.log('fyne/ui: Render plain FyneApp immediately!', { inline_eid, inline_ele });
    ReactDOM.render(<FyneApp/>, inline_ele)
}
