import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import CurrencyFormat from 'react-currency-format';
import { Typography } from '@material-ui/core';

//import { FyneSelect } from '/home/diego/projects/fwxlab/fyne-ui/src/select.js';
import { FyneSelect } from '@fyne/ui/select';
import { ParseContext } from '@fyne/ui/context';
const context = ParseContext(process.env);

import { lineTotal } from './lib';


import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root:{
        padding:theme.spacing(2),
        marginBottom:theme.spacing(2),
    },
    formItemName: {
      fontWeight: 'bold',
    },
    formItemQuantity: {
    },
    formItemTotal: {
        fontWeight: 'bold',
        textAlign: 'right',
        background: '#f7fcf7',
    },
    formItemTotalLabel: {
        background: '#f7fcf7'
    },
    formItemTotalRow:{
        paddingTop: 10,
        marginTop: 10,
        borderTop: '#ccc solid 1px'
    },
    totalText: {
        fontWeight: 'bold'
    }
}));
  
import {
    PROP_PRODUCT,
    PROP_QUANTITY,
    PROP_NAME,
    PROP_WEIGHT,
    PROP_LENGTH,
    PROP_WIDTH,
    PROP_AREA,
    PROP_MODEL,
    PROP_PRICE,
    PROP_EXTRA,
    PROP_EXTRAS,
    PROP_MAGNITUDE,
    PROP_DIMENSION,
    PROP_DIMENSION_M,
    PROP_DIMENSION_FT,
    PROP_DIMENSION_KG,
    PROP_DIMENSION_M2,
    PROP_DIMENSION_M3,
    PROP_DIMENSION_FT2,
    PROP_DIMENSION_FT3,
} from './form.props';

import {
    STR_LOADING,
    STR_PRODUCT,
    STR_QUANTITY,
    STR_QUANTITY_MIN,
    STR_QUANTITY_MAX,
    STR_NAME,
    STR_WEIGHT,
    STR_LENGTH,
    STR_WIDTH,
    STR_AREA,
    STR_MODEL,
    STR_MODEL_EXPLANATION,
    STR_PRICE,
    STR_EXTRA,
    STR_EXTRAS,
    STR_EXTRAS_EXPLANATION,
    STR_DELETE,
    STR_DELETE_EXPLANATION,
    STR_MEASUREMENT,
    STR_MEASUREMENT_EXPLANATION,
    STR_MAGNITUDE,
    STR_TOTAL,
    STR_GRANT_TOTAL,
} from './lang';

export const magnitudeLabel = dimension => {
    const dimensionLabel = STR_MAGNITUDE[dimension];
    return (
        <React.Fragment>
            {dimensionLabel.text}
            {dimensionLabel.sup && <sup>{dimensionLabel.sup}</sup>}
        </React.Fragment>

    )
}

export const itemDefaultProps = {
    [PROP_PRODUCT]: 0,
    [PROP_QUANTITY]: STR_QUANTITY_MIN,
    [PROP_NAME]: 'Product name',
    [PROP_MAGNITUDE]: 1,
    [PROP_DIMENSION]: PROP_DIMENSION_M2,
    [PROP_WEIGHT]: 0,
    [PROP_LENGTH]: 0,
    [PROP_WIDTH]: 0,
    [PROP_AREA]: 0,
    [PROP_MODEL]: {},
    [PROP_PRICE]: {},
    [PROP_EXTRAS]: [],
}

