//import React from 'react';
import { camelCase, paramCase } from "change-case";

import { script } from  './helpers/currentScript';
//console.log('fyne/ui: FYNEWORKS CONTEXT', {a:process.env.PATH,b:script.src_path,s:script,env:process.env})
//console.log('fyne/ui: FYNEWORKS CONTEXT process.env.PATH', process.env.PATH)
//console.log('fyne/ui: FYNEWORKS CONTEXT script.src_path', script.src_path)
//console.log('fyne/ui: FYNEWORKS CONTEXT process.env', process.env)
export const APP_BASE = script.src_path || process.env.PATH || './';

// expose process.env of library
export const lib_env = process.env;

// parse a process.env object
export const EnvironmentConstants = (app_env = {}) => {
    let x = /^(REACT_APP_)?(FWX_)/gi;
    let o = { APP_BASE };
    let i = Object.assign({}, app_env);
    let k = Object.keys(i).filter(n=>n.match(x));
    k.forEach(n=>{ o[n.replace(x,'FWX_').toUpperCase()] = i[n]});
    return o;
}

export const environment = (n, app_env = lib_env) => {
    const u = n.replace(/\s+/gi,'_').toUpperCase();
    //const l = n.replace(/\s+/gi,'_').toLowerCase();
    ////console.log('fyne/ui: Fyneworks config constant', u, l);
    return app_env['REACT_APP_FWX_'+u] || app_env['FWX_'+u];
    // see https://create-react-app.dev/docs/adding-custom-environment-variables/
}

export const constant = (n, app_env = lib_env) => {
    const dataset = ()=> Object.assign({}, document.body.dataset);
    const u = n.replace(/\s+/gi,'_').toUpperCase();
    const l = n.replace(/\s+/gi,'_').toLowerCase();
    ////console.log('fyne/ui: Fyneworks config constant', u, l);
    return app_env['FWX_'+u] || window['FWX_'+u] || dataset[l];
    // see https://create-react-app.dev/docs/adding-custom-environment-variables/
}

export const setting = n => {
    const fwx = Object.assign({}, window.fwx || {}, window.FWX || {});
    const u = n.replace(/\s+/gi,'_').toUpperCase();
    const l = n.replace(/\s+/gi,'_').toLowerCase();
    const c = camelCase(n.replace(/_+/gi,' '));
    ////console.log('fyne/ui: Fyneworks config setting', u, l, c);
    return fwx[u] || fwx[c] || fwx[l];
}

export const scriptProp = n => {
    const dataset = ()=> Object.assign({}, document.body.dataset);
    const c = camelCase(n.replace(/[-\s+]/gi,'_'));
    const p = paramCase(n.replace(/[-\s+]/gi,'_'));
    ////console.log('fyne/ui: Fyneworks config constant', u, l, d);
    return dataset && dataset[c] && dataset[p];
    // see https://create-react-app.dev/docs/adding-custom-environment-variables/
}


////console.log('fyne/ui: Fyneworks config EnvironmentConstants()', EnvironmentConstants())

export const ParseContext = (app_env = lib_env, defaults, overrides)=> {
    //console.log('fyne/ui: ParseContext invoked', {app_env,defaults,overrides});

    const cur_env = EnvironmentConstants(app_env);

    //console.log('fyne/ui: ParseContext invoked', {cur_env});

    let context = Object.assign(
        {}, 

        // inline defaults
        defaults || {},

        // expose all environment vars if needed
        cur_env, //{ env:Environment() },

        // run-time defaults
        {
            edition: scriptProp('edition') || constant('edition',cur_env) || setting('edition') || window['EDITION'],
            timezone: scriptProp('timezone') || constant('timezone',cur_env) || setting('timezone'), //  window['FWX_TIMEZONE'] || dataset.timezone,
            license: scriptProp('license') || constant('license',cur_env) || setting('license'),
            domain: scriptProp('domain') || constant('domain',cur_env) || setting('domain'), //  window['FWX_DOMAIN'] || dataset.domain,
            apikey: scriptProp('apikey') || constant('apikey',cur_env) || setting('apikey'), //  window['FWX_APIKEY'] || dataset.apikey,
            base: scriptProp('base') || constant('base',cur_env) || setting('base'),
            path: scriptProp('API_PATH') || constant('API_PATH',cur_env) || setting('API_PATH') || '/api',
            cur: scriptProp('cur') || constant('cur',cur_env) || setting('cur'), //  window['FWX_CUR'] || dataset.cur,
            cursym: scriptProp('cursym') || constant('cursym',cur_env) || setting('cursym'), //  window['FWX_CURSYM'] || dataset.cursym,
            curdec: scriptProp('curdec') || constant('curdec',cur_env) || setting('curdec'), //  window['FWX_CURDEC'] || dataset.curdec,

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
            console.warn("fyne/ui: ParseContext base was undefined, assuem it's https://domain");
            context.base = 'https://' + context.domain;
        }
    }
    if(!context.base){
        context.base = document.location.origin;
    }

    context.API_BASE = context.base +''+ context.path; // + '/';

    //console.log('fyne/ui: ParseContext result', {context,cur_env,app_env,defaults,overrides});

    return context;
};

//export const context = ParseContext();
//export default context;

// // dont- //console.log('fyne/ui: FYNEWORKS CONTEXT RESULT (processed process.env and others)', context);

//export const FyneContext = React.createContext(context);
