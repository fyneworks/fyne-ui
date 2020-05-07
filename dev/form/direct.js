import { render } from './App';
//import { InlineWrap as FyneApp } from './inline.Wrap';
import { Form as FyneApp } from './form';

// will bundle with full depedencies, no lazy load

const inline_eid = window.FYNE_INLINE_ID || 'fwxfrm-inline';
const inline_ele = document.getElementById(inline_eid);

if(inline_ele){
    console.log('Render immediately', { inline_eid, inline_ele });
    render({FyneApp, element:inline_ele})
}
