import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useEffect } from 'react';

import { app_name } from './dialog';
import { Form, post } from './form';
import { useFyneForm } from '@fyne/ui/form';

//import { validationSchema } from './validation';

import { useSnackbar, makeNotifier } from '@fyne/ui/notify';


export const DialogWrap = ({startOpen = true, container, ...props}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const snackbarHook = useSnackbar();
  const notifier = makeNotifier(snackbarHook);

  const [ isOpen, setOpen ] = React.useState(startOpen);
  const [ isBusy, setBusy ] = React.useState(false);

  const closeDialog = () => {
    setOpen(false);
  }

  const handleError = (prop, message) => {
		//console.log( 'DialogWrap handleError', prop, message );
		window.Hubster && window.Hubster.dispatch('form-error', { data: { prop, message } });
    
    notifier.error(message);//, {});
    //snackbarHook.enqueueSnackbar(message, { variant:"error"})
  }

  const handleCancel = ({values={},isValid=false,errors={}})=> {
    //console.log('fyne/ui: DialogWrap handleCancel', {values,isValid,errors});
    closeDialog();
  }
  const handleSubmit = (state={})=> {
    const {values={},isValid=false,errors={},touched={}} = state;
    const {setErrors=()=>{},setTouched=()=>{},validationSchema} = state;
    //console.log('fyne/ui: DialogWrap handleSubmit', {state,values,touched,isValid,errors,setErrors,validationSchema});

    const quit = () => {
      const firstError = Object.keys(errors)[0];
      const firstAlert = firstError && errors[firstError];
      !!firstAlert ? handleError(firstError, firstAlert) : handleError('general', 'Please fill in the form');
      //console.log('fyne/ui: DialogWrap handleSubmit setTouched(all);', {setTouched,touched} );
      setTouched({name:true,email:true,phone:true,message:true}, true); // https://jaredpalmer.com/formik/docs/api/formik#settouched-fields--field-string-boolean--shouldvalidate-boolean--void
      //console.log('fyne/ui: DialogWrap handleSubmit setErrors(errors);', {setErrors,errors} );
      setErrors(errors);
      return false;
    }
    const send = () => {
      setBusy(true)
      post(values)
      .then( res=> {
        console.log("fyne/ui: Success submitting form", {values, res});
        notifier.success('This is a success message!');//, { variant:"success" });

        setState({});
        closeDialog();
      })
      .catch( err=> {
        console.error("Error submitting form", {values, err});
        notifier.error('Could not submit form');//, { variant:"error" });
      })
      .finally(()=>{
        setBusy(false)
      })
    }

    const valid = !!isValid && validationSchema.isValidSync(values);
    
    if(!!valid){
      send()
    }
    else{
      quit()
    }

  }

  const { FyneForm, state, submit, setState } = useFyneForm('dialog', { Form,
    submit: (props)=> {
      //console.log('fyne/ui: Dialog useFyneForm submit', {state,props}); //{state, valid, args:{values, isValid, errors, setErrors}});
      handleSubmit(state); //{values, isValid, errors})
      
    }, 
    cancel: (props)=> {
      //console.log('fyne/ui: Dialog useFyneForm cancel', {state,props}); //{state, valid, args:{values, isValid, errors}});
      handleCancel(state); //{values, isValid, errors})
      
    }
  });

  const clickCancel = (a,b,c)=> {
    //console.log('fyne/ui: clickCancel',{a,b,c,state});
    handleCancel(state);
  };
  const clickSubmit = (a,b,c)=> {
    //console.log('fyne/ui: clickSubmit',{a,b,c,state});
    //handleSubmit(state);
    submit(state);
  };

  useEffect(()=>{
    //console.log('fyne/ui: REVIVE? install', app_name+'__revive')
    window[app_name+'__revive'] = ()=> {
      setOpen(true)
    }
  }, []);

  console.log("fyne/ui: DialogWrap");//, {valid,data,errors,isOpen,startOpen,container,fullScreen,theme})

  return (
      <Dialog open={isOpen} scroll={"paper"} disableScrollLock container={container} fullScreen={fullScreen} onClose={handleCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Demo Form</DialogTitle>
        <DialogContent>
            
          
        {/* <Form/> */}
        {/* FyneForm will go here */}
        <FyneForm/>

        </DialogContent>
        <DialogActions>
          <Button onClick={clickCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={clickSubmit} color="primary"{...(!!isBusy ? {disabled:true} : {})}>
            Book now
          </Button>
        </DialogActions>
      </Dialog>
  );
}