import 'unfetch/polyfill';

//const { fwxcms_analytics } = window;

// https://support.google.com/google-ads/answer/7012522?hl=en
// https://support.google.com/searchads/answer/6292795?hl=en

// ~~~~ TO DO ~~~~~
// http://webkay.robinlinus.com/
// https://www.ipify.org
// https://developers.google.com/maps/documentation/geolocation/intro
// https://ipstack.com/signup/free

const fwxcms_analytics = (override_options) => {

    const options = Object.assign({
        expiry: 90,
        params: [
            'utm_channel','utm_source','utm_medium','utm_campaign','utm_content','utm_term',
            'utm_search_engine',
            'utm_social_network',
            'utm_email_client',
            'source','team','channel','medium','campaign','affiliate','landing',
            'refq','ref',
            'gclid'
        ],
        key: 'FYNANA'
    }, override_options || {});
    //console.log('fyne/ui: utm-loader fwxcms_analytics > fwxcms_analytics', options);



    // LIBRARY - parse hostname
    const hostname = (url) => {
        var a=document.createElement('a');
        a.href=url;
        return a.hostname;
    }

    // LIBRARY - cookie & query functions
    const getCookie = (name) => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > getCookie', {name});
        var value = '; ' + document.cookie;
        var parts = value.split('; ' + name + '=');
        if (parts.length == 2) return parts.pop().split(';').shift();
    };
    const setCookie = (name, value, days) => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > setCookie', {name, value, days});
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        var expires = '; expires=' + date.toGMTString();
        document.cookie = name + '=' + value + expires + ';path=/';
    };
    const getParam = (name) => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > getParam', {name});
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        var output = (results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' ')));
        //console.log('fyne/ui: utm-loader fwxcms_analytics > getParam', {name,regex,results,output});
        return output;
    };

    // inspiration from http://stackoverflow.com/questions/1688657/how-do-i-extract-google-analytics-campaign-data-from-their-cookie-with-javascript
    // readCookie is from // http://www.quirksmode.org/js/cookies.html
    // utmcsr = utm_source
    // utmccn = utm_campaign
    // utmcmd = utm_medium
    // utmctr = utm_term
    // utmcct = utm_content
    const parseAnalyticsCookie = function() {

        var values = {};
        var cookie = getCookie("__utmz");
        if (cookie) {
            var z = cookie.split('.');
            if (z.length >= 4) {
                var y = z[4].split('|');
                for (i = 0; i < y.length; i++) {
                    var pair = y[i].split("=");
                    //values[pair[0]] = pair[1];
                    var name = pair[0];
                    if(name=='utmcsr') name = 'utm_source';
                    if(name=='utmccn') name = 'utm_campaign';
                    if(name=='utmcmd') name = 'utm_medium';
                    if(name=='utmctr') name = 'utm_term';
                    if(name=='utmcct') name = 'utm_content';
                    values[name] = pair[1];
                }
            }
        }
        //console.log('fyne/ui: utm-loader fwxcms_analytics > parseAnalyticsCookie', {values});

        return values;
    };

    /*
    More information and examples for each parameter
    Campaign Source (utm_source)
    ---
    Required. Use utm_source to identify a search engine, newsletter name, or other source.
    Example: utm_source=google
    Campaign Medium (utm_medium)
    ---
    Required. Use utm_medium to identify a medium such as email or cost-per- click.
    Example: utm_medium=cpc
    Campaign Term (utm_term)
    ---
    Used for paid search. Use utm_term to note the keywords for this ad.
    Example: utm_term=running+shoes
    Campaign Content (utm_content)
    ---
    Used for A/B testing and content-targeted ads. Use utm_content to differentiate ads or links that point to the same URL.
    Examples: utm_content=logolink or utm_content=textlink
    Campaign Name (utm_campaign)
    ---
    Used for keyword analysis. Use utm_campaign to identify a specific product promotion or strategic campaign.
    Example: utm_campaign=spring_sale
    */


    // ENCODE/DECODE json object into base64 string
    const encode = (data) => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > encode', {data});
        if(data && typeof(data)!='string'){
            data = JSON.stringify(data);
            //console.log('fyne/ui: utm-loader fwxcms_analytics > encode json string', {data});
        };
        if(data && btoa && typeof(btoa)=='function'){
            data = btoa(data);
            //console.log('fyne/ui: utm-loader fwxcms_analytics > encode base64 encoded', {data});
        };
        //console.log('fyne/ui: utm-loader fwxcms_analytics > encode done', {data});
        return data;
    };
    const decode = (data) => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > decode', {data});
        if(data && typeof(data)=='string' && atob && typeof(atob)=='function'){
            data = atob(data);
            //console.log('fyne/ui: utm-loader fwxcms_analytics > decoded base64', {data});
        };
        if(data && typeof(data)=='string'){
            data = JSON.parse(data);
            //console.log('fyne/ui: utm-loader fwxcms_analytics > parsed json string', {data});
        };
        //console.log('fyne/ui: utm-loader fwxcms_analytics > decode done', {data});
        return data;
    };


    // IMPLEMENTTATION - interpret
    const enhance_analytics = (data) => {

        return new Promise( (resolve, reject)=>{

            //console.log('fyne/ui: utm-loader enhance_analytics ------------------------', data);

            // if already enhanced, nothing else to do
            if(!!data.enhanced){
                //console.log('fyne/ui: utm-loader enhance_analytics - already enhanced', data);

                // resolve, bind this
                resolve(data);

            }

            // if no referrer, nothing else to do
            else if(!data.ref){
                //console.log('fyne/ui: utm-loader enhance_analytics - no ref', data);

                // we're done, there's nothing else to enhance
                data.enhanced = true;

                if(!!data.gclid){
                    //console.log('fyne/ui: utm-loader enhance_analytics - no referer', data);
                    data.utm_channel = data.utm_channel || 'Paid Search';
                    data.utm_source = data.utm_source || 'Google';
                    data.utm_medium = data.utm_medium || 'cpc';
                }
                else{
                    data.utm_channel = data.utm_channel || 'Direct Traffic';
                    data.utm_source = data.utm_source || '(direct)';
                    data.utm_medium = data.utm_medium || '(none)';
                }
                //console.log('fyne/ui: utm-loader enhance_analytics - no referer', data);

                // update storage, remember results of this analysis
                //set(data);

                // resolve, bind this
                resolve(data);

            }

            // if referrer, parse!
            else{
                //console.log('fyne/ui: utm-loader enhance_analytics - parse ref with refparser service', data);

                // default referral traffic channel/source/medium
                data.utm_channel = 'Referral';
                data.utm_source = hostname(data.ref);
                data.utm_medium = 'referral';

                //console.log('fyne/ui: utm-loader enhance_analytics - refparser', data);
                fetch(
                    '/fwx/node/refparser/parse?referer='+encodeURIComponent(data.ref)
                )
                    .then( x=> x && x.json && x.json() )
                    .then( x=> x && x.result )
                    .then( result=>{
                        //console.log('fyne/ui: utm-loader enhance_analytics - refparser result', {data,result});

                        // if we got a response then we're done enhancing
                        data.enhanced = true;

                        if(result){

                            //console.log('fyne/ui: utm-loader enhance_analytics - refparser enhanced!', {data,result});

                            // only enrich with this extra info if referrer is known
                            if(result.known==true){
                                //console.log('fyne/ui: utm-loader enhance_analytics - refparser known referrer!');

                                data.refq = result.search_term || data.refq || '';
                                data.utm_source = String(result.referer || data.utm_source).toLowerCase();

                                if(result.medium=='search'){
                                    //console.log('fyne/ui: utm-loader enhance_analytics - refparser known referrer - search');
                                    data.utm_search_engine = data.utm_source;
                                    if(!!data.gclid){
                                        data.utm_channel = 'Paid Search';
                                        data.utm_medium = 'cpc';
                                    }
                                    else{// if(!data.gclid){
                                        data.utm_channel = 'Organic Search';
                                        data.utm_medium = 'organic';
                                    }
                                }
                                else if(result.medium=='social'){
                                    //console.log('fyne/ui: utm-loader enhance_analytics - refparser known referrer - social');
                                    data.utm_social_network = data.utm_source;
                                    data.utm_channel = 'Social';
                                }
                                else if(result.medium=='email'){
                                    //console.log('fyne/ui: utm-loader enhance_analytics - refparser known referrer - email');
                                    data.utm_email_client = data.utm_source;
                                    data.utm_channel = 'Email';
                                };

                            }
                            else{
                                //console.log('fyne/ui: utm-loader enhance_analytics - refparser unknown referrer');

                            }

                            //console.log('fyne/ui: utm-loader enhance_analytics - refparser result SET', {data,result});

                            // update storage, remember results of this analysis
                            set(data);

                        }
                        else{
                            //console.log('fyne/ui: utm-loader enhance_analytics - refparser unknown result', {data,result});
                        }


                        //console.log('fyne/ui: utm-loader enhance_analytics - refparser result RESOLVE', {data,result});

                        // resolve, bind this
                        resolve(data);

                    })
                    .catch( e=> {
                        //console.log('fyne/ui: utm-loader enhance_analytics - refparser error', result);

                        // don't assume enhanced... try again
                        //data.enhanced = true;

                        // update storage, remember results of this analysis
                        //set(data);

                        // resolve, bind this
                        resolve(data);

                    })
                ;
                // end fetch

            }
        });
        // promise

     };
     // enhance_analytics



    // IMPLEMENTTATION - get parameters from query string and request properties
    const get_params = () => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > get_params...');
        var data = {};
        options.params.forEach( p=> {
            var v = getParam(p);
            if(v) data[p]=v;
        });
        if(!!document.referrer){
            if(window.location.hostname!=hostname(document.referrer)){
                data.ref = document.referrer;
            }
        }
        //console.log('fyne/ui: utm-loader fwxcms_analytics > get_params data', data);
        return data;
    };
    // IMPLEMENTTATION - get parameters from cookies
    const get_cookies = () => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > get_cookies...');
        var data = {};
        options.params.forEach( p=> {
            var v = getCookie(p);
            if(v) data[p]=v;
        });
        //console.log('fyne/ui: utm-loader fwxcms_analytics > get_cookies data', data);
        return data;
    };
    // IMPLEMENTTATION - retrieve parameters from storage
    const get_storage = () => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > get_storage...');
        var rawdata = window.localStorage && localStorage.getItem(options.key);
        var payload = rawdata && JSON.parse(rawdata);
        var curDate = new Date().getTime();
        var isFresh = payload && curDate < payload.expiry;
        var data = !!isFresh ? decode(payload.fynana) : {};
        //console.log('fyne/ui: utm-loader fwxcms_analytics > get_storage data', {data,rawdata,payload,curDate,isFresh});
        return data;
    };




    // IMPLEMENTTATION - get parameters from various storage locations
    const get = () => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > get...');
        const storage = get_storage();
        const cookies = get_cookies();
        const params = get_params();
        const data = Object.assign({}, storage, cookies, params);
        //console.log('fyne/ui: utm-loader fwxcms_analytics > get done', {storage,cookies,params, output:data});
        return data;
    };
    // IMPLEMENTTATION - store parameters in browser for future use
    const set = (data) => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > set...');
        set_cookies(data);
        set_storage(data);
        //console.log('fyne/ui: utm-loader fwxcms_analytics > set done', {data});
    };
    // IMPLEMENTTATION - store parameters in browser for future use
    const bind = (data) => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > bind...');

        // always default to internal method to get payload
        if(!data) data = Object.assign({}, get());

        //console.log('fyne/ui: utm-loader fwxcms_analytics > bind... GO! ONE TIME');

        enhance_analytics(data).then(data=>{

            //console.log('fyne/ui: utm-loader fwxcms_analytics > bind... GO! ONE TIME data', {data});

            //console.log('fyne/ui: utm-loader fwxcms_analytics > bind... GO! ONE TIME data > bind_to_forms', {data});
            bind_to_forms(data);
        })

        //console.log('fyne/ui: utm-loader fwxcms_analytics > bind done', {data});
    };



    // IMPLEMENTTATION - store parameters in browser for future use
    const set_cookies = (data) => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > set_cookies', {data});
        var cata = {};
        options.params.forEach(p=>{
            if(!data[p]) return;
            setCookie(p, data[p], options.expiry);
            cata[cata.length] = data[p];
        });
        if(cata && Object.keys(cata).length){
            setCookie(options.key, encode(cata), options.expiry);
        }
    };
    // IMPLEMENTTATION - store parameters in browser for future use
    const set_storage = (data) => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > set_storage', {data});
        if (window.localStorage) {
            var expPeriod = options.expiry * (24 * 60 * 60 * 1000); // 90 day expiry in milliseconds
            var expDate = new Date().getTime() + expPeriod;
            var payload = {
                fynana: encode(data),
                expiry: expDate
            };
            localStorage.setItem(options.key, JSON.stringify(payload));
            return true;
        }
        return false;
    };
    // IMPLEMENTTATION - bing parameters to all forms?
    const bind_to_forms = (data) => {
        //console.log('fyne/ui: utm-loader fwxcms_analytics > bind_to_forms', {data});

        // quit if we don't want to bind parameters to forms
        if(!data || !options.params) return;

        // remove existing parameters from all forms
        //console.log('fyne/ui: utm-loader fwxcms_analytics > bind_to_forms', 'remove existing tokens from all forms');
        options.params.forEach(p=>{
            [...document.getElementsByName(p)].forEach((x) => x.remove());
        });

        //console.log('fyne/ui: utm-loader fwxcms_analytics > bind_to_forms invoking enhance_analytics', {data});

        // enhance analytics, parse referer, etc...
        enhance_analytics(data).then(data=>{

            //console.log('fyne/ui: utm-loader fwxcms_analytics > bind_to_forms > enhance_analytics > result', {data});

            // add new parameters to all forms
            //console.log('fyne/ui: utm-loader fwxcms_analytics > bind_to_forms', 'add new token to all forms');
            [...document.getElementsByTagName('form')].map((f) => {
                // never do this on gateway checkout forms
                if (f.matches && f.matches('.no-analytics')) return;
                // loop through analytics params
                options.params.forEach(p=>{
                    if(data && data[p]){
                        var i = document.createElement('input');
                        i.type = 'hidden';
                        i.name = p;
                        i.value = data[p];
                        f.appendChild(i);
                    }
                });
            });

        });
    };

    // function that will listen for user interaction events and load then bind to forms
    const watch = () => {
        //console.log('fyne/ui: utm-loader lazybind watch');
        const events = ["click","touch","scroll","focus","focusin","focusout","mousemove"];
        const load = e => {
            //console.log('fyne/ui: utm-loader lazybind', 'e.target',e.target, {e});

            // e.target was the clicked element
            if (e.type=='click' || e.type=='touch' || e.type=='scroll' || (e.target && e.target.matches && e.target.matches("form,input,select,textarea,label"))){
                //console.log('fyne/ui: utm-loader lazybind start', e.type, e.target, {e});

                // remove all listeners, only run this once
                events.forEach( event => document.removeEventListener(event, load));

                // one time only!!!
                //console.log('fyne/ui: utm-loader lazybind watch resolved, ONE TIME');

                // bind to forms
                bind();

            }
        };
        events.forEach( event => document.addEventListener(event, load));

        // let application know we're waiting for form activity
        return true;
    };

    // store new gclid if received via query parameter
    const init = ()=>{

        // look for new parameters in query string
        const params = get_params();
        if(params && Object.keys(params).length){

            // get all existing analytics data,
            const data = Object.assign(parseAnalyticsCookie(), get());

            // reset enhancement setting
            data.enhanced = false;

            // remember where we started
            data.landing = window.location + '';

            // store it in cookies and local storage for future use
            set(data);

        };

        // bind to forms and window object
        //bind(get()); - this would cause network activity and hurt SEO scores
        //watch(); // only bind if we detect user interaction
        window.addEventListener('load', watch);

    };


    // expose object to window
    const fynana = {
        encode,
        decode,
        setCookie,
        getCookie,
        watch,
        init,
        get,
        get_storage,
        get_cookies,
        get_params,
        set,
        set_storage,
        set_cookies,
        bind
    };
    fynana.init();
    window.fynana = fynana;
    return fynana;
};
fwxcms_analytics(); //window.addEventListener('load', fwxcms_analytics);


export const Analytics = (defaults)=> {
    const fynana = fwxcms_analytics && fwxcms_analytics().get();
    return Object.assign({}, defaults || {}, fynana || {});
};