export const FormItem = ({
    item = itemDefaultProps,
    prices = null,
    models = null,
    extras = null,
    onChange = () => console.warn("Must specific onChange prop for form.item"),
    onRemove = () => console.warn("Must specific onRemove prop for form.item"),
    ...props
}) => {
    const classes = useStyles();

    const handleChange = (prop, value) => { // don't useCallback whenin stateless components
        const update = { [prop]: value };
        const newItem = { ...item, ...update };
        const setItem = { ...newItem, ...({
            dimension: (newItem.price && newItem.price.name && newItem.price.name.match(/kg/))? PROP_DIMENSION_KG: PROP_DIMENSION_M2
        })};
        console.log( 'Form Item handleChange', {prop, value, update, item, newItem, setItem} );
        onChange(setItem);
    };

    const handleRemove = (item) => { // don't useCallback whenin stateless components
        console.log( 'Form Item handleRemove', {item} );
        onRemove(item);
    };


    console.log('Form.Item', {P:item[PROP_PRODUCT],item});

    return (
        <Paper className={classes.root} data-key={item.key} spacing={4}>

            <Grid container spacing={2} alignItems="stretch" justify="flex-start" direction="row" alignContent="flex-end">
                <Grid item xs={10} className={classes.formItemName}>
                    <Typography variant="body1">
                        {item[PROP_NAME]}
                    </Typography>
                    {/*
                    <TextField
                        name={PROP_NAME}
                        label={STR_PRODUCT}
                        type="text"
                        //format={formatOption}
                        //normalize={normalizeOption}
                        //{...propertyFieldDefaults}
                        value={item[PROP_NAME]}
                        onChange={event=>handleChange(PROP_NAME,event.target.value)}
                    />
                    */}
                </Grid>
                <Grid item xs={2}>
                    <Tooltip title={STR_DELETE_EXPLANATION || STR_DELETE}>
                        <IconButton aria-label={STR_DELETE} onClick={event=>handleRemove(item)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="stretch" justify="flex-start" direction="row" alignContent="flex-end">
                <Grid item xs={3}>
                    <Tooltip title={STR_MEASUREMENT_EXPLANATION || STR_MEASUREMENT}>
                        <Typography variant="body1">
                            {
                                (
                                    STR_MAGNITUDE[item[PROP_DIMENSION]]
                                    && STR_MAGNITUDE[item[PROP_DIMENSION]].text 
                                )
                                || STR_MEASUREMENT
                            }
                        </Typography>
                    </Tooltip>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        name={PROP_MAGNITUDE}
                        //label={magnitudeLabel(item[PROP_DIMENSION])}
                        type="number"
                        InputProps={{ inputProps: { min: 1, max: 99, step:0.1 } }}
                        value={item[PROP_MAGNITUDE]}
                        onChange={event=>handleChange(PROP_MAGNITUDE,event.target.value)}
                    />
                </Grid>
                <Grid item xs={6} alignContent="flex-end">
                    <FyneSelect //url={context.API_BASE+"/dropdown/estimate/prices"}
                        options={prices} isClearable={false}
                        defaultValue={prices && Array.isArray(prices) && prices[0]}
                        k={PROP_PRICE}
                        edition={item[PROP_PRODUCT]}
                        getParams={{page:item[PROP_PRODUCT],"extra-fields":"fixprice,varprice"}}
                        creatable={false}
                        name={PROP_PRICE}
                        value={item[PROP_PRICE]} initialValue="first"
                        onChange={value=> handleChange(PROP_PRICE, value) }
                        loadingMessage={STR_LOADING}
                        isMulti={false} required
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="stretch" justify="flex-start" direction="row" alignContent="flex-end">
                <Grid item xs={3}>
                    <Tooltip title={STR_MODEL_EXPLANATION || STR_MODEL}>
                        <Typography variant="body1">{STR_MODEL}</Typography>
                    </Tooltip>
                </Grid>
                <Grid item xs={9}>
                    <FyneSelect //url={context.API_BASE+"/dropdown/estimate/models"}
                        options={models} isClearable={false}
                        defaultValue={models && Array.isArray(models) && models[0]}
                        k={PROP_MODEL}
                        edition={item[PROP_PRODUCT]}
                        getParams={{page:item[PROP_PRODUCT],"extra-fields":"fixprice,varprice"}}
                        creatable={false}
                        name={PROP_MODEL}
                        value={item[PROP_MODEL]} initialValue="first"
                        onChange={value=> handleChange(PROP_MODEL, value) }
                        loadingMessage={STR_LOADING}
                        isMulti={false} required
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="stretch" justify="flex-start" direction="row" alignContent="flex-end">
                <Grid item xs={3}>
                    <Tooltip title={STR_EXTRAS_EXPLANATION || STR_EXTRAS}>
                        <Typography variant="body1">{STR_EXTRAS}</Typography>
                    </Tooltip>
                </Grid>
                <Grid item xs={9}>
                    <FyneSelect //url={context.API_BASE+"/dropdown/estimate/extras"}
                        options={extras} isClearable={true}
                        k={PROP_EXTRA}
                        edition={item[PROP_PRODUCT]}
                        getParams={{page:item[PROP_PRODUCT],"extra-fields":"fixprice,varprice"}}
                        creatable={false}
                        name={PROP_EXTRAS}
                        value={item[PROP_EXTRAS]}
                        onChange={value=> handleChange(PROP_EXTRAS, value) }
                        loadingMessage={STR_LOADING}
                        isMulti={true}
                    />
                </Grid>
            </Grid>


            <Grid container spacing={2} alignItems="stretch" justify="flex-start" direction="row" alignContent="flex-end" className={classes.formItemTotalRow}>
                
                <Grid item xs={3} className={classes.formItemQuantityLabel}>
                    <Typography variant="body1">{STR_QUANTITY}</Typography>
                </Grid>
                <Grid item xs={2} className={classes.formItemQuantity}>

                    {/*
                    <TextField
                        name={PROP_QUANTITY}
                        label={STR_QUANTITY}
                        type="number"
                        InputProps={{ inputProps: { min: STR_QUANTITY_MIN, max: STR_QUANTITY_MAX } }}
                        //format={formatOption}
                        //normalize={normalizeOption}
                        //{...propertyFieldDefaults}
                        value={item[PROP_QUANTITY]}
                        onChange={event=>handleChange(PROP_QUANTITY,event.target.value)}
                    />
                    */}
                    <Select
                        name={PROP_QUANTITY}
                        label={STR_QUANTITY}
                        type="number"
                        //InputProps={{ inputProps: { min: STR_QUANTITY_MIN, max: STR_QUANTITY_MAX } }}
                        //format={formatOption}
                        //normalize={normalizeOption}
                        //{...propertyFieldDefaults}
                        value={item[PROP_QUANTITY]}
                        onChange={event=>handleChange(PROP_QUANTITY,event.target.value)}
                    >
                        <MenuItem value={"1"}>1</MenuItem>
                        <MenuItem value={"2"}>2</MenuItem>
                        <MenuItem value={"3"}>3</MenuItem>
                        <MenuItem value={"4"}>4</MenuItem>
                        <MenuItem value={"5"}>5</MenuItem>
                        <MenuItem value={"6"}>6</MenuItem>
                        <MenuItem value={"7"}>7</MenuItem>
                        <MenuItem value={"8"}>8</MenuItem>
                        <MenuItem value={"9"}>9</MenuItem>
                        <MenuItem value={"10"}>10</MenuItem>
                    </Select>

                </Grid>
                <Grid item xs={4} className={classes.formItemTotalLabel} align="right">
                    <Typography variant="body1">{STR_TOTAL}</Typography>
                </Grid>
                <Grid item xs={3} className={classes.formItemTotal} align="right">

                    <Typography variant="body1" className={classes.totalText}>
                        <CurrencyFormat value={lineTotal(item)} displayType={'text'} thousandSeparator={true} prefix={'£'} decimalScale={2} />
                    </Typography>

                </Grid>
            </Grid>

        </Paper>
    )
};