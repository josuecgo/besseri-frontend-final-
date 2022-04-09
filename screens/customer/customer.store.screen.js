import React, { useState,useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, ScrollView, ImageBackground, FlatList, Alert } from 'react-native';
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommonStyles from '../../util/styles/styles';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import ButtonComponent from '../../components/button/button.component';
import { CUSTOMER_HOME_SCREEN_ROUTES, SHARED_ROUTES, showToaster } from '../../util/constants';
import { useDispatch, useSelector } from 'react-redux';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RatingComponent from '../../components/Ratings/rating.component';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { base_url, customer_api_urls } from '../../util/api/api_essentials';
import LoaderComponent from '../../components/Loader/Loader.component';
import ServicesCardComponent from '../../components/customer-components/ServicesCard.component';

const CustomerStoreScreen = (props) => {
    const dispatch = useDispatch();
    const cartProductIds = useSelector(state => state.cart.cart_items_ids);
    const {params} = useRoute();
    const [products,setProducts] = useState([]);
    const [categories,setCategories] = useState([]);
    const [services,setServices] = useState([]);
    const [selectedCategoryId,setSelectedCategoryId] = useState('products');
    const [loading,setLoading] = useState(false);
    const [minimumPrice,setMinimumPrice] = useState('loading');
    const cart_item_ids = useSelector(state => state?.cart?.cart_items_ids);
    const CATEGORIES = [
        {
            name:'Products',
            id:`products-1`
        },
        {
            name:'Services',
            id:`services-2`
        }
    ]
    const store = params.data;
    const getStore = async() => {
        try {
            setLoading(true);
         const apiCall = await axios.get(`${customer_api_urls.get_store_data}/${store?._id}`);
        console.log(apiCall.data);
        setCategories(apiCall.data.data.categories);
        setProducts(apiCall.data.data.products);
        setMinimumPrice(apiCall.data.data.minPrice);
        setServices(apiCall?.data?.data?.services);
        setLoading(false);
        //  setState(apiCall.data.data.products,SCREEN_STATES.PRODUCTS);
        //  setState(apiCall.data.data.categories,SCREEN_STATES.CATEGORIES);
        } catch(e) {
            setLoading(false);
            console.log(e)
            console.log(e.response.data)
           showToaster('Something went wrong please try again');
        }
      }
      useEffect(() => {
        getStore()
      },[]);
      const addItemToCart = (item) => {
        if(cartProductIds.includes(item?._id)) {
          console.log(cartProductIds);
          dispatch(CartActions.deleteItemFromCart(item?._id));
          return;
        }
        dispatch(CartActions.addItemToCart({
          ...item,
          quantity:1
        }))
    }
    return (
        <View style={styles.container}>
            <LoaderComponent isVisible={loading}/>
            <ImageBackground
                source={{ uri: `${base_url}/${store?.logo}` }}
                style={styles.img}
            >
                <View style={styles.ImageContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.headerBackButton}>
                            <Ionicons name='md-chevron-back' color={Colors.primaryColor} size={16} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerBackButton}>
                            <Ionicons name='ios-share-outline' color={Colors.primaryColor} size={16} />
                        </TouchableOpacity>
                    </View>
                </View>

            </ImageBackground>
            <View style={{margin:10}}>
                <Text style={{ ...CommonStyles.fontFamily, fontSize: 20 }}>{store?.storeName}</Text>
                <Text style={{ color: 'grey', fontSize: 12 }}>0.3 km away | <Text style={{ fontWeight: 'bold' }}>${minimumPrice} minimum</Text></Text>
                {/* <RatingComponent numOfStars={4}/> */}
                <View style={{...CommonStyles.flexDirectionRow,...CommonStyles.horizontalCenter}}>
                    <Ionicons name='location-sharp' color={Colors.primaryColor} size={20}/>
                    <Text style={{...CommonStyles.fontFamily,color:'grey',fontSize:12}}>{store?.address}</Text>
                </View>
            </View>

           <View style={{elevation:5}}>
               <View style={{flexDirection:'row'}}> 
               <TouchableOpacity
                onPress={() => {
                    setSelectedCategoryId('products');
                }}
                style={{padding:10,borderBottomWidth:3,height:50,borderBottomColor:selectedCategoryId == 'products' ? Colors.primaryColor : 'white'}}>
                    <Text style={{...CommonStyles.fontFamily,color:selectedCategoryId == 'products' ? Colors.primaryColor :'black'}}>{'Products'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => {
                    setSelectedCategoryId('services');
                }}
                style={{padding:10,borderBottomWidth:3,height:50,borderBottomColor:selectedCategoryId == 'services' ? Colors.primaryColor : 'white'}}>
                    <Text style={{...CommonStyles.fontFamily,color:selectedCategoryId == 'services' ? Colors.primaryColor :'black'}}>{'Services'}</Text>
                </TouchableOpacity>
               </View>
{/*             
           <FlatList
            data={CATEGORIES}
            horizontal
            contentContainerStyle={{marginTop:10}}
            renderItem={({item,index}) => (
                <TouchableOpacity
                onPress={() => {
                    setSelectedCategoryId(item?.id);
                    alert(selectedCategoryId)
                }}
                style={{padding:10,borderBottomWidth:3,height:50,borderBottomColor:selectedCategoryId == item?._id ? Colors.primaryColor : 'white'}}>
                    <Text style={{...CommonStyles.fontFamily,color:selectedCategoryId == item?._id ? Colors.primaryColor :'black'}}>{item?.name}</Text>
                </TouchableOpacity>
            )}
            /> */}
            {/* <ScrollView contentContainerStyle={{flexGrow:1}}> */}
            <FlatList
            data={selectedCategoryId == 'products' ? products : services}
            contentContainerStyle={{marginTop:10,flexGrow:1}}
            renderItem={({item,index}) => {
                if(selectedCategoryId == 'products') {
                
                    return (
                        <ProductCardComponent
                        onViewDetail={() => {
                          props?.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL,{
                             product:item
                           });
                        }}
                        onAddToCart={() => {
                         addItemToCart(item)
                        }}
                        inCart={cart_item_ids?.includes(item?._id)}
                        horizontal={true} data={item}/>
                    )
                  
                } else {
                   return (
                    <ServicesCardComponent
                    onViewDetail={() => {
                        props?.navigation?.navigate(SHARED_ROUTES.SERVICE_DETAIL,{
                            service:item,
                            isVendor:false
                          });
                    }}
                    onAddToCart={() => {
                     addItemToCart(item)
                    }}
                    inCart={cart_item_ids?.includes(item?._id)}
                    horizontal={true} data={item}/>
                   )
                }
            }}
            />
            {/* </ScrollView> */}
           </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container:{ flex: 1, backgroundColor: 'white' },
    headerBackButton: {
        width: 35, height: 35, borderWidth: 1, borderColor: Colors.white, backgroundColor: Colors.white, ...CommonStyles.flexCenter, borderRadius: 35 / 2, margin: 10
    },
    header:{ ...CommonStyles.flexDirectionRow, ...CommonStyles.horizontalCenter, ...CommonStyles.justifySpaceBetween },
    img:{ width: '100%', height: 150 },
    ImageContainer:{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }
})

export default CustomerStoreScreen;
