import React from 'react';
//const React = require('react');

//import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

import * as notistack from 'notistack'; //https://material-ui.com/components/snackbars/
export const { SnackbarProvider } = notistack;
export const { useSnackbar } = notistack;

export const Notify = (props) => <MuiAlert elevation={6} variant="filled" {...props}/>;
export const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props}/>;

//export const Success = (props) =>{
//  console.log('fyne/ui: NOTIFY Success', {props});
//  return <Alert severity="success" {...props}>{props.children}</Alert>
//};
//export const Error = (props) =>{
//  console.log('fyne/ui: NOTIFY Error', {props});
//  return <Alert severity="error" {...props}>{props.children}</Alert>
//};
//export const Info = (props) =>{
//  console.log('fyne/ui: NOTIFY Info', {props});
//  return <Alert severity="info" {...props}>{props.children}</Alert>
//};
//export const Warning = (props) =>{
//  console.log('fyne/ui: NOTIFY Warning', {props});
//  return <Alert severity="warning" {...props}>{props.children}</Alert>
//};

  // customized
export const snackbarActions = ({...snackbarActionsOptions}) => {
  console.log('fyne/ui: Fyne snackbar with props', snackbarActionsOptions)
  const { closeSnackbar } = snackbarActionsOptions || {};
  return (key)=> (
      <React.Fragment>
          <Button onClick={() => { 
            //console.info('snackbarActions dismiss',{$a:arguments,snackbarActionsOptions}); 
            closeSnackbar(key)
          }}>
              Dismiss
          </Button>
      </React.Fragment>
  )
};

export const defaultOptions = {
  anchorOrigin: {vertical:'top',horizontal:'center'},
  TransitionComponent: Slide,
  direction: 'down',
  //persist: true,
  preventDuplicate: true,
  autoHideDuration: 3 * 1000,
};

export const snackbarOptions = (overrideOptions) => {
    return Object.assign({}, 
      defaultOptions || {},
      overrideOptions || {}
    );
};


export const makeNotifier = (
    // consumes useNotifier()
    {enqueueSnackbar, closeSnackbar}
) => {

    const notify = (message, runtimeOptions) => {

    const options = snackbarOptions(runtimeOptions);
        console.log('fyne/ui: makeNotifier', 'enqueueSnackbar', {message,runtimeOptions,options})
        enqueueSnackbar(
            message,
            {
                ...options,
                action: snackbarActions({closeSnackbar}),
            }
        );
    };

    return {
        success: (message, options) => notify(message, {...options, variant:'success'}),
        error: (message, options) => notify(message, {...options, variant:'error'}),
        info: (message, options) => notify(message, {...options, variant:'info'}),
        warning: (message, options) => notify(message, {...options, variant:'warning'}),
    };
};



const notify = {
    defaultOptions,
    makeNotifier,
    snackbarOptions,
    snackbarActions,

    SnackbarProvider,
    useSnackbar,
}


export default {...notify};