import { config } from './config'
import * as apps from './apps'

import { createHub } from 'hubster-js'
export const Hub = window.Hub = createHub(config);

export const dialog = apps.dialog;
export const inline = apps.inline;