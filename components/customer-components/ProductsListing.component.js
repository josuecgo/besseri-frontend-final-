import React from 'react';
import {FlatList , Alert, Text, TouchableOpacity, View,Image, StyleSheet} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductCardComponent from './product-card.component';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useDispatch, useSelector } from 'react-redux';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants';
import { adjust, deviceWidth } from '../../util/Dimentions';
import { useCart } from '../../hooks/useCart';
import axios from 'axios';
import { customer_api_urls } from '../../util/api/api_essentials';
import { Empty } from '../Customer/Empty';
import { ListEmpty } from '../Vendor/ListEmpty';

const ProductListing = ({products,navigation,comision}) => {
  const dispatch = useDispatch()
  const cartProductIds = useSelector(state => state.cart.cart_items_ids);

  const {addItemToCart} = useCart()
 
  
  
  return (
    <View style={styles.container}>


      <FlatList
          data={products}
          contentContainerStyle={{ marginTop: 15, paddingHorizontal: 5 }}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }} // Agrega esta línea para ajustar el espaciado entre las columnas
          renderItem={itemData => (
              <ProductCardComponent
                  onViewDetail={() => {
                      dispatch(CartActions.selectItemFromCart(itemData.item._id, itemData.item?.price));
                      navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL, {
                          product: itemData.item,
                          comision
                      });
                  }}
                  increaseQuantity={() => CartActions.increaseQuantity(itemData.item?._id)}
                  onAddToCart={() => addItemToCart(itemData.item)}
                  data={itemData.item}
                  inCart={cartProductIds.includes(itemData.item._id)}
                  comision={comision}
              />
          )}
          ListEmptyComponent={() => <ListEmpty msg={'No hay productos para tu vehiculo'} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{marginVertical:15,width:deviceWidth},
  buttonAndTextContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'baseline',
    paddingHorizontal:10,
    // backgroundColor:'red'
  },
  seeMoreButton:{paddingHorizontal:15,backgroundColor:Colors.primaryColor,justifyContent:'center',alignItems:'center',padding:10,borderWidth:1,borderColor:Colors.primaryColor,borderRadius:30},
 
})

export default ProductListing;
