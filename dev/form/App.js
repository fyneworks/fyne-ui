import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';

import { StylesProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';

import './index.scss'

import { SnackbarProvider } from '@fyne/ui/notify'; //https://material-ui.com/components/snackbars/
import * as N from '@fyne/ui/notify'; //https://material-ui.com/components/snackbars/
import n from '@fyne/ui/notify'; //https://material-ui.com/components/snackbars/
//console.log('fyne/ui: SnackbarProvider', {n,N,SnackbarProvider});


const theme = responsiveFontSizes(createMuiTheme({
    typography: {
        // SEE https://material-ui.com/customization/typography/
        // fontSize: '16px',
        //htmlFontSize: 10,
    },
    status: {
      danger: '#900',
    },
}));


export const App = ({ 
    data, 
    FyneApp, 
    onRender,
    element,
    ...props
}) => {

    const jss = create({
        ...jssPreset(),
        //insertionPoint: element
    });

    console.log("fyne/ui: App", {data, FyneApp, onRender, element, jss, props,StylesProvider,ThemeProvider,SnackbarProvider,FyneApp});
    
    return (
        <React.Fragment>
            <StylesProvider jss={jss}>
                <ThemeProvider theme={theme}>
                    <SnackbarProvider preventDuplicate maxSnack={3}>
                        <FyneApp {...{data, ...props}}/>
                    </SnackbarProvider>
                </ThemeProvider>
            </StylesProvider>
        </React.Fragment>
    )
    
}

export const destroy = ({ onDestroy = () => {}, element, ...props } = {}) => {
    console.log("fyne/ui: Fyne form destroy", {onDestroy, element, props});
	element && ReactDOM.unmountComponentAtNode(element)
	onDestroy()
}

export const render = ({ data, FyneApp = React.Fragment, onRender = () => {}, element, ...props } = {}) => {

    console.log("fyne/ui: render()", {data, props});

    ReactDOM.render(
        <App
            {...(
                { 
                    //data, 
                    FyneApp, 
                    onRender,
                    element,
                    ...props
                }
            )}
        >
            Hello world
        </App>
    , element, onRender)
    
};




