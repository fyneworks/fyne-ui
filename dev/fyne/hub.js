
import { config } from './config'
import apps from './apps'

//console.log('CREATE HUB WITH', {config});

import { fyneHub } from '@fyne/ui/hubster';
export const ThisHub = fyneHub(config);
//console.log('HUB CREATED', {config, ThisHub, Hubster:window.Hubster});


export const dialog = apps.dialog;
export const inline = apps.inline;