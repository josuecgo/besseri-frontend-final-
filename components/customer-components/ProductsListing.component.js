import React from 'react';
import {FlatList , Alert, Text, TouchableOpacity, View,Image, StyleSheet} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductCardComponent from './product-card.component';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useSelector } from 'react-redux';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants';
import { adjust, deviceWidth } from '../../util/Dimentions';
import { useCart } from '../../hooks/useCart';
import axios from 'axios';
import { customer_api_urls } from '../../util/api/api_essentials';
import { Empty } from '../Customer/Empty';

const ProductListing = ({category,products,navigation,comision,carCompatible}) => {
  
  const cartProductIds = useSelector(state => state.cart.cart_items_ids);

  const {addItemToCart} = useCart()
  
  
  if (products <= 0) {
    return null;
  }
  
  if (category?.name === 'TRANSMISION') {
    // console.log(products[0]);
  }
  
  return (
    <View style={styles.container}>
        <View style={styles.buttonAndTextContainer}>
            <View>
              <Text style={{...CommonStyles.fontFamily,fontSize:adjust(14),color:Colors.textPrimary}}>{category?.name}</Text>
            </View>
          
            <TouchableOpacity
            onPress={() => {
              carCompatible(false)
              navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.MORE_PRODUCTS,{category:category})
            
            }}
            >
              <Text style={{textDecorationLine:'underline', right:10,color:Colors.primarySolid,fontSize:adjust(10)}} >Ver más</Text>
              {/* <Ionicons name="ios-arrow-forward-outline" color="red" size={18} /> */}
            </TouchableOpacity>  
        </View>

        <FlatList
        data={products}
        contentContainerStyle={{marginTop:15,paddingHorizontal:5}}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={itemData => (
           <ProductCardComponent
           onViewDetail={() => {
             navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL,{
               product:itemData.item,
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
        ListEmptyComponent={() => (<Empty/>) }
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
