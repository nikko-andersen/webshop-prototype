import React from 'react';
import { Grid } from '@material-ui/core';
import Product from './Product/Product';

import useStyles from './productsStyles';

const products = [
    { id: 1, name: 'Shoes', description: 'Running shoes', price: '100 DKK', image: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png'},
    { id: 2, name: 'Computer', description: 'acer computer', price: '4999 DKK', image: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png'},
];

const Products = () => {
    const classes = useStyles();

    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container justify="center" spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <Product product={product} />
                    </Grid>
                ))}
            </Grid>
        </main>
    )
}

export default Products;