import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { base_url, customer_api_urls } from '../../util/api/api_essentials';
import RatingComponent from '../Ratings/rating.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { adjust, deviceWidth } from '../../util/Dimentions';
import LinearGradient from 'react-native-linear-gradient';
import { moneda } from '../../util/Moneda';
import axios from 'axios';
import { showToaster } from '../../util/constants';
import { ProductContext } from '../../util/context/Product/ProductContext';
import { Compatible } from '../Customer/Compatible';
import { AspectRatio, Box, Card } from 'native-base';


const ProductCardComponent = ({
  data,
  onAddToCart,
  horizontal,
  onViewDetail,
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


  if (horizontal) {
    const horizontalCardStyles = {
      cardContainer: {
        width: '100%',
        padding: 20,

        borderBottomWidth: 0.3,
        backgroundColor: Colors.white,

      },
      img: {
        width: 50,
        height: 60,
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 10,
      },
      wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    };
    return (
      <Pressable
        onPress={onViewDetail}
        style={horizontalCardStyles.cardContainer}>
        <View style={horizontalCardStyles.wrapper}>
          <View>
            <Text style={{ ...CommonStyles.fontFamily, fontSize: 15 }}>
              {data?.name}
            </Text>
            <Text style={{ color: 'grey', ...CommonStyles.fontFamily }}>
              {moneda(Number(data?.price) + Number((comision * data?.price) / 100))}
              {' '} MXN
            </Text>
            <Text style={{ color: 'grey', textTransform: 'uppercase', fontSize: adjust(10) }}>{data?.maker?.name}</Text>
            <Text style={{ color: 'grey' }}>{data?.model?.name}</Text>
            {
              carActive && carActive?.model?._id != data?.model?._id && (
                <Compatible carDefault={carActive} />
              )
              // carDefault  && (
              //   <Compatible carDefault={carDefault}/>
              // )
            }
            <TouchableOpacity onPress={handleChange}>
              <Text
                style={{
                  ...CommonStyles.fontFamily,
                  color: Colors.brightBlue,
                  marginTop: 10,
                }}>
                {cartProductIds?.includes(data?._id)
                  ? 'QUITAR DEL CARRITO'
                  : 'AÑADIR AL CARRITO'}
              </Text>
            </TouchableOpacity>
            {/* <RatingComponent numOfStars={2}/> */}
          </View>
          <Image
            source={{
              uri: `${base_url}/${data?.productImg}`,
            }}
            style={horizontalCardStyles.img}
          />

        </View>
      </Pressable>
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


        <Compatible autopart={data?.model?._id} />


      </Box>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    width: deviceWidth / 2.2,
    marginHorizontal: 10,
    marginVertical: 4
  },
  card:{
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
    width:'90%',
    height:100

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


