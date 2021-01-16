import React from 'react'
import { Container, Typography, Button, Grid } from '@material-ui/core';
import CartItem from './CartItem/CartItem';
import useStyles from './cartStyles';
import { Link } from 'react-router-dom';

const Cart = ({cart, handleUpdateCartQty, handleRemoveFromCart, handleEmptyCart }) => {
    const classes = useStyles();

    const EmptyCart = () => (
        <Typography variant="subtitle1">Du har ingen varer i din indkøbskurv, 
            <Link to="/" className={classes.link}> tilføj varer til kurven. </Link>
        </Typography>
    );

    const FilledCart = () => (
        <>
        <Grid container spacing={3}>
            { cart.line_items.map((item) => (
                <Grid item xs={12} sm={4} key={item.id}>
                    <CartItem item={item} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart}/>
                </Grid>
            ))}
        </Grid>
        <div className={classes.cardDetails}>
            <Typography variant="h4">Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
            <div>
                <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Tøm kurven</Button>
                <Button className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">Gå til kassen</Button>
            </div>
        </div>
        </>

    );

    if (!cart.line_items) return 'Loading...';

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" gutterBottom>Din indkøbskurv</Typography>
            { !cart.line_items.length ? <EmptyCart /> : <FilledCart/> }
        </Container>
    )
}

export default Cart
