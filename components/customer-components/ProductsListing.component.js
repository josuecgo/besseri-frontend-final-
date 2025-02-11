import React from 'react';
import { View,  StyleSheet } from 'react-native';

import ProductCardComponent from './product-card.component';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';

import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants';
import {  deviceWidth } from '../../util/Dimentions';



const ProductListing = ({ products, navigation, comision, cartProductIds, addItemToCart, dispatch,w= deviceWidth * 0.8 }) => {






  return (
    <View style={[{ width: w}]}>
      <ProductCardComponent
        onViewDetail={() => {
          dispatch(CartActions.selectItemFromCart(products._id, products.price));
          navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL, {
            product: products,
            comision
          });
        }}
        increaseQuantity={() => CartActions.increaseQuantity(products?._id)}
        onAddToCart={() => addItemToCart(products)}
        data={products}
        inCart={cartProductIds.includes(products._id)}

        comision={comision}
      />


    </View>
  );
};



export default ProductListing;
