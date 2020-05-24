import React from 'react';
//const React = require('react');

//import { useState, useEffect } from 'react';
const { useState } = React;
const { useEffect } = React;

import CreatableSelect from 'react-select/creatable';
import { useFyneAPI } from './api';

export const FyneSelect = ({
    onKeyDown = () => {},
    onChange = () => {},
    isClearable = true,
    getParams = {},
    addParams = {},
    creatable = true,
    edition,
    initialValue = null,
    k,
    e,
    ...props
}) => {

    const [ options, setOptions ] = useState([]);
    const { error, loading, get, post } = useFyneAPI(`/dropdown/${e}`);

    useEffect(() => {
        OptionsLoad();
    }, [ /* variables to watch */ edition ]);

    const FyneworksGet = query => {
        //query = {...query, test:1, hello:'world'}
        //console.log('FyneworksGet', query);
        return get( query )
    }
    const FyneworksPost = body => post( body )
    
    const OptionsGet = () => FyneworksGet( getParams );
    const OptionsPost = data => FyneworksPost( { ...addParams, ...data } );

    const OptionsLoad = () =>
        OptionsGet().then(res => {
            const data = res && res.data || [];
            const loadedOptions = data.map( row => ({...row, value:row[k], label: row.name}) );
            ////console.log('fynejobs: OptionsLoad > OptionsGet',{data,loadedOptions})
            setOptions(loadedOptions);

            if(initialValue && initialValue.length==1){
                const initialData = initialValue && loadedOptions.filter( row => row.label==initialValue[0]);
                if(initialData && !!initialData.length){
                    onChange(initialData[0]);
                };
                ////console.log('fynejobs: initialData',e,{initialValue, initialData});
            }

            return loadedOptions;
        })
    ;
    const OptionsAdd = (name) =>  
        OptionsPost({name})
        .then(res=>{
            ////console.log('fynejobs: select addHandler res',{res});
            if(!!res && !!res.data && res.status=='y'){
                //const newOption = { [k]:res.data.i, name };
                const newOption = { value:res.data.i, label:name };
                ////console.log('fynejobs: select addHandler newOption',{newOption});
                setOptions((options||[]).concat([newOption]));
                return newOption; // available to the next "then" statement
            }
            //onKeyDown(event);
        })
    ;

    const LocalEventHandlers = {

        keyDown: (event) => {
            if(event.keyCode==13){
                
                const name = event.target.value;
                OptionsAdd(name)
                .then(newData=>{
                    ////console.log('fynejobs: keyDown newData',{newData})
                    onKeyDown(event);
                })

            }
            else{
                onKeyDown(event);
            }
        },

        onChange: (data) => {
            if(data && data.__isNew__){
                const name = data.label;
                OptionsAdd(name)
                .then(newData=>{
                    ////console.log('fynejobs: onChange newData',{newData})
                    onChange(newData);
                })

            }
            else{
                onChange(data);
            }
        }
    };
    
    ////console.log('fynejobs: render select', props.value);
      
    return (
        <CreatableSelect
            {...props}
            {...LocalEventHandlers}
            error={error}
            isClearable={isClearable}
            loading={loading}
            options={options}
            isValidNewOption={(value)=>!!creatable && !!value}
        />
    );
};

export default FyneSelect;