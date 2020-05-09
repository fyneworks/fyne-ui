//import React from 'react';
const React = require('react');

//import { useCallback } from 'react';
const { useCallback } = React;//import { useCallback } from 'react';

import { Analytics } from './analytics';
import { Antispam } from './antispam';
import { Endpoint } from './network';
import { context } from './context';

export const FyneFormAPI = (func) => {
      //console.log('FyneFormAPI', {func});

      const base = context.API_BASE;
      const url = (base || '') + func;
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
            base,
			endpoint,
			post: submit,
      }

}


export const useFyneForm = (instanceId, {
    Form,
	cancel = (...args)=> console.warn('Must supply cancel parameter to useFyneForm', args),
	submit = (...args)=> console.warn('Must supply submit parameter to useFyneForm', args),
	initialState = {}
}) => {
	if(!Form) console.error('Must define Form component to use FyneForm');

	const [ state, setState ] = React.useState( initialState );
	//const [ data, setData ] = React.useState( initialData );
    //const [ valid, setValid ] = React.useState( false );
    //const [ errors, setErrors ] = React.useState({});

	//const _setData = useCallback(newData=> {
	//	//console.log('useFyneForm setData', newData)
	//	setData(newData);
	//});
	//const _setValid = useCallback(newValid=> {
	//	//console.log('useFyneForm setValid', newValid)
	//	setValid(newValid);
	//});
	//const _setErrors = useCallback(newErrors=> {
	//	//console.log('useFyneForm setErrors', newErrors)
	//	setErrors(newErrors);
	//});

	const sync = useCallback(({...state})=> {
		//console.log('useFyneForm sync', state)
		setState(state);
		//setData(state.data);
		//setErrors(state.errors);
		//setValid(state.valid);
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
        //data,
        //valid,
		//errors,
		cancel,
		submit,
	}
}
