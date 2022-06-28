import React, {useState, useEffect, useContext} from 'react';
import {
  Alert,
  FlatList,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  useWindowDimensions,
  View,
} from 'react-native';
import MapView, {Circle} from 'react-native-maps';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import {showToaster} from '../../util/constants';
import {
  api_statuses,
  api_urls,
  base_url,
  rider_api_urls,
  vendor_api_urls,
} from '../../util/api/api_essentials';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import ButtonComponent from '../../components/button/button.component';
import {
  getRiderId,
  getRiderProfile,
  getUserId,
} from '../../util/local-storage/auth_service';
import LoaderComponent from '../../components/Loader/Loader.component';
import {useSelector} from 'react-redux';
import {deviceWidth} from '../../util/Dimentions';
import { CardOrders } from '../../components/Rider/CardOrders';
import { NotificationContext } from '../../util/context/NotificationContext';

export default function RiderExplore(props) {
  const {getNotificaciones} = useContext(NotificationContext);
  const [orders, setOrders] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const rider_wallet = useSelector(state => state?.rider?.wallet);
  const [riderProfile, setRiderProfile] = useState(null);
  const item = props.route.params ? props?.route?.params.item : false;
  
  const getLocationIos = () => {
    Geolocation.getCurrentPosition(position => {
      setLocation(position.coords);
    });
  };

  const getLocation = async () => {
    if (Platform.OS === 'ios') {
      getLocationIos();
      return;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Besseri',
          message:
            'Besseri necesita ubicación para mostrarle las tiendas cercanas',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(position => {
          setLocation(position.coords);
        });
      } else {
        console.log('location permission denied');
        showToaster('Permiso de ubicación denegado');
      }
    } catch (e) {
      showToaster('No pude obtener tu ubicación');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const requestRide = async orderId => {
    
    getNotificaciones();
    try {
      setLoading(true);

      const riderId = await getRiderId();
      const apiCall = await axios.post(`${rider_api_urls.request_ride}`, {
        orderId: orderId,
        riderId: riderId,
        can_deliveryBy: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      });
      setLoading(false);
      if (apiCall.status == api_statuses.success) {
        showToaster('Viaje solicitado con éxito');
        getNearbyOrders();
      } else {
        showToaster('Algo salió mal');
      }
    } catch (e) {
      setLoading(false);
      // console.log(e);
      console.log({xplorerRider:e?.response?.data});
      showToaster(
        e?.response?.data?.message
          ? e?.response?.data?.message
          : 'Algo salió mal. Por favor, vuelva a intentarlo',
      );
    }
  };
  const getNearbyOrders = async () => {
    try {
      const riderData = await getRiderProfile();
      setRiderProfile(riderData);
      setLoading(true);
      const riderId = await getRiderId();
      const apiCall = await axios.post(`${rider_api_urls.get_nearby_orders}`, {
        startlat: location?.latitude,
        startlng: location?.longitude,
        // rango de distancia
        range: 30,
        riderId: riderId,
      });
      setLoading(false);
      if (apiCall.status == api_statuses.success) {
       
        setOrders(apiCall.data.data);
      } else {
        Alert.alert('apic', JSON.stringify(apiCall?.data));
        showToaster('Algo salió mal');
      }
    } catch (e) {
      setLoading(false);
    
      console.log(e?.response?.data);
      showToaster('Algo salió mal, inténtalo de nuevo');
    }
  };

  
  
  useEffect(() => {
    getNearbyOrders();
  }, [location]);



  return (
    <View style={styles.container}>
      <LoaderComponent isVisible={loading} />
      {/*Render our MapView*/}
      {location?.latitude && location?.longitude ? (
        <MapView
          style={styles.map}
          //specify our coordinates.
          initialRegion={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Circle
            radius={100}
            center={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
            fillColor="#000"
            strokeColor="#000"
            strokeWidth={10}
          />
        </MapView>
      ) : null}
      <View style={{flex: 1, width: '100%'}}>
        {rider_wallet?.charges_enabled && riderProfile?.wallet_id ? (
          <View
            style={{
              width: '95%',
              position: 'absolute',
              bottom: 20,
              backgroundColor: orders?.length > 0 ? 'transparent' : 'white',
              alignSelf: 'center',
            }}>
            {orders?.length == 0 ? (
              <View>
                <Text
                  style={{
                    fontSize: 19,
                    ...CommonStyles.fontFamily,
                    textAlign: 'center',
                  }}>
                  No se encontraron pedidos
                </Text>
              </View>
            ) : (
              <View style={{flex: 1}}>
                <FlatList
                    data={orders}
                    horizontal
                    keyExtractor={item => item?._id}
                    // renderItem={itemData => <OrderCard data={itemData.item} />}
                    renderItem={itemData => <CardOrders data={itemData.item} requestRide={requestRide} />}
                    
                /> 
                
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              width: '95%',
              position: 'absolute',
              bottom: 20,
              backgroundColor: Colors.lightRed,
              justifyContent: 'center',
              alignItems: 'center',
              height: 70,
              alignSelf: 'center',
            }}>
            <Text>
              Configure su billetera de rayas, vuelva a abrir la aplicación y
              luego podrá ver los pedidos.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
//create our styling code:
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  orderCard: {
    width: deviceWidth - 20,
    minHeight: 250,
    padding: 10,
    right: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  orderCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  orderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderCardImg: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  orderCardTitle: {
    paddingLeft: 10,
    ...CommonStyles.fontFamily,
    fontSize: 14,
  },
  orderCardDeliveryFee: {fontSize: 19, fontWeight: 'bold'},
  orderCardBody: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 20 / 2,
    backgroundColor: Colors.primaryColor,
  },
  orderCardFooter: {
    borderWidth: 1,
    height: 40,
    alignSelf: 'flex-start',
    left: 10,
    bottom: 5,
  },
  orderCardAddress: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 20 / 2,
    backgroundColor: Colors.primaryColor,
  },
});
