//import { script } from  './../helpers/currentScript';
//const BASE_PATH = process.env.PATH || script.src_path || './';
//console.log('fwxfrm factory process.env', {BASE_PATH, env:process.env, script, process})

import { context } from '@fyne/ui';
console.log('fwxfrm factory context', context);


export const fyne_app_config = ({app_id,ele_id,file}) => {
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

export const fyne_app = app_id =>
  fyne_app_config({app_id,file:app_id+'.js'})

