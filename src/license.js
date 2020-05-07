import { Config } from './config'

export const License = ()=> {
    let license = '';
    let config = Config();
    
    if(!license) license = config.license;
    if(!license) license = document.body.dataset.license;

    return license;
};