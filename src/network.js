
// fetch polyfill
// https://github.com/github/fetch
import 'whatwg-fetch'

//import { context } from './context';
import { ParseContext } from '@fyne/ui/context';
//const context = ParseContext(process.env);


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

export const signature = ({ domain, license, apikey, method, url })=> {
    return ''; //signature will go here';
};

export const headers = ({method, url, context})=> {
    const { domain, license, apikey } = context;
    return {
        "Content-Type": "application/json",
        domain: domain || '',
        license: license || '',
        apikey: apikey || '',
        signature: signature({ domain, license, apikey, method, url })
    }
}


export const request = (
    url, 
    {
        method = GET, 
        body = null, 
        query = {}, 
        context = null,
        ...options
    }) => {
    //console.log('Fyne request', {url, method, body, options});

    return new Promise((resolve,reject)=>{

        const queryStr = query && serialize(query);
        const endpoint = query ? url +'?'+ queryStr : url;

        context = context || ParseContext(process.env);
        console.log('Fyne request fetch', {env: process.env, url, method, body, options, queryStr, endpoint, context});

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
                    ...headers({ method, url, context }),
                    ...(options.headers || {})
                },
                ...options
            }
        )

        // this forces everything to be json
        //
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

export const Endpoint = ({url, context}) => ({
    get: ({...props}) => get(url, {...props, context}),
    put: ({...props}) => put(url, {...props, context}),
    post: ({...props}) => post(url, {...props, context}),
    del: ({...props}) => del(url, {...props, context}),
    patch: ({...props}) => patch(url, {...props, context}),
});