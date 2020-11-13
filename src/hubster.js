//import { context } from './context';
import { ParseContext } from '@fyne/ui/context';

import Hubster from 'hubster-js';
const { createHub } = Hubster;
//console.log('Hubster', Hubster);
//console.log('createHub', createHub);

const context = ParseContext(process.env);

export const fyneHub = createHub;

export const fyneAppConfig = ({app_id,ele_id,file}) => {
    ele_id = ele_id || (ele_id || (app_id+'-root'));
    return {
        name: app_id,
        id: app_id,
        el: {
            type: 'div',
            attrs: [{ type: 'id', value: ele_id }],
            sel: '#'+ele_id
        },
        global_dependencies: ['react', 'react-dom'],
        url: context.APP_BASE + (file || (app_id+'.js'))
    }
};

export const fyneApp = ({app_id,ele_id,script,...props}) => {
    //console.log('fyneApp >>>>>>>>>>>>>', {context,app_id,ele_id,script,props});

    const config = {
        app_id,
        ele_id,
        file: script || app_id+'.js',
        ...props
    };

    const app = fyneAppConfig(config);
    
    //console.log('fyneApp', {context,app_id,app});
    return app;
}
