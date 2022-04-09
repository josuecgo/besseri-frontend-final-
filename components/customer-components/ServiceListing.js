import React from 'react';
import {FlatList, Text, TouchableOpacity, View,Image, StyleSheet,Pressable, useWindowDimensions} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import ProductCardComponent from './product-card.component';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useDispatch, useSelector } from 'react-redux';
import { CUSTOMER_HOME_SCREEN_ROUTES, SHARED_ROUTES, showToaster } from '../../util/constants';
import { base_url } from '../../util/api/api_essentials';

const ServiceListing = ({category,services,navigation}) => {
    const {width} = useWindowDimensions()
//   const dispatch = useDispatch();
//   const cartProductIds = useSelector(state => state.cart.cart_items_ids);
//   const addItemToCart = (item) => {
//     if(cartProductIds.includes(item?._id)) {
//       dispatch(CartActions.removeItemFromCart(item));
//       return;
//     }
//     dispatch(CartActions.addItemToCart({
//       ...item,
//       quantity:1
//     }))
//   }
  
  return (
    <View style={styles.container}>
        <View style={styles.buttonAndTextContainer}>
            <View style={{width:'60%'}}>
            <Text style={{...CommonStyles.fontFamily,fontSize:17}}>{category}</Text>
            </View>
            <TouchableOpacity style={styles.seeMoreButton}>
                <Text style={{...CommonStyles.fontFamily,color:'white'}}>See more</Text>
            </TouchableOpacity>
        </View>

        <FlatList
        data={services}
        contentContainerStyle={{marginTop:15,marginLeft:10}}
        horizontal
        renderItem={({item}) => (
            <Pressable
            onPress={() => {
                navigation.navigate(SHARED_ROUTES.SERVICE_DETAIL,{
                    service:item,
                    isVendor:false
                })
            }}
            style={{alignSelf:'center',width:width-35,margin:10}}
            >
                <Image
                source={{uri:`${base_url}/${item?.coverImg}`}}
                style={{width:'100%',height:150,resizeMode:'cover',borderRadius:10}}
                />
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:5}}>
                  <View>
                  <Text style={{...CommonStyles.fontFamily,fontSize:17}}>{item?.name}</Text>
                    <Text style={{color:'grey'}}>{item?.category?.name}</Text>
                    {/* <R numOfStars={5} totalReviews={10}/> */}
                    </View>
                    <Text style={{...CommonStyles.fontFamily,fontSize:16}}>MXN {item?.price}</Text>
                    </View>
                 
                </Pressable>
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

export default ServiceListing;
