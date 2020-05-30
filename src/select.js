import React from 'react';
//const React = require('react');

//import { useState, useEffect } from 'react';
const { useState } = React;
const { useEffect } = React;

import CreatableSelect from 'react-select/creatable';
import { useFyneAPI } from './api';

const FIRST_TIME = true;

export const FyneSelect = ({
    onKeyDown = () => {},
    onChange = () => {},
    modifyOption = (option) => option,
    filterOption = (option) => option,
    filterOptions = (options) => options,
    onOptionsLoaded = () => {},
    isClearable = true,
    getParams = {},
    addParams = {},
    creatable = true,
    edition,
    initialValue = null,
    options = null,
    value = null,
    k,
    e,
    url,
    ...props
}) => {

    let _value = null;
    const endpoint = url || `/api/cms/dropdown/${e}`;
    const [ opts, setOpts ] = useState([]);
    const { error, loading, get, post } = useFyneAPI(endpoint);

    const parseOption = option => {
        if(Array.isArray(option)){
            return option.map(parseOption);
        }
        else if(!!option){
            return ({...option, value:option[k], label: option.name});
        }
        else{
            return null
        }
    }

    const prepOptions = data => {
        return filterOptions(
            data.map(parseOption)
            .map(modifyOption)
        ).filter(filterOption);
    };

    const renderOptions = (options, isFirstTime) => {
        console.log('fyneui: select: renderOptions > options',{options, isFirstTime})
        setOpts(prepOptions(options));

        if(isFirstTime===FIRST_TIME){
            console.log('fyneui: select: renderOptions > isFirstTime',{isFirstTime})

            onOptionsLoaded(options);
            
            console.log('fyneui: select: renderOptions > initialValue',{initialValue})
            if(!!initialValue){
                if(initialValue==="first"){
                    console.log('fyneui: select: renderOptions > initialValue first!', {initialValue,value:options[0]});

                    _value = options[0];
                    //onChange(options[0]);

                }
                else{
                    if(!!Array.isArray(initialValue) && initialValue.length===1){
                        const initialData = initialValue && options.filter( row => row.label==initialValue[0]);
                        if(initialData && !!initialData.length){
                            //console.log('fyneui: select: OptionsLoad > initialValue matched item in array', {initialValue,value:initialData[0]});
                            
                            _value = initialData[0];
                            //onChange(initialData[0]);

                        };
                        //console.log('fyneui: select: initialData',e,{initialValue, initialData});
                    }
                }
            }

        }
    }

    useEffect(() => {
        if(!!options){
            renderOptions(options, FIRST_TIME);
        }
        else{
            OptionsGet().then(res => {
                //console.log('fyneui: select: OptionsLoad > OptionsGet',{res, filterOptions, filterOption})
                const data = res && res.data || [];
                const loadedOptions = prepOptions(res.data);
                //console.log('fyneui: select: OptionsLoad > OptionsGet > loadedOptions',{data,loadedOptions})
                renderOptions(loadedOptions, FIRST_TIME);
                return loadedOptions;
            })
        }
    }, [ /* variables to watch */ url, e, edition, endpoint ]);

    const FyneworksGet = query => { return get( query ) }
    const FyneworksPost = body => post( body )
    const OptionsGet = () => FyneworksGet( getParams );
    const OptionsPost = data => FyneworksPost( { ...addParams, ...data } );
    const OptionsAdd = (name) =>  
        OptionsPost({name})
        .then(res=>{
            //console.log('fyneui: select: select addHandler res',{res});
            if(!!res && !!res.data && res.status=='y'){
                //const newOption = { [k]:res.data.i, name };
                const newOption = { value:res.data.i, label:name };
                //console.log('fyneui: select: select addHandler newOption',{newOption});
                renderOptions((opts||[]).concat([newOption]));
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
    
    console.log('fyneui: select: render select', {n:props.name
        ,pvalue: _value || value
        ,parsedValue: parseOption(_value || value)
        ,props,error,isClearable,loading,opts,_value,value
    });
      
    return (
        <CreatableSelect
            {...props}
            {...LocalEventHandlers}
            error={error}
            isClearable={isClearable}
            loading={loading}
            options={opts}
            value={parseOption(_value || value)}
            isValidNewOption={(value)=>!!creatable && !!value}
        />
    );
};

export default FyneSelect;