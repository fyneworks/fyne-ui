import { fyneApp } from '@fyne/ui/hubster';

export const app_id = "inline";
export const ele_id = window.FYNE_INLINE_ID || 'fwxfrm-inline';
export const className = window.FYNE_INLINE_CLASS || 'fwxfrm-inline';

// this is to be moved inside hubster at some point
let isBound = false;

export const config = fyneApp(app_id);

export const render = ({ele,data,loader=true,...props}) => {
    console.log("INLINE render", {ele,data,props});
    
    const div = ele || document.getElementById(ele_id);
    if(!div){
        return console.warn("Can't reneder inline, root element not found", {app_id, ele_id});
    }

    if(!isBound){
        window.Hub.bind([app_id]);
        isBound = true;
    }

    const random = (length = 10, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')=> {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    console.log('HUB INLINE render', data, this, {app_id, ele_id, config, div});
    window.Hub.render([{
        id: app_id,
        ref: random(),
        props: {
            data,
            destroy: (args) => {
                console.log('Hub destroy', args);
                Hub.destroy([app_id]);
            }
        },
        loader: loader,
        element: div /*{
          node: div, //selector: '#'+ele_id,//,document.getElementById("fwxfrm"),
          shadow: false // material ui dialog cannot be in shadow dom
          // this solution doesn't work https://stackoverflow.com/questions/51832583/react-components-material-ui-theme-not-scoped-locally-to-shadow-dom
          // reasons described here https://github.com/mui-org/material-ui/issues/16223
        }*/,
        onRender: args => {
            console.log('HUB INLINE rendered', args);
        }
    }]);
}