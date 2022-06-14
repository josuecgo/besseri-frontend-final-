import React, { useState,useEffect } from "react";
import { FlatList, Image, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import MapView,{Marker,Polyline} from "react-native-maps";
import Colors from '../../util/styles/colors';
import { api_statuses, base_url, customer_api_urls } from "../../util/api/api_essentials";
import axios from "axios";
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from "../../util/constants";
import CommonStyles from '../../util/styles/styles';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Geolocation from "@react-native-community/geolocation";
import { useCart } from "../../hooks/useCart";
import { StoreCard } from "../../components/Customer/StoreCard";
import { SearchComponent } from "../../components/Customer/SearchComponent";




export default function CustomerMapStores(props) {

  const [stores,setstores] = useState([]);
  const [location,setLocation] = useState(null);

  const {} = useCart()
 
  const getLocationIOS = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
          getStores(position.coords);
      },
      (error) => alert(error.message),
    
    );
    const watchID = Geolocation.watchPosition((position) => {
     
    });
    setWatchID(watchID);
  }

  const getLocation = async() => {
    if (Platform.OS === 'ios') {
      getLocationIOS();
      return;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Besseri',
          'message': 'Besseri necesita ubicación para mostrarte las tiendas cercanas'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(position => {
          setLocation(position.coords);
          getStores(position.coords);
        })
      } else {
        console.log("location permission denied")
        showToaster("Permiso de ubicación denegado");
      }
    } catch(e) {
        showToaster('No pude obtener tu ubicación')
    }
  }
  const getStores = async(location) => {
    try {
      const apiCall = await axios.post(`${customer_api_urls.get_stores}`,{
        startlat:location?.latitude,
        startlng:location?.longitude,
        range:3000
      });
      if(apiCall.status == api_statuses.success) {
        
       setstores(apiCall.data.data);
      } else {
        showToaster('algo salió mal');
      }
    
    } catch(e) {
       showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
    }
  }
  useEffect(() => {
    getLocation()
  },[]);

  
  
  return (
    <View style={styles.container}>
    {/*Render our MapView*/}
      {
        location?.latitude && location?.longitude && stores  ? 
        <MapView
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude:19.485297844903283,
          longitude: -99.22777616792496,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
         
        {
          stores.map((item) => (
           
            <Marker
            coordinate={{ latitude : parseFloat(item.location?.latitude) , longitude : parseFloat(item.location?.longitude) }}
            // image={{uri: 'custom_pin'}}
            key={item._id}
            title={item.storeName}
            />

          
          ))
        }
        </MapView>
        :
        null
      }
      <View style={{flex:1,width:'100%'}}>
        
        <View style={{flex:1,position:'absolute',bottom:10,alignSelf:'center',paddingLeft:5}}>
          <FlatList
          contentContainerStyle={{flexGrow:1}}
          data={stores}
          horizontal
          keyExtractor={item => item?._id}
          renderItem={itemData => (
            <StoreCard
            data={itemData.item}
            goStore={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.STORE_SCREEN,{data:itemData.item})}
            />
          )}
          
          />
        </View>
      </View>
    </View>
  );
}
//create our styling code:
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});