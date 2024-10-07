// ProductGrid.jsx
import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import ProductCard from './ProductCard';

const ProductGrid = () => (
  <Grid
    templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
    gap={4}
    p={4}
    flexGrow={1}
    justifyItems="center"
  >
    {[...Array(6)].map((_, i) => (
      <GridItem key={i} maxW="200px">
        <ProductCard
          image="https://via.placeholder.com/200x200.png?text=Product"
          title="Lorem ipsum dolor sit"
          price="17.00"
        />
      </GridItem>
    ))}
  </Grid>
);

export default ProductGrid;
