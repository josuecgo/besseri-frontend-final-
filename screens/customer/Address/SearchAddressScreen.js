import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { InputMaps } from '../../../components/input-field/InputMaps'
import Colors from '../../../util/styles/colors'
import axios from 'axios'
import { customer_api_urls } from '../../../util/api/api_essentials'
import MapView, { Marker } from 'react-native-maps'

export const SearchAddressScreen = () => {
  const [term, setTerm] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [direccion, setDireccion] = useState()
  const [location, setLocation] = useState(null);
  const mapViewRef = useRef();
  const [textValue, setTextValue] = useState('');

  const centerPosition = async (loc) => {

    mapViewRef.current?.animateCamera({
      center: loc,
      // pitch: 45,
      // heading: 90,
      // altitude: 10,
      // zoom: 100,
      
    })
  }

  const autocompleteAddress = async () => {

    try {
      const apiCall = await axios.get(`${customer_api_urls.search_addresses}/${term}`);

      
      setAddresses(apiCall?.data?.data)
    } catch (error) {
      console.log("🚀 ~ file: SearchAddressScreen.js:19 ~ autocompleteAddress ~ error:", error)

    }


  }

  useEffect(() => {
    if (term.length === 0) {
      return setAddresses([]);
    }
    autocompleteAddress()
  }, [term])

  const onChangeDirection = (data) => {
   
    let loc = {
      latitude: data?.geometry?.location.lat,
      longitude: data?.geometry?.location.lng,
    }
    onMovePositionMaker(loc)
    // setTextValue(data.formatted_address)
   
    setLocation(loc)
    centerPosition(loc)
    setAddresses([])
  }


  const onMovePositionMaker = async(loc) => {
    try {
      const apiCall = await axios.post(`${customer_api_urls.geocode_addresses}`,loc);

      const {address_components,formatted_address,geometry,place_id} = apiCall?.data?.data
      console.log(formatted_address);
      // console.log(address_components[0]);
      // console.log(address_components[1]);
      // console.log(address_components[2]);
      // console.log(address_components[3]);
      setDireccion({
        numero: address_components[0].long_name,
        calle: address_components[1].long_name,
        col: address_components[2].long_name,
        municipio:address_components[3].long_name,
        estado: address_components[4].long_name,
        pais: address_components[5].long_name,
      })
      // setTextValue(apiCall?.data?.data)
      setLocation(loc)
      centerPosition(loc)
    } catch (error) {
      console.log(error);
    }
   
  }

  console.log(direccion);
  return (
    <View style={styles.search} >
      {/* <Text>{direccion}</Text> */}
      <InputMaps
        placeholder='Calle'
        onDebounce={(value) => setTerm(value)}
        addresses={addresses}
        onChangeDirection={onChangeDirection}
        textValue={textValue}
        setTextValue={setTextValue}
      />

      {

          location?.latitude && location?.longitude && (
          <MapView
            ref={(el) => mapViewRef.current = el}
            // provider={PROVIDER_GOOGLE}
            style={styles.map}
            //specify our coordinates.
            initialRegion={{
              latitude: location?.latitude || 19.485297844903283,
              longitude: location?.longitude || -99.22777616792496,

              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}

            initialCamera={{
              center: {
                latitude: location?.latitude || 19.485297844903283,
                longitude: location?.longitude || -99.22777616792496,
              },
              pitch: 0,
              heading: 0,
              altitude: 0,
              zoom: 14,
            }}

            onPress={e => {
              
              let loc = {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude:e.nativeEvent.coordinate.longitude,
              }
              // console.log(e.nativeEvent);
              onMovePositionMaker(loc)
            }}
            
            
          >



            {/* <Marker
              coordinate={{
                latitude: parseFloat(location?.latitude),
                longitude: parseFloat(location?.longitude)
              }}
              // image={{uri: 'custom_pin'}}
              
              title={''}

            /> */}
             <Marker
            coordinate={{
              latitude: parseFloat(location?.latitude) || 19.485297844903283,
              longitude: parseFloat(location?.longitude) || -99.22777616792496,
            }}
           
            
          />



          </MapView>
        )

      }

    </View>
  )
}



const styles = StyleSheet.create({
  search: {
    // backgroundColor:Colors.bgColor,
    flex: 1,
    justifyContent:'space-between'
  },
  map:{
    height: '100%',
  }
})