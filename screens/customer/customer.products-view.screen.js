import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, ScrollView, useWindowDimensions, PermissionsAndroid, FlatList, Pressable } from 'react-native';
import ProductListing from '../../components/customer-components/ProductsListing.component';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import Geolocation from '@react-native-community/geolocation';
import { CUSTOMER_HOME_SCREEN_ROUTES, SHARED_ROUTES, showToaster } from '../../util/constants';
import axios from 'axios';
import { base_url, customer_api_urls } from '../../util/api/api_essentials';
import { useDispatch, useSelector } from 'react-redux';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import RatingComponent from '../../components/Ratings/rating.component';
const SCREEN_STATES = {
  USER_LOCATION:'User location',
  PRODUCTS:'Products',
  CATEGORIES:'Categories'
}
const CustomerProductsViewScreen = (props) => {
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch()
  const [screenStates, setScreenStates] = useState({
    [SCREEN_STATES.USER_LOCATION]: {},
    [SCREEN_STATES.PRODUCTS]:[],
    [SCREEN_STATES.CATEGORIES]:[]
  });
  const [products,setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [services,setServices] = useState([]);
  const [userLocation,setUserLocation] = useState(null);
  
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
     const apiCall = await axios.get(customer_api_urls.get_products);
     console.log('line 70',apiCall.data.data)
     setProducts(apiCall.data.data.products);
     setCategories(apiCall.data.data.categories)
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
   

   //Get Service to show
   const getServices = async() => {
    try {
     const apiCall = await axios.get(customer_api_urls.get_services);
     console.log('line 70',apiCall.data.data)
     setServices(apiCall.data.data);
    } catch(e) {
      alert('error here')
      console.log(e.response.data);
       showToaster('Something went wrong please try again');
    }
  }
  useEffect(() => {
    getServices()
  },[]);

  const CategoryButton = ({ category,onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.categoryButton}>
        <Text style={styles.categoryButtonText}>{category}</Text>
      </TouchableOpacity>
    )
  }
  const OfferCard = ({ img }) => {
    return (
      <Image
        source={{ uri: img }}
        style={styles.offerCardImg}
      />
    )
  }
  return (
    <View style={{ ...CommonStyles.flexOne,backgroundColor:Colors.white }}>
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: '2%', backgroundColor: 'transparent', alignSelf: 'flex-start', flexDirection: 'row' }}>
         
          <FlatList
          data={categories}
          horizontal
          keyExtractor={item => item?._id}
          renderItem={({item}) => (
            <CategoryButton
            onPress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.MORE_PRODUCTS,{category:item})}
            category={item.name} />
          )}
          />
        </View>
        

        <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}>
        {/* <FlatList
          data={services}
          horizontal
          keyExtractor={item => item?._id}
          renderItem={({item}) => (
            <Pressable
            onPress={() => {
                props.navigation.navigate(SHARED_ROUTES.SERVICE_DETAIL,{
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
                    <RatingComponent numOfStars={5} totalReviews={10}/>
                    </View>
                    <Text style={{...CommonStyles.fontFamily,fontSize:16}}>$ {item?.price}</Text>
                    </View>
                 
                </Pressable>
          )}
          /> */}
          <FlatList
          data={categories}
          keyExtractor={item => item?._id}
          renderItem={itemData => (
            <ProductListing
            navigation={props.navigation}
            category={itemData.item.name} products={products.filter(product => product.categoryId == itemData.item._id)} />
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
    borderRadius: 10
  }
})
export default CustomerProductsViewScreen;
