//import React from 'react';
import { camelCase, paramCase } from "change-case";

import { script } from  './helpers/currentScript';
//console.log('FYNEWORKS CONTEXT', {a:process.env.PATH,b:script.src_path,s:script,env:process.env})
//console.log('FYNEWORKS CONTEXT process.env.PATH', process.env.PATH)
//console.log('FYNEWORKS CONTEXT script.src_path', script.src_path)
//console.log('FYNEWORKS CONTEXT process.env', process.env)
const APP_BASE = script.src_path || process.env.PATH || './';

export const EnvironmentConstants = () => {
    let x = /^(REACT_APP_)?(FWX_)/gi;
    let o = { APP_BASE };
    let i = Object.assign({}, process.env)
    let k = Object.keys(i).filter(n=>n.match(x));
    k.forEach(n=>{ o[n.replace(x,'FWX_').toUpperCase()] = i[n]});
    return o;
}

export const environment = n => {
    const u = n.replace(/\s+/gi,'_').toUpperCase();
    //const l = n.replace(/\s+/gi,'_').toLowerCase();
    ////console.log('Fyneworks config constant', u, l);
    return process.env['REACT_APP_FWX_'+u] || process.env['FWX_'+u];
    // see https://create-react-app.dev/docs/adding-custom-environment-variables/
}

export const constant = n => {
    const dataset = ()=> Object.assign({}, document.body.dataset);
    const u = n.replace(/\s+/gi,'_').toUpperCase();
    const l = n.replace(/\s+/gi,'_').toLowerCase();
    ////console.log('Fyneworks config constant', u, l);
    return process.env['REACT_APP_FWX_'+u] || process.env['FWX_'+u] || window['FWX_'+u] || dataset[l];
    // see https://create-react-app.dev/docs/adding-custom-environment-variables/
}

export const setting = n => {
    const fwx = Object.assign({}, window.fwx || {}, window.FWX || {});
    const u = n.replace(/\s+/gi,'_').toUpperCase();
    const l = n.replace(/\s+/gi,'_').toLowerCase();
    const c = camelCase(n.replace(/_+/gi,' '));
    ////console.log('Fyneworks config setting', u, l, c);
    return fwx[u] || fwx[c] || fwx[l];
}

export const scriptProp = n => {
    const dataset = ()=> Object.assign({}, document.body.dataset);
    const c = camelCase(n.replace(/[-\s+]/gi,'_'));
    const p = paramCase(n.replace(/[-\s+]/gi,'_'));
    ////console.log('Fyneworks config constant', u, l, d);
    return dataset && dataset[c] && dataset[p];
    // see https://create-react-app.dev/docs/adding-custom-environment-variables/
}


////console.log('Fyneworks config EnvironmentConstants()', EnvironmentConstants())

export const ParseContext = (defaults, overrides)=> {
    //console.log('ParseContext invoked');

    let context = Object.assign(
        {}, 

        // inline defaults
        defaults || {},

        // expose all environment vars if needed
        EnvironmentConstants(), //{ env:Environment() },

        // run-time defaults
        {
            edition: scriptProp('edition') || constant('edition') || setting('edition') || window['EDITION'],
            timezone: scriptProp('timezone') || constant('timezone') || setting('timezone'), //  window['FWX_TIMEZONE'] || dataset.timezone,
            license: scriptProp('license') || constant('license') || setting('license'),
            domain: scriptProp('domain') || constant('domain') || setting('domain'), //  window['FWX_DOMAIN'] || dataset.domain,
            base: scriptProp('base') || constant('base') || setting('base'),
            path: scriptProp('API_PATH') || constant('API_PATH') || setting('API_PATH') || '/api',
            cur: scriptProp('cur') || constant('cur') || setting('cur'), //  window['FWX_CUR'] || dataset.cur,
            cursym: scriptProp('cursym') || constant('cursym') || setting('cursym'), //  window['FWX_CURSYM'] || dataset.cursym,
            curdec: scriptProp('curdec') || constant('curdec') || setting('curdec'), //  window['FWX_CURDEC'] || dataset.curdec,

        },

        // core config
        window.fwx && (window.fwx.config || {}),

        // site config
        window.FWX || {},

        // accept runtime overrides
        overrides || {},

    );

    if(!context.base){
        if(context.domain){
            context.base = 'https://' + context.domain;
        }
    }
    if(!context.base){
        context.base = document.location.origin;
    }

    context.API_BASE = context.base +''+ context.path; // + '/';

    return context;
};

export const context = ParseContext();

export default context;

//console.log('FYNEWORKS CONTEXT RESULT (processed process.env and others)', context);

//export const FyneContext = React.createContext(context);
