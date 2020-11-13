import { AppID } from './globals';
import { fyneApp } from '@fyne/ui/hubster';
import { ThisHub } from './hub';

export const script = "dialog.js";
export const app_id = AppID('dialog');
export const ele_id = AppID('dialog');
export const className = AppID('dialog');

const div  = document.createElement("div");

// this is to be moved inside hubster at some point
let isBound = false;

export const config = fyneApp({app_id,ele_id,script});

export const render = (data) => {
    
    div.setAttribute("id", ele_id)
    if(!document.body.contains(div)){
        document.body.appendChild(div)
    }
    if(!isBound){
        ThisHub.bind([app_id]);
        isBound = true;
    }

    console.log('fyne/ui: REVIVE? consume', app_id+'__revive', window[app_id+'__revive'])
    if(!!window[app_id+'__revive']){
        console.log("fyne/ui: Fyne don't render, just show again");
        window[app_id+'__revive']()
    }
    
    console.log('fyne/ui: HUB DIALOG render', data, this, {app_id, ele_id, config, div});
    ThisHub.render([{
        id: app_id,
        props: {
            data,
            destroy: (args) => {
                console.log('fyne/ui: Hub destroy', args);
                Hub.destroy([app_id]);
            }
        },
        element: {
          selector: '#'+ele_id,//,document.getElementById("fwxfrm"),
          shadow: false // material ui dialog cannot be in shadow dom
          // this solution doesn't work https://stackoverflow.com/questions/51832583/react-components-material-ui-theme-not-scoped-locally-to-shadow-dom
          // reasons described here https://github.com/mui-org/material-ui/issues/16223
        },
        onRender: args => {
            console.log('fyne/ui: HUB DIALOG rendered', args);
        }
    }]);
}