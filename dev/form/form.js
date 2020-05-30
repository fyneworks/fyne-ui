import React, { useRef, useState, useEffect, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LoadingOverlay from 'react-loading-overlay';
import MuiPhoneNumber from 'material-ui-phone-number'
import TextField from '@material-ui/core/TextField';

import { useSnackbar, makeNotifier } from '@fyne/ui/notify';

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';

import { useFormik } from 'formik';
import { validationSchema } from './validation';
import { FormItem, itemDefaultProps } from './form.item'

import { random } from '@fyne/ui/utils';
import { useFyneAPI } from '@fyne/ui/api';
import { FyneFormAPI } from '@fyne/ui/form';
import { FyneSelect } from '@fyne/ui/select';
import { ParseContext } from '@fyne/ui/context';
const context = ParseContext(process.env);

export const action = window.API_ACTION || process.env.FWX_API_ACTION || '/cms/forms';
export const form = FyneFormAPI(action);

export const post = data => {

    //console.log('Form post', data);

    return new Promise((resolve,reject)=>{
        
        //console.log('Form post data', data);

        form.post(data)
        .then(res=>{
            //console.log('form post res', res);
            resolve(res);
        })
        .catch(err=>{
            //console.log('form post err', err);
            reject(err);
        })
    })
};

export const Form = ({
  FyneHook = null,
  initialValues = {
    name: '', 
    phone: '', 
    email: '', 
    message: '',
    items: [],
    date: new Date()
  }
}) => {
  const notifier = !FyneHook && makeNotifier(useSnackbar());

  const onSubmit = useCallback((values,Formik) => {
    //console.log('form submit', {values,Formik,validationSchema});

    const {isValid,errors,touched,dirty,setTouched,setErrors} = Formik;

    if(!!FyneHook){
      //console.log('form submit with FyneHook', {values,valid,errors,validationSchema});
      Formik.submit({values,validationSchema,isValid,errors,touched,dirty,setTouched,setErrors})

      return;
    }
    
    //validationSchema.isValid(values).then(values=>{
    
        post(values)
        .then( res=> {
          //console.log('form submit', { res, values });
          notifier.success('This is a success message!');//, { variant:"success" });
        })
        .catch( err=> {
          //console.log('form submit', { err, values });
          notifier.error('Could not submit form');//, { variant:"error" });
        })
        .finally((res)=>{
          //console.log('form finally', { res, values });
          setSubmitting(false); // https://jaredpalmer.com/formik/docs/guides/form-submission
        })

    //})

  });

  const Formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  const {
    isValid,
    dirty,
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setSubmitting,
    setErrors,
    setTouched,
    setValues
  } = Formik;
  //console.log('Form', {isValid, FyneHook, Formik});
  
  const handleChange = useCallback((prop, value) => {
    console.log( 'Form Updated', prop, value, values );
    window.Hubster && window.Hubster.dispatch('form-updated', { values: { prop, value } })
    const update = { [prop]: value };
    const newValues = { ...values, ...update };
    console.log( 'Form Updated', prop, value, {values, newValues} );
    setValues(newValues);
  }, [ values ]);



  const addItem = ((newItem)=> { //useCallback
    //console.log('addItem', {newItem});
    const newItemPrepared = {
      ...itemDefaultProps,
      ...newItem,
      ...({
        //price: catalogue.prices.data.filter(x=>x.page==newItem.product)[0],
        //model: catalogue.models.data.filter(x=>x.page==newItem.product)[0],
        extras: []
      }),
      key:random()
    };
    console.log('addItem newItemPrepared', {newItemPrepared});
    const newItems = values.items.concat(newItemPrepared);
    console.log('addItem DONE, newItems', {newItems});
    handleChange('items', newItems)
  }) //, [ ]);


  const changeItem = useCallback((item)=> {
    console.log('changeItem', {item,currentItems:values.items});
    let newItems = [];

    values.items.forEach(old=>{
      console.log('changeItem OLD', old);
      if(old.key==item.key){
        console.log('changeItem REPLACE', {item});
        newItems[newItems.length] = item;
      }
      else{
        console.log('changeItem KEEP', {old});
        newItems[newItems.length] = old;
      }
    });

    //console.log('changeItem DONE, newItems', {newItems});
    handleChange('items', newItems)
  }, [ values ]);



  const removeItem = useCallback((item)=> {
    console.log('removeItem', {item,currentItems:values.items});
    let newItems = [];

    values.items.forEach(old=>{
      console.log('removeItem OLD', old);
      if(old.key==item.key){
        console.log('removeItem REMOVE', {item});
        //newItems[newItems.length] = item;
      }
      else{
        console.log('removeItem KEEP', {old});
        newItems[newItems.length] = old;
      }
    });

    console.log('removeItem DONE, newItems', {newItems});
    handleChange('items', newItems)
  }, [ values ]);

  useEffect(()=>{
    FyneHook && FyneHook.sync({values,validationSchema,isValid,errors,touched,dirty,setTouched,setErrors})
  }, [ values, errors, isValid, touched ])



// OPTION, PRELOAD ALL THE THINGS

const [ catalogue, setCatalogue ] = useState({ready:false,products:[],prices:[],extras:[],models:[]});

const productsApi = useFyneAPI(context.API_BASE+"/dropdown/estimate/products");
const pricesApi = useFyneAPI(context.API_BASE+"/dropdown/estimate/prices");
const modelsApi = useFyneAPI(context.API_BASE+"/dropdown/estimate/models");
const extrasApi = useFyneAPI(context.API_BASE+"/dropdown/estimate/extras");

useEffect(()=>{
  Promise.all([
    productsApi.get(),
    pricesApi.get({"extra-fields":"page,varprice,fixprice"}),
    modelsApi.get({"extra-fields":"page,varprice,fixprice"}),
    extrasApi.get({"extra-fields":"page,varprice,fixprice"}),
  ]).then(([products,prices,models,extras])=>{
    //console.log('Promise.all', {products,prices,models,extras});
    setCatalogue({ready:true, products,prices,models,extras})
  })
}, [])





console.log('Render form', {values,touched,errors,isValid});
console.log('Render form: email', values.email, touched.email, errors.email);
console.log('Render form: name', values.name, touched.name, errors.name);
console.log('Render form: date', values.date, touched.date, errors.date);
console.log('Render form: message', values.message, touched.message, errors.message);

  return (
    <React.Fragment>
      <LoadingOverlay
        active={isSubmitting}
        spinner
        text='Sending'
      >
        <form onSubmit={handleSubmit}>


          <FyneSelect 
            k="product"
            //url={context.API_BASE+"/dropdown/estimate/products"} 
            options={catalogue.products.data}
            name="product" 
            creatable={false}
            edition={catalogue.ready}
            //initialValue="first"
            //value={values.product}
            //onOptionsLoaded={options=>handleChange('product',options[0])}
            //onChange={product=>handleChange("product",product)}
            onChange={product=>addItem(product)}
          />

          

          {!!values.items.length ? (
            <Grid container spacing={2} alignItems="stretch" justify="flex-start" direction="row" alignContent="flex-end">
              <Grid item xs={12}>

                {
                  values.items.map(item=>(
                    <FormItem key={item.key} item={item} 
                      onChange={item=> changeItem(item)}
                      onRemove={item=> removeItem(item)}
                      prices={catalogue.prices.data.filter(x=>x.page==item.product)}
                      models={catalogue.models.data.filter(x=>x.page==item.product)}
                      extras={catalogue.extras.data.filter(x=>x.page==item.product)}
                    />
                  ))
                }

              </Grid>
            </Grid>
          ) : ""}

          <TextField value={values.name || ''} onChange={event=>handleChange('name',event.target.value)}
            type="text" id="name" label="Name"
            autoComplete="name"
            onBlur={handleBlur}
            error={!!touched['name'] && !!errors['name']} helperText={errors['name'] || ''}
            fullWidth margin="dense"
            //autoFocus
          />

          <MuiPhoneNumber value={values.phone || ''}
            //onChange={event=>handleChange('phone',event.target.value)}
            onChange={value=>handleChange('phone',value)} 
            defaultCountry={'gb'}
            type="tel" id="phone" label="Phone"
            autoComplete="tel"
            onBlur={handleBlur}
            error={!!touched['phone'] && !!errors['phone']} helperText={errors['phone'] || ''}
            fullWidth margin="dense"
          />

          <TextField value={values.email || ''} onChange={event=>handleChange('email',event.target.value)}
            type="email" id="email" label="Email Address"
            autoComplete="email"
            onBlur={handleBlur}
            error={!!touched['email'] && !!errors['email']} helperText={errors['email'] || ''}
            fullWidth margin="dense"
          />



          <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker 
                disablePast={true}
                autoOk={true}
                value={values.date} 
                onChange={value=>{
                  //console.log('CHANGE', {value});
                  handleChange('date',value.format('yyyy-MM-DD'))
                }}
                fullWidth margin="dense"

                //shouldDisableDate={shouldDisableDate({SCHEDULE, schedule, shipping, scope:SCOPE_COLLECT})}
                //renderDay={renderDay({SCHEDULE, schedule, shipping, scope:SCOPE_COLLECT})}
                
                margin="dense"
                type="text"
                error={!!touched['date'] && !!errors['date']} helperText={errors['date'] || ''}
                
                id="date" 
                name="date" 
                label="Date of Visit"
              />
          </MuiPickersUtilsProvider>

          {!FyneHook && (
            <React.Fragment>
              <Button onClick={handleSubmit} color="primary">
                Send
              </Button>
            </React.Fragment>
          )}

        </form>

      </LoadingOverlay>
    </React.Fragment>
  );
}
