
import { config } from './config'
import apps from './apps'

console.log('CREATE UB WITH', {config});

//import { fyneHub } from '@fyne/ui'
//export const Hub = window.Hub = fyneHub(config);

import { createHub } from 'hubster-js'
export const Hub = window.Hub = createHub(config);


export const dialog = apps.dialog;
export const inline = apps.inline;