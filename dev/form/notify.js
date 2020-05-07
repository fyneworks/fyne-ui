import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

export const Notify = (props) => <MuiAlert elevation={0} variant="filled" {...props}/>;
export const Alert = (props) => <MuiAlert elevation={0} variant="filled" {...props}/>;

export const Success = (props) => <Alert severity="success" {...props}/>;
export const Error = (props) => <Alert severity="error" {...props}/>;
export const Info = (props) => <Alert severity="info" {...props}/>;
export const Warning = (props) => <Alert severity="warning" {...props}/>;

  // customized
export const snackbarActions = ({...props}) => {
  console.log('Fyne snackbar with props', props)
  return (key)=> (
      <React.Fragment>
          <Button onClick={() => { console.log({$a:arguments,props}); props.closeSnackbar(key) }}>
              Dismiss
          </Button>
      </React.Fragment>
  )
};

export const snackbarOptions = ({options, ...props}) => {
    return Object.assign({}, 
      {
        anchorOrigin: {vertical:'top',horizontal:'center'},
        TransitionComponent: Slide,
        direction: 'down',
        persist: true,
        preventDuplicate: true,
        autoHideDuration: 3 * 1000,
        action: snackbarActions(props),
      },
      options || {}
    );
};


export const makeNotifier = ({enqueueSnackbar, closeSnackbar}) => {

  const notify = (component, options) => {
    enqueueSnackbar(
      component,
      snackbarOptions({options, closeSnackbar})
    );
  };

  return {
    success: (message, options) => notify(<Success>{message}</Success>, options),
    error: (message, options) => notify(<Error>{message}</Error>, options),
    info: (message, options) => notify(<Info>{message}</Info>, options),
    warning: (message, options) => notify(<Warning>{message}</Warning>, options),
  }

}



