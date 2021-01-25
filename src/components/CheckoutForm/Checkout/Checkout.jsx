import React, {useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline} from '@material-ui/core';
import { Link } from 'react-router-dom';
import useStyles from './checkoutStyles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import {commerce} from '../../../lib/commerce';


const steps = ['Forsendelsesadresse', 'Betaling'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const classes = useStyles();
    const [activeStep, setactiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setshippingData] = useState({});

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

                setCheckoutToken(token);
                //console.log(token);

            } catch(error) {
                console.log(error);
            }
        }
        if (cart && cart.line_items.length === 0) {
            // cart was emptied, do not call generateToken (will give an error on empty cart)
        } else {
            generateToken();
        }

    }, [cart]);

    const nextStep = () => setactiveStep( (prevActiveStep) => prevActiveStep + 1 );

    const backStep = () => setactiveStep( (prevActiveStep) => prevActiveStep - 1 );

    const next = (data) => {
        // skifter rækkefølgen, måske laver den en rendering af appen efter hvert kald nedenfor
        // løste umiddelbart problemet, nu bliver AddressForm ikke mounted en ekstra gang
        // hvilket gav en fejl/warning
        nextStep();   

        setshippingData(data);
      
    }

    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant="h5">Tak for din bestilling, {order.customer.firstname} {order.customer.lastname}.</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle2">Bestillingsreference: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Tilbage til forsiden</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if (error) {
        <>
        <Typography variant="h5">Error: {error}</Typography> 
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">Tilbage til forsiden</Button>   
        </>
    }

    const Form = () =>
        activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout}/>      

    return (
        <>
        <CssBaseline />
            <div className={classes.toolbar}/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    )
    
    // redering order JSX => useEffect  , therefor check if checkoutToken is not null before rendering <Form /> "checkoutToken &&"
}

export default Checkout;
