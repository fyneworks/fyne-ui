import { fyneApp } from '@fyne-ui'

export const app_id = "dialog";
export const ele_id = window.FYNE_DIALOG_ID || "fwxfrm-dialog";

const div  = document.createElement("div");

// this is to be moved inside hubster at some point
let isBound = false;

export const config = fyneApp(app_id);

export const render = (data) => {
    
    div.setAttribute("id", ele_id)
    if(!document.body.contains(div)){
        document.body.appendChild(div)
    }
    if(!isBound){
        window.Hub.bind([app_id]);
        isBound = true;
    }

    if(!!window.showAgain){
        console.log("Fyne don't render, just show again");
        window.showAgain();
    }
    
    console.log('HUB DIALOG render', data, this, {app_id, ele_id, config, div});
    window.Hub.render([{
        id: app_id,
        props: {
            data,
            destroy: (args) => {
                console.log('Hub destroy', args);
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
            console.log('HUB DIALOG rendered', args);
        }
    }]);
}