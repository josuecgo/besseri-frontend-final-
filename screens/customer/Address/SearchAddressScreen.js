import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { InputMaps } from '../../../components/input-field/InputMaps'
import Colors from '../../../util/styles/colors'
import axios from 'axios'
import { customer_api_urls } from '../../../util/api/api_essentials'
import MapView, { Marker } from 'react-native-maps'
import { showAlertMsg, showToaster } from '../../../util/constants'
import { Alert } from 'native-base'
import { AlertInfo } from '../../../components/Alerts/AlertInfo'
import { deviceHeight, deviceWidth } from '../../../util/Dimentions'
import Loading from '../../../components/Loader/Loading'
import { SelectAddress } from '../../../components/Customer/SelectAddress'

export const SearchAddressScreen = () => {
  const [term, setTerm] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [direccion, setDireccion] = useState()
  const [location, setLocation] = useState(null);
  const mapViewRef = useRef();
  const [textValue, setTextValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState({
    show: false,
    msg: ''
  })
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
      setShow({
        show: false,
        msg: ''
      })
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



  const onMovePositionMaker = async (loc) => {
    try {
      setIsLoading(true)
      const apiCall = await axios.post(`${customer_api_urls.geocode_addresses}`, loc);


      if (!apiCall?.data.success) {

        setShow({ view: !apiCall?.data.success, msg: apiCall?.data.msg });
        setDireccion(null)
      } else {

        const { address_components, formatted_address, geometry, place_id } = apiCall?.data?.data

        // console.log(address_components[0]);
        // console.log(address_components[1]);
        // console.log(address_components[2]);
        // console.log(address_components[3]);
        setDireccion({
          address_components,
          formatted_address,
          latitude: geometry.location.lat,
          longitude: geometry.location.lng,
          place_id,

        })
        // setTextValue(apiCall?.data?.data)
      }

      setLocation(loc)
      centerPosition(loc)

      setIsLoading(false);

    } catch (error) {

      setIsLoading(false)
      showToaster('Espere un momento por favor 400.')
    }

  }



  return (
    <View style={styles.search} >
      <View>
        <InputMaps
          placeholder='Direccion'
          onDebounce={(value) => setTerm(value)}
          addresses={addresses}
          onChangeDirection={onChangeDirection}
          textValue={textValue}
          setTextValue={setTextValue}
        />
        {
          show.view && (
            <View style={styles.alertInfo} >
              <AlertInfo show={show} setShow={setShow} />
            </View>

          )
        }


      </View>



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
              if (isLoading) {
                showToaster('Espere un momento.')
                return
              }

              setShow({
                show: false,
                msg: ''
              })


              let loc = {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              }
              // console.log(e.nativeEvent);

              onMovePositionMaker(loc)
            }}


          >
            <Marker
              coordinate={{
                latitude: parseFloat(location?.latitude) || 19.485297844903283,
                longitude: parseFloat(location?.longitude) || -99.22777616792496,
              }}


            />



          </MapView>
        )



      }

      {
        direccion?.formatted_address && (
          <SelectAddress address={direccion} />
        )
      }

      {
        isLoading && (
          <View style={styles.loading} >
            <Loading />
          </View>
        )
      }


    </View>
  )
}



const styles = StyleSheet.create({
  search: {
    // backgroundColor:Colors.bgColor,
    flex: 1,
    justifyContent: 'space-between'
  },
  map: {
    height: deviceHeight * 0.50,
  },
  alertInfo: {

  },
  loading:{ position: 'absolute', bottom: deviceHeight * 0.30, right: deviceWidth * 0.45 }
})