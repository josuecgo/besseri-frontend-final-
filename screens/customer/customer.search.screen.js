import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, useWindowDimensions, PermissionsAndroid, FlatList, Pressable, Dimensions } from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import { customer_api_urls } from '../../util/api/api_essentials';
import { CUSTOMER_HOME_SCREEN_ROUTES, SHARED_ROUTES, showToaster } from '../../util/constants';
import SpinKit from 'react-native-spinkit'
import ProductCardComponent from '../../components/customer-components/product-card.component';
import * as CartActions  from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useRoute } from '@react-navigation/native';
import ServicesCardComponent from '../../components/customer-components/ServicesCard.component';
const SCREEN_STATES = {
  USER_LOCATION:'User location',
  PRODUCTS:'Products',
  CATEGORIES:'Categories'
}
const CustomerSearchScreen = (props) => {
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch()
  const [selectedTab,setSelectedTab] = useState('Products');
  const {params} = useRoute();
  const isServices = params?.isServices;
  const isProductTab = selectedTab == 'Products';
  const isServicesTab  = selectedTab == 'Services';
  const isStoresTab = selectedTab == 'Stores';
  const [searchText,setSearchtext] = useState('');
  const [productsData,setProductsData] = useState(null);
  const [servicesData,setServicesData] = useState(null);
  const [loading,setLoading] = useState(false);
  const searchCall = async(st) => {
      try 
      {
          setLoading(true);
       if(isServices) {
             const apiCall = await axios.post(customer_api_urls?.service_search,{
          searchText:st,
      });
      setServicesData(apiCall.data.Data);
      setLoading(false);

       } else {
        const apiCall = await axios.post(customer_api_urls?.search_api,{
          searchText:st,
      });
      setProductsData(apiCall.data.Data);
      setLoading(false);

       }
      setLoading(false);
      } catch(e) {
          console.log(e?.response?.data)
          setLoading(false);
       showToaster('something went wrong')
      }
  } 
  const cartProductIds = useSelector(state => state.cart.cart_items_ids);
  const addItemToCart = (item) => {
    if(cartProductIds.includes(item?._id)) {
      dispatch(CartActions.removeItemFromCart(item));
      return;
    }
    dispatch(CartActions.addItemToCart({
      ...item,
      quantity:1
    }))
  }
  return (
    <View style={{ ...CommonStyles.flexOne,backgroundColor:Colors.white }}>
      <View style={{width:'100%',backgroundColor:'white',elevation:5}}>
       <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',padding:10}}>
           <Pressable onPress={() => props.navigation.goBack()}>
               <MaterialCommunityIcon  name='keyboard-backspace' size={30} color={Colors.primaryColor}/>
           </Pressable>
         <View style={{
              width:'80%',height:45,
              borderWidth:1,
              borderColor:'#f8f8f8',
              backgroundColor:'#f8f8f8',
              borderRadius:5,
              paddingLeft:10,
              color:'grey',
              flexDirection:'row',
              justifyContent:'space-between',alignItems:'center'
          }}>
         <TextInput
          value={searchText}
          onChangeText={st => {
              setSearchtext(st);
              searchCall(st)
          }}
          placeholder={`Search for ${isServices ? 'Services' : 'Products'}`}
          placeholderTextColor={'grey'}
          style={{
              paddingLeft:10,
              color:'grey',
              flex:1
          }}/>
         {loading ?   <SpinKit
               type='ThreeBounce'
               isVisible={loading}
               color={Colors.primaryColor}
               size={30}
               /> : null}
         </View>
       </View>
       {/* <View style={{flexDirection:'row',alignItems:'center',marginTop:'7%'}}>
           <Pressable onPress={() => setSelectedTab('Products')} style={[styles.tabStyle,{
               borderBottomColor:isProductTab ? Colors.primaryColor : 'white'
           }]}>
               <Text>Products</Text>
           </Pressable>
           <Pressable onPress={() => setSelectedTab('Services')} style={[styles.tabStyle,{
               borderBottomColor:isServicesTab ? Colors.primaryColor : 'white'
           }]}>
               <Text>Services</Text>
           </Pressable>
           <Pressable onPress={() => setSelectedTab('Stores')} style={[styles.tabStyle,{
               borderBottomColor:isStoresTab ? Colors.primaryColor : 'white'
           }]}>
               <Text>Stores</Text>
           </Pressable>
       </View> */}
      </View>
      <FlatList
      data={isServices ? servicesData : productsData}
      keyExtractor={item => item?._id}
      renderItem={(itemData) => {
        if(isServices) {
         return (
          <ServicesCardComponent
          onViewDetail={() => {
            props?.navigation?.navigate(SHARED_ROUTES.SERVICE_DETAIL,{
              service:itemData?.item,
              isVendor:false
            });
          }}
           data={itemData?.item} horizontal={true}/>
         )
        } else {
         return (
          <ProductCardComponent
          onViewDetail={() => {
            props?.navigation?.navigate(CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL,{
              product:itemData.item
            });
          }}
          onAddToCart={() => addItemToCart(itemData.item)} data={itemData?.item} horizontal={true}/>
         )
        }
      }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  categoryButton: {
    padding: 10,
    backgroundColor: Colors.primaryColor,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    ...CommonStyles.flexCenter,
    margin: 5,
    borderRadius: 10,
    paddingHorizontal: 15
  },
  categoryButtonText: {
    ...CommonStyles.fontFamily,
    color: Colors.white, fontSize: 15,

  },
  offerCardImg: {
    width: '93%',
    height: 170,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10
  },
  tabStyle:{
    width:Dimensions.get('screen').width/3,paddingVertical:10,borderBottomWidth:2.5,justifyContent:'center',alignItems:'center',
    borderColor:'white'
  }
})
export default CustomerSearchScreen;
