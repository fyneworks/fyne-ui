
// fetch polyfill
// https://github.com/github/fetch
import 'whatwg-fetch'

import { context } from './context';

export const GET = "get";
export const PUT = "put";
export const POST = "post";
export const DEL = "delete";
export const PATCH = "patch";
export const METHODS = [
    GET,
    PUT,
    POST,
    DEL,
    PATCH,
] 

export const serialize = function(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
};

export const signature = ({license, domain, method, url})=> {
    return ''; //signature will go here';
};

export const headers = ({method, url})=> {
    const { license, domain } = context;
    return {
        "Content-Type": "application/json",
        domain,
        license,
        //signature: signature({license,domain,method,url})
    }
}


export const request = (url, {method = GET, body = null, query = {}, ...options}) => {
    //console.log('Fyne request', {url, method, body, options});

    return new Promise((resolve,reject)=>{

        const queryStr = query && serialize(query);
        const endpoint = query ? url +'?'+ queryStr : url;

        //console.log('Fyne request fetch', {url, method, body, options, queryStr, endpoint});

        fetch(
            endpoint,
            {
                method, 
                ...(
                    method===GET
                    ? {}
                    : { body: JSON.stringify(body) }
                ),
                headers: {
                    ...headers({ method, url }),
                    ...(options.headers || {})
                },
                ...options
            }
        )
        .then(res=>res.json())
        .then(res=>{
            //console.log('Fyne request resp!', res, {url, method, body, options, queryStr, endpoint});
            
            resolve(res); //({ status:200,success:true,error:null});
        })
        .catch(err=>{
            console.error('Fyne request fail!', err);
            
            reject(err); //({ status:200,success:true,error:null});
        })
        
    })
    
}

export const get = (url, {...props}) => request(url, { method:GET, ...props });
export const put = (url, {...props}) => request(url, { method:PUT, ...props });
export const post = (url, {...props}) => request(url, { method:POST, ...props });
export const del = (url, {...props}) => request(url, { method:DEL, ...props });
export const patch = (url, {...props}) => request(url, { method:PATCH, ...props });

export const Endpoint = (url) => ({
    get: ({...props}) => get(url, props),
    put: ({...props}) => put(url, props),
    post: ({...props}) => post(url, props),
    del: ({...props}) => del(url, props),
    patch: ({...props}) => patch(url, props),
});