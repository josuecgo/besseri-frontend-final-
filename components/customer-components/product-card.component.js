import React, { useEffect, useState } from 'react';
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
  const cartProductIds = useSelector(state => state.cart.cart_items_ids);

  const [comision, setComision] = useState(0)



  useEffect(() => {
    if (data?.name.length > 0) {
      getComision();
    }
   
  }, [data])
  
 
  const getComision = async() => {
    try {
      const getFee = await axios.get(customer_api_urls?.get_fees);
      
      setComision(getFee.data.data[0]?.besseri_comission);
    } catch (error) {
      console.log(error);
    }
    

  }
  
  // console.log(Number(data?.price) + Number((comision * data?.price) / 100));
  if (horizontal) {
    const horizontalCardStyles = {
      cardContainer: {
        width: '100%',
        padding: 20,
        elevation: 12,
        borderBottomWidth: 0.3,
        backgroundColor: Colors.white,
        elevation: 2,
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
            <Text style={{color: 'grey'}}>{data?.maker?.name}</Text>
            <Text style={{color: 'grey'}}>{data?.model?.name}</Text>
            <TouchableOpacity onPress={onAddToCart}>
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
            elevation: 10,
          }}>
          <AntDesign name="delete" color="red" size={18} />
        </TouchableOpacity>
      ) : null}
      <Image
        source={{uri: `${base_url}/${data?.productImg}`}}
        style={styles.productImg}
      />
      {/* <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
      <Image
    source={{uri:`${base_url}/${data?.productImg}`}}
    style={{width:20,height:20,borderRadius:20/2,marginRight:5}}
    />
   
      </View> */}
      <LinearGradient
        colors={Colors.primaryGradient}
        style={styles.LinearGradient}>
        <Text style={styles.productTitle}>{data?.name}</Text>
        <View style={styles.productSubTitle} > 
          <Text style={styles.textSub} > {data.maker.name} </Text>
          <Text style={styles.textSub} > {data.model.name} </Text>
        </View>
        
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
              onPress={onAddToCart}
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
    width: 160,
    // minHeight:250,
    // borderColor: 'white',
    margin: 5,
    elevation: 1,
    // padding:5
    
  },
  LinearGradient: {
    minHeight: deviceWidth * 0.24,
    paddingHorizontal: 5,
    justifyContent: 'space-evenly',
    paddingVertical: 5,
  },
  productImg: {
    width: '100%',
    height: deviceWidth * 0.3,
    // marginVertical:10,
    alignSelf: 'center',
    resizeMode: 'stretch',
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


