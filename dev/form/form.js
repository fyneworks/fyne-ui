import React, { useRef, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { format } from 'date-fns'
import { FyneSelect } from './../fyneworks'
import { FyneFormAPI } from './../fyneworks';

import LoadingOverlay from 'react-loading-overlay';

import { useSnackbar } from 'notistack'; //https://material-ui.com/components/snackbars/
import { makeNotifier } from './notify';

export const action = window.API_ACTION || process.env.FWX_API_ACTION || '/cms/forms';

export const form = FyneFormAPI(action);

export const post = data => {

    console.log('Form post', data);

    return new Promise((resolve,reject)=>{
        
        console.log('Form post data', data);

        form.post(data)
        .then(res=>{
            console.log('form post res', res);
            resolve(res);
        })
        .catch(err=>{
            console.log('form post err', err);
            reject(err);
        })
    })
};

export const validate = data => {
  let e = {};
  if(!data.name) e['name'] = 'please enter your name';
  if(!data.phone) e['phone'] = 'please enter your phone';
  if(!data.email) e['email'] = 'please enter your email';
  let validation = { errors:e, valid:Object.keys(e).length===0 };
  console.log('Form validate', {data,validation});
  return validation;
}

export const Form = ({
  FyneHook = null,
  initialData = {
    name: '', 
    phone: '', 
    email: '', 
    date: '', 
    sector: '',
  }
}) => {
  const firstRender = useRef(true);

  const snackbarHook = useSnackbar();
  const notifier = snackbarHook && makeNotifier(snackbarHook);

  const [ busy, setBusy ] = React.useState(false);
  const [ errors, setErrors ] = React.useState({});
  const [ valid, setValid ] = React.useState({});
  const [ data, setData ] = React.useState( initialData );


  // for every change in our state this will be fired
  // we add validation here and disable the save button if required
  useEffect(() => {
  
    // we want to skip validation on first render
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    console.log('Form validate in useEffect');
    const validation = formValidation();
    console.log('Form validate in useEffect result', validation);

    setValid(validation.valid);
    FyneHook && FyneHook.sync({ data, ...validation });
    
  }, [ data ]);

  // state for FyneHook
  const state = { data, valid, errors };
  
  const formValidation = useCallback((dataToValidate = data)=> {
    return validate(dataToValidate);
  }, [ data ]);

  const handleChange = useCallback((prop, value) => {
		console.log( 'Form Updated', prop, value, data );
		window.Hubster && window.Hubster.dispatch('form-updated', { data: { prop, value } })
    const update = { [prop]: value };
    const newData = { ...data, ...update };
    setData(newData);
  }, [ data ]);
  
  const handleError = useCallback((prop, message) => {
		console.log( 'Form error', prop, message, data );
		window.Hubster && window.Hubster.dispatch('form-error', { data: { prop, message } });
		notifier.error(message, {});
  }, [ data ]);

  const handleCancel = useCallback(()=> {
		console.log('Form cancel', {data});
		notifier.warning("Booking cancelled");
		quit();
    FyneHook && FyneHook.cancel(state);
  }, [ data ]);

  const handleSubmit = useCallback(() => {
    console.log('Form submit', {data});

    const validation = formValidation();
    if(validation && validation.valid){

      if(FyneHook){
        console.log('Form valid! submit via FyneHook', {state});
        return FyneHook.submit(state);
      }
      
      notifier && notifier.success("Thank you!");
      
      console.log('Form valid! submit post(data);', {data});
      
      setBusy(true)
      post(data)
      .then(res=>{
        setBusy(false)
        console.log("Success submitting form", {data, res});
        setData({});

      })
      .catch(err=>{
        console.error("Error submitting form", {data, err});

      })

    }
    else{
      console.log('Form NOT VALID! report errors;', {validation,data});

      const firstError = Object.keys(validation.errors)[0];
      const firstAlert = validation.errors[firstError];
      handleError(firstError, firstAlert);

      setErrors(validation.errors);
    }

  }, [ data ]);

  console.log('Form state', {valid,data,errors});

  return (
    <React.Fragment>
      <LoadingOverlay
        active={busy}
        spinner
        text='Sending'
      >
        <TextField value={data.name || ''} onChange={event=>handleChange('name',event.target.value)}
          type="text" id="name" label="Name"
          fullWidth margin="dense"
          autoFocus
        />

        <TextField value={data.phone || ''} onChange={event=>handleChange('phone',event.target.value)}
          type="tel" id="phone" label="Phone"
          fullWidth margin="dense"
        />

        <TextField value={data.email || ''} onChange={event=>handleChange('email',event.target.value)}
          type="email" id="email" label="Email Address"
          fullWidth margin="dense"
        />

        <FyneSelect e="sector" name="source" creatable={false}/>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker value={data.date || ''} onChange={value=>handleChange('date',format(value,'yyyy-MM-dd'))}
              fullWidth margin="dense"
              type="text" id="date" label="Date of Visit"
            />
        </MuiPickersUtilsProvider>

        <Button onClick={event=>handleSubmit()} color="primary">
          Test Submit Button
        </Button>

      </LoadingOverlay>
    </React.Fragment>
  );
}
