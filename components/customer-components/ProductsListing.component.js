import React from 'react';
import {FlatList , Alert, Text, TouchableOpacity, View,Image, StyleSheet} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import ProductCardComponent from './product-card.component';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useDispatch, useSelector } from 'react-redux';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import { adjust } from '../../util/Dimentions';

const ProductListing = ({category,products,navigation,comision}) => {
  const dispatch = useDispatch();
  const cartProductIds = useSelector(state => state.cart.cart_items_ids);
  const businessIdInCart = useSelector(state => state.cart.businessId);
  const addItemToCart = (item) => {
    if(cartProductIds.includes(item?._id)) {
      dispatch(CartActions.removeItemFromCart(item));
      return;
    }
    // != businessIdInCart)
    if(item?.business_id != businessIdInCart && businessIdInCart != null) {
      showToaster('Solo puede agregar artículos al carrito de una tienda a la vez');
      return;
    }
    dispatch(CartActions.addItemToCart({
      ...item,
      quantity:1
    }))
  }
  
  
  return (
    <View style={styles.container}>
        <View style={styles.buttonAndTextContainer}>
            <View style={{width:'60%'}}>
              <Text style={{...CommonStyles.fontFamily,fontSize:adjust(14)}}>{category}</Text>
            </View>
            {/* <TouchableOpacity style={styles.seeMoreButton}>
                <Text style={{...CommonStyles.fontFamily,color:'white'}}>See more</Text>
            </TouchableOpacity> */}
        </View>

        <FlatList
        data={products}
        contentContainerStyle={{marginTop:15,marginLeft:10}}
        horizontal
        renderItem={itemData => (
           <ProductCardComponent
           onViewDetail={() => {
             navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL,{
               product:itemData.item,
               comision
             });
           }}
           increaseQuantity={() => increaseQuantity(itemData.item?._id)}
           onAddToCart={() => addItemToCart(itemData.item)}
           data={itemData.item}
           inCart={cartProductIds.includes(itemData.item._id)}
           comision={comision}
           />
        )}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{marginVertical:15,width:'95%'},
  buttonAndTextContainer:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:10},
  seeMoreButton:{paddingHorizontal:15,backgroundColor:Colors.primaryColor,justifyContent:'center',alignItems:'center',padding:10,borderWidth:1,borderColor:Colors.primaryColor,borderRadius:30},
 
})

export default ProductListing;
