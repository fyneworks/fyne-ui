import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import { Form, post } from './form';
import { useFyneForm } from '@fyne-ui';

import { useSnackbar } from 'notistack'; //https://material-ui.com/components/snackbars/
import { makeNotifier } from './notify';

export const DialogWrap = ({startOpen = true, container, ...props}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const snackbarHook = useSnackbar();
  const notifier = snackbarHook && makeNotifier(snackbarHook);

  const [ isOpen, setOpen ] = React.useState(startOpen);
  const [ isBusy, setBusy ] = React.useState(false);

  const closeDialog = () => {

    setOpen(false);
  }

  const handleError = (prop, message) => {
		console.log( 'DialogWrap handleError', prop, message );
		window.Hubster && window.Hubster.dispatch('form-error', { data: { prop, message } });
		notifier.error(message, {});
  }

  const handleCancel = ({data={},valid=false,errors={}})=> {
    console.log('DialogWrap handleCancel', {data,valid,errors});
    closeDialog();
  }
  const handleSubmit = ({data={},valid=false,errors={}})=> {
    console.log('DialogWrap handleSubmit', {data,valid,errors});
    if(!valid){

      const firstError = Object.keys(errors)[0];
      const firstAlert = errors[firstError];
      handleError(firstError, firstAlert);
  
      return false;
    }

    setBusy(true)
    post(data)
    .then(res=>{
      setBusy(false)
      console.log("Success submitting form", {data, res});
      setState({});
      closeDialog();

    })
    .catch(err=>{
      console.error("Error submitting form", {data, err});

    })
  }

  const { FyneForm, submit, state, valid, cancel, setState } = useFyneForm('dialog', { Form,
    submit: ({data={},valid=false,errors={}})=> {
      console.log('Dialog useFyneForm submit', {state, args:{data, valid, errors}});
      handleSubmit({data, valid, errors})
      
    }, 
    cancel: ({data={},valid=false,errors={}})=> {
      console.log('Dialog useFyneForm cancel', {state, args:{valid, data, errors}});
      handleCancel({data, valid, errors})
      
    }
  });

  const clickCancel = ()=> handleCancel(state);
  const clickSubmit = ()=> handleSubmit(state);

  window.showAgain = ()=> {
    setOpen(true)
  }

  //console.log("DialogWrap");//, {valid,data,errors,isOpen,startOpen,container,fullScreen,theme})

  return (
      <Dialog open={isOpen} scroll={"paper"} disableScrollLock container={container} fullScreen={fullScreen} onClose={handleCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Book Now</DialogTitle>
        <DialogContent>
            
          
        {/* <Form/> */}
        {/* FyneForm will go here */}
        <FyneForm/>

        </DialogContent>
        <DialogActions>
          <Button onClick={clickCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={clickSubmit} color="primary">
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
  );
}