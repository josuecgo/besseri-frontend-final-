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
import ServiceListing from '../../components/customer-components/ServiceListing';
const SCREEN_STATES = {
  USER_LOCATION:'User location',
  PRODUCTS:'Products',
  CATEGORIES:'Categories'
}
const CustomerProductsViewScreen = (props) => {
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();
  const [comision, setComision] = useState(0)
  const [screenStates, setScreenStates] = useState({
    [SCREEN_STATES.USER_LOCATION]: {},
    [SCREEN_STATES.PRODUCTS]:[],
    [SCREEN_STATES.CATEGORIES]:[]
  });
  const [products,setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [services,setServices] = useState([]);
  const [userLocation,setUserLocation] = useState(null);
  const cartProductIds = useSelector(state => state.cart.cart_item_ids);
  
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
          'title': 'Permiso de ubicación',
          'message': 'Esta aplicación necesita acceso a tu ubicación ' +
                     'para que sepamos donde estas.'
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
     showToaster('No se pudo obtener la ubicación actual.')
    }
  }
  useEffect(() => {
    getUserLocation();
  },[]);
  //Getting user location ends here....................



   //Get Service to show
   const getServices = async() => {
    try {
      const apiCall = await axios.get(customer_api_urls.get_services);
      const getFee = await axios.get(customer_api_urls?.get_fees);
      
      setComision(getFee.data.data[0]?.besseri_comission);  
      setServices(apiCall.data.data);
      setCategories(apiCall.data.categories)
    } catch(e) {
      alert('error here')
      console.log(e.response.data);
       showToaster('No se pudo obtener la ubicación actual');
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
        {/* <View style={{ marginTop: '2%', backgroundColor: 'transparent', alignSelf: 'flex-start', flexDirection: 'row' }}>
         
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
        </View> */}
        

        <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}>
      
          {/* <FlatList
          data={categories}
          keyExtractor={item => item?._id}
          renderItem={itemData => (
            <ServiceListing
            navigation={props.navigation}
            category={itemData.item.name} services={services.filter(service => service.categoryId == itemData.item._id)} />
          )}
          /> */}
          {
            categories.map( (item) => (
              <View key={item._id} >
                <ServiceListing
                navigation={props.navigation}
                category={item.name} 
                services={services.filter(service => service.categoryId == item._id)} 
                comision={comision}
                />
              </View>
              
           
            ))
          }

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
