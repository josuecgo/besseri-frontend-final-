import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FlatList, Image, PermissionsAndroid,
  StyleSheet, Text, TouchableOpacity,
  useWindowDimensions, View
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import { api_statuses, base_url, customer_api_urls } from "../../util/api/api_essentials";
import axios from "axios";
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from "../../util/constants";
import CommonStyles from '../../util/styles/styles';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Geolocation from "@react-native-community/geolocation";
import { useCart } from "../../hooks/useCart";
import { StoreCard } from "../../components/Customer/StoreCard";
import { SearchComponent } from "../../components/Customer/SearchComponent";
import Carousel from "react-native-snap-carousel";
import { adjust, deviceWidth } from "../../util/Dimentions";
import { ProductContext } from "../../util/context/Product/ProductContext";
import { AspectRatio, Box } from "native-base";
import Colors from "../../util/styles/colors";




export default function CustomerMapStores(props) {

  const [stores, setstores] = useState([]);
  const [location, setLocation] = useState(null);
  const [storeActive, setStoreActive] = useState(false)
  const { getProductStore } = useContext(ProductContext)
  const maoViewRef = useRef();

  const getLocationIOS = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        getStores(position.coords);
      },
      (error) => {},

    );
    const watchID = Geolocation.watchPosition((position) => {

    });
    //setWatchID(watchID);
  }

  const getLocation = async () => {
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
        // showToaster("Permiso de ubicación denegado");
      }
    } catch (e) {
      showToaster('No pude obtener tu ubicación')
    }
  }
  const getStores = async (location) => {
    try {
      const apiCall = await axios.post(`${customer_api_urls.get_stores}`, {
        startlat: location?.latitude || 19.485306213822334,
        startlng: location?.longitude || -99.22779700380474,
        // startlat:  19.485306213822334,
        // startlng:  -99.22779700380474,
        range: 30
      });
      if (apiCall.status == api_statuses.success) {

        setstores(apiCall.data.data);
      } else {
        showToaster('algo salió mal');
      }

    } catch (e) {
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
    }
  }

  const centerPosition = async (loc) => {

    maoViewRef.current?.animateCamera({
      center: {
        latitude: loc?.latitude,
        longitude: loc?.longitude
      }
    })
  }


  useEffect(() => {
    if (!location) {
      getLocation()
    }

  }, [location]);

  const emptyStore = () => {
    return (
      <Box alignItems="center" width={deviceWidth} >
        <Box
          alignItems="center"
          justifyContent="space-evenly"
          maxW="80"
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          backgroundColor={Colors.white}
          w={deviceWidth - 10}
          h={deviceWidth / 3}

        >
          {/* <AspectRatio w="100%" ratio={16 / 9}> */}
            <Image 
            source={require('../../assets/images/not-found.png')}            
            alt="image" 
            style={{
              width:50,
              height:50
            }}
            />
          {/* </AspectRatio> */}
          <Text style={{fontSize:adjust(12)}} >No hay refaccionarias cerca de tu ubicación</Text>
        </Box>
      </Box>
    )
  }
  return (
    <View style={styles.container}>
      {/*Render our MapView*/}
      {
        location?.latitude && location?.longitude && stores ?
          <MapView
            ref={(el) => maoViewRef.current = el}
            // provider={PROVIDER_GOOGLE}
            style={styles.map}
            //specify our coordinates.
            initialRegion={{
              latitude: location?.latitude || 19.485297844903283,
              longitude: location?.longitude || -99.22777616792496,

              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >

            {
              stores.map((item) => (

                <Marker
                  coordinate={{ latitude: parseFloat(item.location?.latitude), longitude: parseFloat(item.location?.longitude) }}
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
      <View style={{ flex: 1, width: '100%' }}>

        <View style={{ flex: 1, position: 'absolute', bottom: 25, alignSelf: 'center', paddingLeft: 5 }}>
          <Carousel
            // ref={(c) => { this._carousel = c; }}
            ListEmptyComponent={emptyStore}
            data={stores}
            renderItem={itemData => (
              <StoreCard
                data={itemData.item}
                goStore={async () => {
                  await getProductStore(itemData?.item)
                  props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.STORE_SCREEN, { data: itemData?.item })
                }
                }
              />
            )}
            sliderWidth={deviceWidth}
            itemWidth={deviceWidth}
            onSnapToItem={(index) => {
              // console.log(stores[index]?.location);
              let storeLocation = {
                latitude: stores[index]?.location?.latitude,
                longitude: stores[index]?.location?.longitude,
              }
              setStoreActive(stores[index]);
              centerPosition(storeLocation)
            }}
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