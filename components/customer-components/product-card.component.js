import React, { useContext, useEffect, useState } from 'react';
import {
  
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import { base_url, customer_api_urls } from '../../util/api/api_essentials';

import { useSelector } from 'react-redux';
import { adjust, deviceWidth } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';
import axios from 'axios';
import { showToaster } from '../../util/constants';
import { ProductContext } from '../../util/context/Product/ProductContext';
import { Compatible } from '../Customer/Compatible';
import { Text, Box, Card, HStack } from 'native-base';
import { BtnCantidad } from '../button/BtnCantidad';


const ProductCardComponent = ({
  data,
  onAddToCart,
  horizontal,
  onViewDetail,
  cartProduct = false,
  increaseQuantity,
  decreaseQuantity,
  onRemoveFromCart
}) => {
  const { comision, carActive } = useContext(ProductContext)
  const cartProductIds = useSelector(state => state.cart.cart_items_ids);


  const handleChange = async () => {

    const stock = await axios.get(`${customer_api_urls.inStock_product}/${data._id}`)

    if (stock?.data?.product) {
      onAddToCart(data)

    } else {
      showToaster('Producto sin existencias, lamentamos el inconveniente.')
    }


  }


  if (cartProduct) {

    return (
      <View style={{ marginVertical: 10 }} >

        <HStack space={2} justifyContent={'space-around'} alignItems={'center'} >
          <Image
            source={{ uri: `${base_url}/${data?.productImg}` }}
            style={{
              width: deviceWidth * 0.25,
              height: deviceWidth * 0.25
            }}
            resizeMode='cover'
          />
          <Box flexWrap="wrap" alignItems="center" maxWidth={deviceWidth * 0.3}>
            <Text  numberOfLines={2}  style={[CommonStyles.h3,{color:Colors.black}]}>{data?.name}</Text>
            <Text  style={[CommonStyles.h3,{color:Colors.black}]}>
              {moneda(
                Number(data?.price) + Number((comision * data?.price) / 100),
              )}
            </Text>
          </Box>


          <BtnCantidad 
          decreaseQuantity={decreaseQuantity}  
          increaseQuantity={increaseQuantity}
          onRemoveFromCart={onRemoveFromCart}
          product={data}
          />
        </HStack>


      </View>
    );
  }



  return (
    <Pressable onPress={onViewDetail} style={styles.cardContainer}>

      <Card style={styles.card}>
        <Box alignItems={'center'} >
          {/* <AspectRatio ratio={16 / 9} w={'100%'} > */}
          <Image
            source={{ uri: `${base_url}/${data?.productImg}` }}
            style={styles.productImg}
            resizeMode='stretch'
          />
          {/* </AspectRatio> */}
        </Box>
      </Card>


      <Box mt={'5px'}>

        <Text style={styles.productTitle}>{data?.name}</Text>
        <Text style={styles.productPrice}>
          {moneda(
            Number(data?.price) + Number((comision * data?.price) / 100),
          )}
        </Text>


        {
          !cartProduct && (
            <Compatible autopart={data?.model?._id} />
          )
        }



      </Box>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    width: '45%',
    marginHorizontal: 10,
    marginVertical: 4,
    
  },
  card: {
    backgroundColor: 'white', shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  },
  LinearGradient: {
    minHeight: deviceWidth * 0.40,
    paddingHorizontal: 5,
    justifyContent: 'space-evenly',
    paddingVertical: 5,
  },
  productImg: {
    width: '90%',
    height: 100

  },
  productTitle: {
    ...CommonStyles.h2,
    color: Colors.black,
    fontWeight: 'bold'
  },
  productSubTitle: {
    flexDirection: 'row'
  },
  textSub: {
    ...CommonStyles.h2,
    color: Colors.black
  },
  productPrice: {
    ...CommonStyles.h2,
    color: Colors.black
  },
  addToCartIcon: {
    marginRight: 5,
    backgroundColor: Colors.terciarySolid,
    padding: 1,
    borderRadius: 3,
  },
  quantityCard: {
    width: '100%',
    height: 40,
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: '#D3D3D3',
  },
  quantityButton: {
    width: '30%',
    backgroundColor: '#D3D3D3',
    ...CommonStyles.flexCenter,
  },
  quantityText: {
    width: '40%',
    backgroundColor: 'white',
    ...CommonStyles.flexCenter,
  },
  addToCartButton: {
    margin: 5,
  },
  addToCartButtonText: {
    fontSize: 15,
    color: Colors.brightBlue,
  },
});

export default ProductCardComponent;


