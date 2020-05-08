import { createHub } from 'hubster-js'

export { context } from '@fyne/ui/context';

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

export const fyneApp = app_id => {
    console.log('fyneApp', {context,app_id});
    const app = fyneAppConfig({app_id,file:app_id+'.js'});
    console.log('fyneApp', {context,app_id,app});
    return app;
}
