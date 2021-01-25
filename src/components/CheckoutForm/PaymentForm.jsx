import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ( { checkoutToken, shippingData, backStep, onCaptureCheckout, nextStep }) => {
    const handleSubmit = async (event, elements, stripe) => {
        // this line makes sure that the page doesn't refresh when we click the button
        event.preventDefault();

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement});

        if(error) {
            console.log(error);
        } else {
            const orderData = {
                line_items: checkoutToken.live.line_items,
                customer: { firstname: shippingData.firstname, lastname: shippingData.lastname, email: shippingData.email },
                shipping: {
                    name: 'Danmark', 
                    street: shippingData.address1, 
                    town_city: shippingData.city, 
                    county_state: shippingData.shippingSubdivision,
                    postal_zip_code: shippingData.zip,
                    country: shippingData.shippingCountry,
                },
                fulfillment: {shipping_method: shippingData.shippingOption },
                payment: {
                    gateway: 'stripe',
                    stripe: {
                        payment_method_id: paymentMethod.id
                    },
                },
            };

            onCaptureCheckout(checkoutToken.id, orderData);
            nextStep();
            
        }
    };
    
    return (
        <>
            <Review checkoutToken={checkoutToken} />
            <Divider />
            <Typography variant="h6" gutterBottom style={{margin: '20px 0'}}>Betalingskort</Typography>
            <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {( { elements, stripe }) => (
                        <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                            <CardElement />
                            <br/> <br/>
                            <div style={{display: 'flex' , justifyContent: 'space-between'}}>
                               <Button variant="outlined" onClick={backStep}>Tilbage</Button> 
                               <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                                   Betal { checkoutToken.live.subtotal.formatted_with_symbol }
                               </Button>
                            </div>
                        </form>
                    )}
                </ElementsConsumer>
            </Elements>
        </>
    )
}

export default PaymentForm;
