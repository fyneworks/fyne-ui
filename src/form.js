import React from 'react';
//const React = require('react');

//import { useCallback } from 'react';
const { useCallback } = React;//import { useCallback } from 'react';

import { Analytics } from './analytics';
import { Antispam } from './antispam';
import { Endpoint } from './network';
//import { context } from './context';

export const FyneFormAPI = (url) => {
      //console.log('FyneFormAPI', {func});

      //const base = context.API_BASE;
      //const url = (base || '') + func;
      const endpoint = Endpoint(url);
      
      const submit = (data) => {

            const body = {
                  ...Analytics(),
                  ...Antispam(),
                  ...data
            }

            return endpoint.post({url, body})

      }

      return {
            url,
            submit,
			endpoint,
			post: submit,
      }

}


export const useFyneForm = (instanceId, {
    Form,
	cancel = (...args)=> console.warn('Must supply cancel parameter to useFyneForm', args),
	submit = (...args)=> console.warn('Must supply submit parameter to useFyneForm', args),
	initialState = {

	}
}) => {
	if(!Form) console.error('Must define Form component to use FyneForm');

	const [ state, setState ] = React.useState( initialState );

	const sync = useCallback(({...state})=> {
		setState(state);
	});

    const FyneForm = useCallback(({...moreprops})=> {
		//console.log("Fyne Form render in", {state,moreprops,Form})

		return (
			<Form 
				initialState={initialState} 
				//initialData={initialData} 
				FyneHook={{
					submit,
					sync,
				}}
				{...moreprops}
			/>
		);

	}, [ instanceId ]);

	return {
		FyneForm, 
		state,
		setState,
		cancel,
		submit,
	}
}
