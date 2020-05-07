import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack'; //https://material-ui.com/components/snackbars/
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { StylesProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';

import './index.scss'

const theme = createMuiTheme({
    status: {
      danger: '#900',
    },
});

export const destroy = ({ onDestroy = () => {}, element, ...props } = {}) => {
    console.log("Fyne form destroy", {onDestroy, element, props});
	element && ReactDOM.unmountComponentAtNode(element)
	onDestroy()
}

export const render = ({ data, FyneApp = React.Fragment, onRender = () => {}, element, ...props } = {}) => {

    console.log("Render FyneApp", {data, props});

    const jss = create({
        ...jssPreset(),
        insertionPoint: element
    });
    
    ReactDOM.render(
        <StylesProvider jss={jss}>
            <ThemeProvider theme={theme}>
                <SnackbarProvider preventDuplicate maxSnack={3}>
                    <FyneApp {...{data, ...props}}/>
                </SnackbarProvider>
            </ThemeProvider>
        </StylesProvider>
    , element, onRender)
    
};


