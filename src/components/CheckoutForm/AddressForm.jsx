import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './CustomTextField';
import { Link } from 'react-router-dom';

import { commerce } from '../../lib/commerce';

const AddressForm = ({ checkoutToken, next }) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');

    // makes the object into an array of objects - Object.entries(shippingCountries) returns array of arrays with to elements
    const countries = Object.entries(shippingCountries).map( ([code, name]) => ({id: code, label: name}) );

    const subdivisions = Object.entries(shippingSubdivisions).map( ([code, name]) => ({id: code, label: name}) );

    const options = shippingOptions.map( (sO) => ({ id: sO.id, label: `${sO.description} - ${sO.price.formatted_with_symbol}` }));

    const methods = useForm();

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    }

    const fetchSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    }

    // hvis man skulle implementere GLS tror jeg man kan gøre det ved at bruge setup -> Custom Data Fields og lave plads
    // til at man kan sende det med - så skal man kombinere med noget UI der bruger GLS API

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });

        setShippingOptions(options);
        setShippingOption(options[0].id);
    }

    // add dependecy here (checkoutToken) to remove warnings or add ignore tag?
    useEffect(() => {
        // cleanup code to avoid fetchShippingCountries is called after component is unmounted (not shown in app anymore)
        // otherwise called when app is regenerated giving an error
        let isMounted = true;
        //isMounted ? console.log("Mounted true") : console.log("Mounted false");
        if (isMounted) {
            fetchShippingCountries(checkoutToken.id);
        }  
        return () => { 
            //console.log("ummounting fetchShippingCountries...");
            isMounted = false; 
        }    
        // eslint-disable-next-line
    },[]);

    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry)
    },[shippingCountry]);

    // add depency here (shippingCountry,checkoutToken) ?
    useEffect(() => {
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
        // eslint-disable-next-line
    },[shippingSubdivision]);

    return (
        <>
            <Typography variant="h6" gutterBottom>Forsendelsesadresse</Typography>
            <FormProvider {...methods}>
                <form onSubmit={ methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))} >
                    <Grid container spacing={3}>
                        <FormInput required name='firstname' label='Fornavn' />
                        <FormInput required name='lastname' label='Efternavn' />
                        <FormInput required name='address1' label='Adresse' />
                        <FormInput required name='email' label='Email' />
                        <FormInput required name='city' label='By' />
                        <FormInput required name='zip' label='Postnr' />
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Land </InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                                {countries.map( (country) => (                                
                                <MenuItem key={country.id} value={country.id}>{country.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>                        
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Region </InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                                {subdivisions.map( (subdivision) => (                                
                                <MenuItem key={subdivision.id} value={subdivision.id}>{subdivision.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>                        
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Valgmuligheder </InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                                {options.map( (option) => (                                
                                <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button component={Link} to="/cart" variant="outlined">Tilbage til kurven</Button>
                        <Button type="submit" variant="contained" color="primary">Næste</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
