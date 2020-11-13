import React from 'react';
//const React = require('react');

//import { useState, useEffect } from 'react';
const { useState } = React;
const { useEffect } = React;

import CreatableSelect from 'react-select/creatable';
import { useFyneAPI } from './api';
import { ParseContext } from './context'

const FIRST_TIME = true;

export const FyneSelect = ({
    onKeyDown = () => {},
    onChange = () => {},
    modifyOption = (option) => option,
    filterOption = (option) => !!option, //{ console.log("fyne/ui: ****** filterOption", {option}); return true; },  //returns truthy for each object
    filterOptions = (options) => options, // taks array and filters it
    onOptionsLoaded = () => {},
    isClearable = true,
    getParams = {},
    addParams = {},
    creatable = true,
    edition = null,
    initialValue = null,
    options = null,
    value = null,
    k,
    e,
    url,
    ...props
}) => {

    if(!k){
        console.error("Can't render select, missing k parameter",{isClearable,getParams,addParams,creatable,edition,initialValue,options,value,k,e,url});
        return <React.Fragment/>
    }
    const context = ParseContext(process.env);
    const endpoint = url || (!!e ? `/api/cms/dropdown/${e}` : null);
    const { error, loading, get, post } = useFyneAPI(context, endpoint);
    const [ opts, setOpts ] = useState([]);

    const validOption = option => {
        if(!!option){
            if(Array.isArray(option)){
                return !!option.length
            }
            else if(k in option){
                // must be an object with the correct k property defined
                return true;
            }
        }
        else{
            // an empty object will be treated as null
            return false;
        }
    }

    const parseOption = option => {
        if(Array.isArray(option)){
            return option.map(parseOption).filter(x=>!!x); // all non-null array items
        }
        else if(validOption(option)){//(!!option && !!option[k]){
            // must be an object with the correct k property defined
            return modifyOption({...option, value:option[k], label: option.name});
        }
        else{
            // an empty object will be treated as null
            return null;
        }
    }

    const prepOptions = data => {
        //console.log('fyne/ui: *** prepOptions', {data})
        //console.log('fyne/ui: *** prepOptions parseOption', {data:data.map(parseOption)})
        //console.log('fyne/ui: *** prepOptions parseOption filterOption', {data:data.map(parseOption).filter(filterOption)})
        //console.log('fyne/ui: *** prepOptions filterOptions(parseOption filterOption)', {data:filterOptions(data.map(parseOption).filter(filterOption))})
        return filterOptions(
            data.map(parseOption)//.map(modifyOption) 
        ).filter(filterOption);
    };

    const renderOptions = (options, isFirstTime) => {
        //console.log('fyne/ui: fyneui: select: renderOptions > options',{options, isFirstTime})
        const prepdOptions = prepOptions(options);
        //console.log('fyne/ui: fyneui: select: renderOptions > prepdOptions',{prepdOptions})
        setOpts(prepdOptions);

        if(isFirstTime===FIRST_TIME){
            //console.log('fyne/ui: fyneui: select: renderOptions > isFirstTime',{isFirstTime})

            onOptionsLoaded(prepdOptions);
            
            //console.log('fyne/ui: fyneui: select: renderOptions > initialValue',{initialValue})
            if(!!initialValue){
                if(validOption(value)){
                    //console.log('fyne/ui: fyneui: select: renderOptions > ignore initialValue because value is valid!', {value,initialValue,value:options[0]});

                }
                else if(initialValue==="first"){
                    //console.log('fyne/ui: fyneui: select: renderOptions > initialValue first!', {initialValue,value:options[0]});

                    onChange(options[0]);

                }
                else{
                    if(!!Array.isArray(initialValue) && initialValue.length===1){
                        const initialData = initialValue && options.filter( row => row.label==initialValue[0]);
                        if(initialData && !!initialData.length){
                            //console.log('fyne/ui: fyneui: select: OptionsLoad > initialValue matched item in array', {initialValue,value:initialData[0]});
                            
                            onChange(initialData[0]);

                        };
                        //console.log('fyne/ui: fyneui: select: initialData',e,{initialValue, initialData,options,prepdOptions});
                    }
                }
            }

        }
    }

    useEffect(() => {
        //console.log('fyne/ui: fyneui: init: OptionsLoad ? options',{options})
        //console.log(JSON.stringify(options))
        if(!!options){
            //console.log('fyne/ui: fyneui: init: OptionsLoad ? renderOptions(options, FIRST_TIME);',{options})
            renderOptions(options, FIRST_TIME);
        }
        else if(!!endpoint){
            //console.log('fyne/ui: fyneui: init: OptionsLoad ? OptionsGet();',{url,k,endpoint})
            OptionsGet().then(res => {
                //console.log('fyne/ui: fyneui: select: OptionsLoad > OptionsGet',{res, filterOptions, filterOption})
                const data = res && res.data || [];
                const loadedOptions = prepOptions(data); //res.data);
                //console.log('fyne/ui: fyneui: select: OptionsLoad > OptionsGet > loadedOptions',{data,loadedOptions})
                renderOptions(loadedOptions, FIRST_TIME);
                return loadedOptions;
            })
        }
        else{
            //console.log('fyne/ui: fyneui: init: OptionsLoad ? OptionsGet();',{url,k,endpoint})
        }
    }, [ /* variables to watch */ url, e, edition ]);

    const FyneworksGet = query => { return get( query ) }
    const FyneworksPost = body => post( body )
    const OptionsGet = () => FyneworksGet( getParams );
    const OptionsPost = data => FyneworksPost( { ...addParams, ...data } );
    const OptionsAdd = (name) =>  
        OptionsPost({name})
        .then(res=>{
            //console.log('fyne/ui: fyneui: select: select addHandler res',{res});
            if(!!res && !!res.data && res.status=='y'){
                //const newOption = { [k]:res.data.i, name };
                const newOption = { value:res.data.i, label:name };
                //console.log('fyne/ui: fyneui: select: select addHandler newOption',{newOption});
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
                    //console.log('fyne/ui: fyneui: select: keyDown newData',{newData})
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
                    //console.log('fyne/ui: fyneui: select: onChange newData',{newData})
                    onChange(newData);
                })

            }
            else{
                onChange(data);
            }
        }
    };
    
    //console.log('fyne/ui: fyneui: select: render select', {n:props.name,value,pval:parseOption(value),props,error,isClearable,loading,opts});

    return (
        <CreatableSelect
            {...props}
            {...LocalEventHandlers}
            error={error}
            isClearable={isClearable}
            loading={loading}
            options={opts}
            value={parseOption(value)}
            isValidNewOption={(value)=>!!creatable && !!value}
        />
    );
};

export default FyneSelect;