import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { StylesProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';

import './index.scss'

import { SnackbarProvider } from '@fyne/ui/notify'; //https://material-ui.com/components/snackbars/

const theme = createMuiTheme({
    status: {
      danger: '#900',
    },
});


export const App = ({ 
    data, 
    FyneApp, 
    onRender,
    element,
    ...props
}) => {

    const jss = create({
        ...jssPreset(),
        insertionPoint: element
    });

    console.log("App", {data, FyneApp, onRender, element, jss, props,
        StylesProvider,
        ThemeProvider,
        SnackbarProvider,
        FyneApp,});
    
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
    console.log("Fyne form destroy", {onDestroy, element, props});
	element && ReactDOM.unmountComponentAtNode(element)
	onDestroy()
}

export const render = ({ data, FyneApp = React.Fragment, onRender = () => {}, element, ...props } = {}) => {

    console.log("render()", {data, props});

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




