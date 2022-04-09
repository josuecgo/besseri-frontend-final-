import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, ScrollView, useWindowDimensions, PermissionsAndroid, FlatList, TextInput } from 'react-native';
import ProductListing from '../../components/customer-components/ProductsListing.component';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import Geolocation from '@react-native-community/geolocation';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import axios from 'axios';
import { customer_api_urls } from '../../util/api/api_essentials';
import { useDispatch, useSelector } from 'react-redux';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import InputFieldComponent from '../../components/input-field/input-field.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import {useRoute} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCardComponent from '../../components/customer-components/product-card.component';
const SCREEN_STATES = {
  USER_LOCATION:'User location',
  PRODUCTS:'Products',
  CATEGORIES:'Categories'
}
const CustomerMoreProductsScreen = (props) => {
  const { width, height } = useWindowDimensions();
  const {params} = useRoute()
  const dispatch = useDispatch()
  const [screenStates, setScreenStates] = useState({
    [SCREEN_STATES.USER_LOCATION]: {},
    [SCREEN_STATES.PRODUCTS]:[],
    [SCREEN_STATES.CATEGORIES]:[]
  });
  const [products,setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [userLocation,setUserLocation] = useState(null);
  const cartProductIds = useSelector(state => state.cart.cart_item_ids);
  const cart_items = useSelector(state => state?.cart?.cart_items);
  const setState = (valueToSet, key) => {
    setScreenStates({
      ...screenStates,
      [key]: valueToSet,
    });
  };
  //Fetching user location..............................
  const getUserLocation = async() => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location Permission',
          'message': 'This App needs access to your location ' +
                     'so we can know where you are.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await Geolocation.getCurrentPosition(res => {
          setUserLocation(res.coords);
          // setState(res.coords,SCREEN_STATES.USER_LOCATION);
        });
      } else {
        console.log("Location permission denied")
      }
  
    } catch(e) {
      console.log(e)
     showToaster('Could not get current location.')
    }
  }
  useEffect(() => {
    getUserLocation();
  },[]);
  //Getting user location ends here....................

  //Get Products to show
  const getProducts = async() => {
    try {
     const apiCall = await axios.get(`${customer_api_urls.get_category_products}/${params?.category?._id}`);
     setProducts(apiCall.data.data);
    //  setState(apiCall.data.data.products,SCREEN_STATES.PRODUCTS);
    //  setState(apiCall.data.data.categories,SCREEN_STATES.CATEGORIES);
     console.log(screenStates)
    } catch(e) {
       showToaster('Something went wrong please try again');
    }
  }
  useEffect(() => {
    getProducts()
  },[]);
   
  const addItemToCart = (item) => {
    if(cartProductIds?.includes(item?._id)) {
      showToaster('This item is already in cart');
      return;
    }
    dispatch(CartActions.addItemToCart({
      ...item,
      quantity:1
    }))

  }
  
  return (
    <View style={{ ...CommonStyles.flexOne }}>
      <View style={{ flex: 1 }}>
      <View style={styles.header}>
            <TouchableOpacity onPress={() => {
              props.navigation.goBack()
            }}>
                <MaterialCommunityIcons
                name='keyboard-backspace'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK)}>
                  <TouchableOpacity onPress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK)} >
          <MaterialCommunityIcons color={Colors.white} size={30} name="cart" />
        </TouchableOpacity>
                 {
                   cart_items.length > 0 ?
                   <View style={styles.cartItemsLengthWrapper}>
                   <Text style={styles.cartItemsLengthWrapperText}>{cart_items.length}</Text>
                 </View>
                 :
                 null
                 }
                  </TouchableOpacity>
        </View>
       <View style={{width:'95%',height:45,borderWidth:1,borderColor:Colors.light,backgroundColor:Colors.light,alignSelf:'center',margin:20,...CommonStyles.flexDirectionRow,...CommonStyles.horizontalCenter}}>
       <Ionicons
              style={{marginLeft: 10,left:5}}
              color={Colors.dark}
              size={25}
              name="search"
            />
            <TextInput
            placeholder='Search for product'
            placeholderTextColor={'black'}
            style={{paddingLeft:10}}
            />
       </View>
       <Text style={{fontSize:15,...CommonStyles.fontFamily,paddingLeft:10,bottom:10}}>Products for : {params?.category?.name}</Text>
        <View style={{ marginTop: '2%', backgroundColor: 'transparent', alignSelf: 'flex-start', flexDirection: 'row' }}>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}>
          <FlatList
          data={products}
          numColumns={2}
          contentContainerStyle={{flexGrow:1,margin:10}}
          renderItem={itemData => (
            <ProductCardComponent
            onAddToCart={() => addItemToCart(itemData.item)}
            data={itemData.item}
            cartProduct={false}
            onViewDetail={() => {
                props?.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL,{
                  product:itemData.item
                });
            }}
            />
            // <ProductListing category={itemData.item.name} products={products.filter(product => product.categoryId == itemData.item._id)} />
          )}
          />

        </ScrollView>
      </View>
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
    borderRadius: 10,
  },
    header:{
      width:'100%',
      height:80,
      backgroundColor:Colors.primaryColor,
      flexDirection:'row',
      justifyContent:'space-between',
      paddingHorizontal:20,
      alignItems:'center'
  },
  cartItemsLengthWrapper:{
    position:'absolute',bottom:0,right:0,width:20,height:20,borderWidth:1,borderRadius:20/2,borderColor:Colors.red,backgroundColor:'red',...CommonStyles.flexCenter
  },
  cartItemsLengthWrapperText:{fontSize:10,fontWeight:'bold',color:'white'}
})
export default CustomerMoreProductsScreen;
