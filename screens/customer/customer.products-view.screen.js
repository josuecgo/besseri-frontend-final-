import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, ScrollView, Platform, PermissionsAndroid, FlatList, Pressable } from 'react-native';
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
import { adjust, deviceWidth } from '../../util/Dimentions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const SCREEN_STATES = {
  USER_LOCATION:'User location',
  PRODUCTS:'Products',
  CATEGORIES:'Categories'
}
const CATEGORIES = {
  TRANSMISION: require(`../../assets/images/categorias/transmision.png`),
  FRENOS: require('../../assets/images/categorias/transmision.png'),

};
const CustomerProductsViewScreen = (props) => {

  const [screenStates, setScreenStates] = useState({
    [SCREEN_STATES.USER_LOCATION]: {},
    [SCREEN_STATES.PRODUCTS]:[],
    [SCREEN_STATES.CATEGORIES]:[]
  });
  const [products,setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [services,setServices] = useState([]);
  const [userLocation,setUserLocation] = useState(null);    
  const [coords,setCoords] = useState({
    longitude: 0,
    latitude: 0
});

  const [comision, setComision] = useState(0)
  const setState = (valueToSet, key) => {
    setScreenStates({
      ...screenStates,
      [key]: valueToSet,
    });
  };
  //Fetching user location..............................
  const getUserLocation = async() => {
    if (Platform.OS === 'ios') {
      getLocation()
    }else{
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
   
  }
  

  const getLocation = async() => {
    await Geolocation.getCurrentPosition(
      (position) => {
        const currentLatitude = JSON.stringify(position.coords.latitude);
        const currentLongitude = JSON.stringify(position.coords.longitude);
        setCoords({
            latitude:currentLatitude,
            longitude:currentLongitude
        })
      },
      (error) => console.log('error.message'),
    
    );
    // const watchID = await Geolocation.watchPosition((position) => {
    //   const currentLatitude = JSON.stringify(position.coords.latitude);
    //   const currentLongitude = JSON.stringify(position.coords.longitude);
    //   setCoords({
    //     latitude:currentLatitude,
    //     longitude:currentLongitude
    // })
    // });
    // setWatchID(watchID);
  }


  useEffect(() => {
    getUserLocation();
  },[]);
  //Getting user location ends here....................
  
  //Get Products to show
  const getProducts = async() => {
    try {
      const apiCall = await axios.get(customer_api_urls.get_products);
      const getFee = await axios.get(customer_api_urls?.get_fees);
      
      setComision(getFee.data.data[0]?.besseri_comission);  
      setProducts(apiCall.data.data.products);
      setCategories(apiCall.data.data.categories)
    //  setState(apiCall.data.data.products,SCREEN_STATES.PRODUCTS);
    //  setState(apiCall.data.data.categories,SCREEN_STATES.CATEGORIES);
     
    } catch(e) {
       showToaster('Algo salío mal');
    }
  }
  useEffect(() => {
    getProducts()
  },[]);
   

   //Get Service to show
   const getServices = async() => {
    try {
     const apiCall = await axios.get(customer_api_urls.get_services);
    
     setServices(apiCall.data.data);
    } catch(e) {
      alert('error here')
     
       showToaster('Algo salío mal');
    }
  }
  useEffect(() => {
    getServices()
  },[]);

  const CategoryButton = ({ category,onPress }) => {
    return (
      <View style={{alignItems:'center'}} >
        <TouchableOpacity onPress={onPress} style={styles.categoryButton}>
           
            <Image source={CATEGORIES[category]} style={{width:20,height:20}} />
        </TouchableOpacity>
        <Text style={{fontSize:adjust(5)}} >
              {category}
        </Text>
      </View>
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
    <View style={{ ...CommonStyles.flexOne,backgroundColor:Colors.bgColor }}>
      <View style={{ flex: 1 }}>
        <View style={{ paddingVertical: 20, backgroundColor: 'transparent', alignSelf: 'flex-start', flexDirection: 'row' }}>
         
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
        

        <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 5 }}>

         {
            categories.map((item)=>(
              <View key={item._id}>
                <ProductListing
                navigation={props.navigation}
                category={item.name} 
                products={products.filter(product => product.categoryId == item._id)} 
                comision={comision}
                />
              </View>
            ))
          }
        <View style={{height:deviceWidth *0.10,width:deviceWidth,marginBottom:30}} />
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  categoryButton: {
    padding: 20,
    backgroundColor: Colors.white,
    ...CommonStyles.flexCenter,
    margin: 5,
    borderRadius: 100,
    // paddingHorizontal: 15
    elevation:2
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
