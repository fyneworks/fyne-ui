
import { config } from './config'
import apps from './apps'

console.log('CREATE UB WITH', {config});

import { fyneHub } from '@fyne/ui/hubster';
export const Hub = window.Hub = fyneHub(config);

export const dialog = apps.dialog;
export const inline = apps.inline;