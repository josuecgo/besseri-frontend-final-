import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { InputMaps } from '../../../components/input-field/InputMaps'

import axios from 'axios'
import { customer_api_urls } from '../../../util/api/api_essentials'
import MapView, { Marker } from 'react-native-maps'
import { showToaster } from '../../../util/constants'

import { AlertInfo } from '../../../components/Alerts/AlertInfo'
import { adjust, deviceHeight, deviceWidth } from '../../../util/Dimentions'
import Loading from '../../../components/Loader/Loading'
import { SelectAddress } from '../../../components/Customer/SelectAddress'
import { AddressHeader } from '../../../components/Customer/AddressHeader'
import Colors from '../../../util/styles/colors'
import { Box, Text } from 'native-base'
import CommonStyles from '../../../util/styles/styles'

export const SearchAddressScreen = (props) => {
  const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ]
  const [term, setTerm] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [direccion, setDireccion] = useState()
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
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
      showToaster('Error de conexion')
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

  const editData = () => {
    setLocation(
      {
        latitude: null,
        longitude: null,
      }
    )
  }
  useEffect(() => {
    editData()
  }, [props])


  return (
    <View style={styles.search} >
     
     
      <ScrollView contentContainerStyle={{justifyContent:'space-around'}} >
      <AddressHeader />
        <MapView
          userInterfaceStyle={'dark'}
          ref={(el) => mapViewRef.current = el}
          style={styles.map}
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
            zoom: 16,
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
          customMapStyle={mapStyle}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(location?.latitude) || 19.485297844903283,
              longitude: parseFloat(location?.longitude) || -99.22777616792496,
            }}
          />
        </MapView>
       
      </ScrollView>
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
        direccion?.formatted_address && (
          <SelectAddress address={direccion} navigation={props.navigation} />
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
    backgroundColor: Colors.bgColor,
    flex: 1,
    ...CommonStyles.screenY,
    paddingBottom:30
  },
 
  map: {
    height: deviceHeight * 0.60,

  },
  alertInfo: {

  },
  loading: { position: 'absolute', bottom: deviceHeight * 0.30, right: deviceWidth * 0.45 }
})