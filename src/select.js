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
    filterOption = (option) => option,
    filterOptions = (options) => options,
    onOptionsLoaded = () => {},
    isClearable = true,
    getParams = {},
    addParams = {},
    creatable = true,
    edition,
    initialValue = null,
    k,
    e,
    url,
    ...props
}) => {

    const endpoint = url || `/api/cms/dropdown/${e}`;
    const [ options, setOptions ] = useState([]);
    const { error, loading, get, post } = useFyneAPI(endpoint);

    useEffect(() => {
        OptionsLoad();
    }, [ /* variables to watch */ url, e, edition, endpoint ]);

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
            //console.log('fyneui: select: OptionsLoad > OptionsGet',{res, filterOptions, filterOption})
            const data = res && res.data || [];
            const loadedOptions = filterOptions(data.map( row => ({...row, value:row[k], label: row.name}) )).filter(filterOption);
            //console.log('fyneui: select: OptionsLoad > OptionsGet > loadedOptions',{data,loadedOptions})
            setOptions(loadedOptions);
            onOptionsLoaded(loadedOptions);
            
            //console.log('fyneui: select: OptionsLoad > initialValue',{initialValue})
            if(!!initialValue){
                if(initialValue==="first"){
                    console.log('fyneui: select: OptionsLoad > initialValue first!', {initialValue,value:loadedOptions[0]});
                    onChange(loadedOptions[0]);
                }
                else{
                    if(!!Array.isArray(initialValue) && initialValue.length===1){
                        const initialData = initialValue && loadedOptions.filter( row => row.label==initialValue[0]);
                        if(initialData && !!initialData.length){
                            //console.log('fyneui: select: OptionsLoad > initialValue matched item in array', {initialValue,value:initialData[0]});
                            onChange(initialData[0]);
                        };
                        //console.log('fyneui: select: initialData',e,{initialValue, initialData});
                    }
                }
            }

            return loadedOptions;
        })
    ;
    const OptionsAdd = (name) =>  
        OptionsPost({name})
        .then(res=>{
            //console.log('fyneui: select: select addHandler res',{res});
            if(!!res && !!res.data && res.status=='y'){
                //const newOption = { [k]:res.data.i, name };
                const newOption = { value:res.data.i, label:name };
                //console.log('fyneui: select: select addHandler newOption',{newOption});
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
                    //console.log('fyneui: select: keyDown newData',{newData})
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
                    //console.log('fyneui: select: onChange newData',{newData})
                    onChange(newData);
                })

            }
            else{
                onChange(data);
            }
        }
    };
    
    console.log('fyneui: select: render select', props.value);
      
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