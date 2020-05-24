import React from 'react'
//const React = require('react');

//import { useState, useCallback, useEffect } from 'react';
const { useState } = React;//import { useState } from 'react';
const { useEffect } = React;//import { useEffect } from 'react';
const { useCallback } = React;//import { useCallback } from 'react';

import useFetch, { Provider } from 'use-http'
import { context } from './context';
import { headers, Endpoint,
    GET,
    PUT,
    POST,
    DEL,
    PATCH,
} from './network';

export const options = {
    
    cachePolicy: 'no-cache',

    interceptors: {
        
        // every time we make an http request, this will run 1st before the request is made
        // url, path and route are supplied to the interceptor
        // request options can be modified and must be returned
        request: async ({ options, url, path, route }) => {
            //console.log('Fyneworks API intercepted request', { options, url, path, route });

            //if (isExpired(token)) {
            //    token = await getNewToken()
            //    setToken(token)
            //}
            //options.headers.Authorization = `Bearer ${token}`
            options.headers = {
                ...headers({url, method:options.method}),
                ...options.headers
            };

            return options;
        },

        // every time we make an http request, before getting the response back, this will run
        response: async ({ response }) => {
            //console.log('Fyneworks API intercepted response', { response });

            const res = response;

            //if (res.data){
            //    setData(res.data.data)
            //}

            return res
        }

    }
};

export const url = context.API_BASE;

export const FyneProvider = ({...props}) => {
    //console.log('FyneProvider INIT', props);
    return (
        <Provider url={url} options={options}>
            {props.children}
        </Provider>
    )
};

export const useFyneAPI = (url, dependencies = []) => {
    
    //const url = context.API_BASE + func;
    //console.log('useFyneAPI', { url, dependencies });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const run = useCallback((options) => {
        setError(false);
        setLoading(true);

        const method = options.method || GET;
        const endpoint = Endpoint(url);
        const request = endpoint[method];

        //console.log('useFyneAPI run', {method, options, url, endpoint, request});

        return new Promise((resolve, reject) => 
            request(options)
            .then(res=>res.json())
            .then(res=>{
                setLoading(false);
                if(res.status=='y'){
                    resolve({ data:res.data, status:res.status });
                }
                else{
                    setError(true);
                    reject({ data:res.data, status:res.status });
                }
            })
            .catch(err=>{
                setLoading(false);
                setError(true);
                reject({ data:[], status:'n' });
            })
        )

    }, [loading, error]);

    const get = query => run({ method:GET, query });
    const post = body => run({ method:PUT, body });
    const put = body => run({ method:POST, body });
    const del = body => run({ method:DEL, body });
    const patch = body => run({ method:PATCH, body });

    useEffect(()=>{
        get()
    }, dependencies)
    
    return {
        run, 
        get,
        post,
        put,
        del,
        patch,
        error,
        loading
    }
}

export const useFyneAPI____USEHTTP = (url, dependencies) => {

    //const [ data, setData ] = useState({});

    //const url = context.API_BASE + func;

    //console.log('useFyneAPI', { url, dependencies });

    const { 
        request,
        response, // � Do not destructure the `response` object!
        loading,
        error,
        data:rawData,
        cache,   // .has(), .clear(), .delete(), .get(), .set()    (similar to JS Map)
        get,
        post,
        put,
        patch,
        del,    // `delete` is a keyword
        mutate, // GraphQL
        query,  // GraphQL
        abort
    } = useFetch(
        
        // the url of the request
        url, 

        // these hold the interceptors to sign the request
        options,

        // if this is [] the request fires immediately
        // if this is undefined requests need to be invoked
        dependencies
    );

    const data = rawData && rawData.data;

    // want to use object destructuring? You can do that too
    return {
        request,
        response, // � Do not destructure the `response` object!
        loading,
        error,
        data,
        cache,   // .has(), .clear(), .delete(), .get(), .set()    (similar to JS Map)
        get,
        post,
        put,
        patch,
        del,    // `delete` is a keyword
        mutate, // GraphQL
        query,  // GraphQL
        abort
    }
};
