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
import {base_url, customer_api_urls} from '../../util/api/api_essentials';
import RatingComponent from '../Ratings/rating.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {adjust, deviceWidth} from '../../util/Dimentions';
import LinearGradient from 'react-native-linear-gradient';
import {moneda} from '../../util/Moneda';
import axios from 'axios';
import { showToaster } from '../../util/constants';
import { ProductContext } from '../../util/context/Product/ProductContext';
import { Compatible } from '../Customer/Compatible';


const ProductCardComponent = ({
  cartProduct,
  inCart,
  data,
  onAddToCart,
  increaseQuantity,
  decreaseQuantity,
  horizontal,
  onRemoveFromCart,
  onViewDetail,
}) => {
 const {carDefault,comision,carActive} = useContext(ProductContext)
  const cartProductIds = useSelector(state => state.cart.cart_items_ids);


  const handleChange = async() => {
   
    const stock = await axios.get(`${customer_api_urls.inStock_product}/${data._id}`)
    
    if (stock?.data?.product) {
      onAddToCart(data)
      
    }else{
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
            <Text style={{...CommonStyles.fontFamily, fontSize: 15}}>
              {data?.name}
            </Text>
            <Text style={{color: 'grey', ...CommonStyles.fontFamily}}>
              {moneda(Number(data?.price) + Number((comision * data?.price) / 100))}
              {' '} MXN
            </Text>
            <Text style={{color: 'grey',textTransform:'uppercase',fontSize:adjust(10)}}>{data?.maker?.name}</Text>
            <Text style={{color: 'grey'}}>{data?.model?.name}</Text>
            {
            carActive && carActive?.model?._id != data?.model?._id && (
              <Compatible carDefault={carActive}/>
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
      {cartProduct ? (
        <TouchableOpacity
          onPress={onRemoveFromCart}
          style={{
            alignSelf: 'flex-end',
            zIndex: 5000,
            position: 'absolute',
            top: 0,
            width: 35,
            height: 35,
            borderWidth: 1,
            borderColor: 'white',
            borderRadius: 35 / 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
           
          }}>
          <AntDesign name="delete" color="red" size={18} />
        </TouchableOpacity>
      ) : null}

     
      
      <Image
        source={{uri: `${base_url}/${data?.productImg}`}}
        style={styles.productImg}
        resizeMode='stretch'
      />

      <LinearGradient
        colors={Colors.primaryGradient}
        style={styles.LinearGradient}>
          {
          
             carActive && carActive?.model?._id != data?.model?._id && (
              <Compatible carDefault={carActive}/>
            )
            // carDefault  && (
            //   <Compatible carDefault={carDefault}/>
            // )
          }
        <Text style={styles.productTitle}>{data?.name}</Text>
        <Text style={[styles.textSub,{textTransform:'uppercase'}]} >{data?.brand?.name} </Text>
        <View style={styles.productSubTitle} > 
          {
            data?.maker?.name !== 'All' && (
              <Text style={[styles.textSub,{textTransform:'uppercase',fontSize:adjust(8)}]} >{data?.maker?.name} </Text>
            ) 
          }
          {
            data?.model?.name !== 'all' && (
              <Text style={styles.textSub} >{data?.model?.name} </Text>
            )
          }
          
          
        </View>
        {
          data?.aplicacion && (
            <Text style={styles.textSub} >{data?.aplicacion?.de} al {data?.aplicacion?.al} </Text>
          )
        }
        {
          data?.estimatedDelivery && (
            <Text style={styles.textSub} >{`Entrega ${data?.estimatedDelivery} aprox.`} </Text>
          )
        }
        
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}>
          <View>
            <Text style={styles.productPrice}>
              {moneda(
                Number(data?.price) + Number((comision * data?.price) / 100),
              )}
            </Text>
          </View>

          {cartProduct ? null : (
            <TouchableOpacity
              onPress={handleChange}
              style={styles.addToCartIcon}>
              {inCart ? (
                <Ionicons name="cart" color={Colors.white} size={25} />
              ) : (
                <Ionicons name="cart-outline" color={Colors.white} size={25} />
              )}
            </TouchableOpacity>
          )}
        </View>
        {cartProduct ? (
          <View style={styles.quantityCard}>
            <TouchableOpacity
              disabled={data?.quantity == 1}
              onPress={decreaseQuantity}
              style={styles.quantityButton}>
              <AntDesign name="minus" size={30} />
            </TouchableOpacity>
            <View style={styles.quantityText}>
              <Text>{data?.quantity}</Text>
            </View>
            <TouchableOpacity
              onPress={increaseQuantity}
              style={styles.quantityButton}>
              <AntDesign name="plus" size={20} />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* </View> */}
      </LinearGradient>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    width: deviceWidth / 2.2,
    marginHorizontal: 3,
    marginVertical:4
  },
  LinearGradient: {
    minHeight: deviceWidth * 0.40,
    paddingHorizontal: 5,
    justifyContent: 'space-evenly',
    paddingVertical: 5,
  },
  productImg: {
    width: '100%',
    height: deviceWidth * 0.3,
    // marginVertical:10,
    alignSelf: 'center',backgroundColor:'white'
    
  },
  productTitle: {
    ...CommonStyles.fontFamily,
    fontSize: adjust(10),
    bottom: 5,
    color: Colors.white,
  },
  productSubTitle:{
    flexDirection:'row'
  },
  textSub:{
    color:Colors.white,
    fontSize:adjust(8)
  },
  productPrice: {
    ...CommonStyles.fontFamily,
    fontSize: adjust(10),
    marginVertical: 4,
    color: Colors.secundarySolid,
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


