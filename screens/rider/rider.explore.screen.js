import React, {useState, useEffect} from 'react';
import {
  Alert,
  FlatList,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
  base_url,
  rider_api_urls,
} from '../../util/api/api_essentials';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import ButtonComponent from '../../components/button/button.component';
import {
  getRiderId,
  getRiderProfile,
} from '../../util/local-storage/auth_service';
import LoaderComponent from '../../components/Loader/Loader.component';
import {useSelector} from 'react-redux';


export default function RiderExplore(props) {
    const {width} = useWindowDimensions();
    const [orders, setOrders] = useState([]);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const rider_wallet = useSelector(state => state?.rider?.wallet);
    const [riderProfile, setRiderProfile] = useState(null);
    const getLocation = async () => {
        try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
            title: 'Besseri',
            message: 'Besseri necesita ubicación para mostrarle las tiendas cercanas',
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
        try {
        setLoading(true);
        console.log(orderId);
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
        console.log(e);
        console.log(e?.response?.data);
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
            range: 30,
            riderId: riderId,
        });
        setLoading(false);
        if (apiCall.status == api_statuses.success) {
            console.log(apiCall.data.data);
            setOrders(apiCall.data.data);
        } else {
            Alert.alert('apic', JSON.stringify(apiCall?.data));
            showToaster('Algo salió mal');
        }
        } catch (e) {
        setLoading(false);
        alert('error');
        console.log(e);
        console.log(e?.response?.data);
        showToaster('Algo salió mal, inténtalo de nuevo');
        }
    };
    useEffect(() => {
        getNearbyOrders();
    }, [location]);

  const OrderCard = ({data}) => {
    return (
      <View
        style={{
          width: width - 20,
          minHeight: 250,
          padding: 10,
          right: 10,
          borderRadius: 10,
          backgroundColor: 'white',
          alignSelf: 'center',
          marginHorizontal: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Image
              source={{
                uri: `https://barbaraiweins.com/wp-content/uploads/2020/09/Auto-Parts-Store.jpg`,
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
              }}
            />
            <Text
              style={{
                paddingLeft: 10,
                ...CommonStyles.fontFamily,
                fontSize: 14,
              }}>
              {'Besseri Autopartes'}
            </Text>
          </View>
          <Text style={{fontSize: 19, fontWeight: 'bold'}}>
            {data?.delivery_fee} MXN
          </Text>
        </View>
        <Text style={{fontSize: 19, fontWeight: 'bold'}}>#{data?.orderId}</Text>

        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 1,
              borderColor: Colors.primaryColor,
              borderRadius: 20 / 2,
              backgroundColor: Colors.primaryColor,
            }}
          />
          <View style={{paddingLeft: 10}}>
            <Text style={{...CommonStyles.fontFamily, color: 'grey'}}>
              {'Tienda de recogida'}
            </Text>
            <Text>{'Street#3 Mexico city - 2km away'}</Text>
          </View>
        </View>
        <View
          style={{
            borderWidth: 1,
            height: 40,
            alignSelf: 'flex-start',
            left: 10,
            bottom: 5,
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 1,
              borderColor: Colors.primaryColor,
              borderRadius: 20 / 2,
              backgroundColor: Colors.primaryColor,
            }}
          />
          <View style={{paddingLeft: 10}}>
            <Text style={{...CommonStyles.fontFamily, color: 'grey'}}>
              {'Dirección de entrega'}
            </Text>
            <Text>{data?.delivery_address?.addressLine}</Text>
          </View>
        </View>
        <View style={{alignSelf: 'flex-end'}}>
          <ButtonComponent
            buttonText={'Apply'}
            colorB={Colors.brightBlue}
            borderRadius={5}
            width={100}
            handlePress={() => {
              Alert.alert(
                '¿Quieres solicitar un viaje?',
                '¿De verdad desea solicitar esta entrega?, tendrá que entregarla dentro de los 5 días',
                [
                  {text: 'No'},
                  {
                    text: 'Yes',
                    onPress: () => {
                      requestRide(data?._id);
                    },
                  },
                ],
              );
            }}
          />
        </View>
      </View>
    );
  };

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
                radius={500}
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
        {/* <View
        style={{
            width:'90%',
            height:55,
            backgroundColor:'white',
            borderWidth:1,
            borderColor:'white',
            alignSelf:'center',
            marginTop:'10%',
            borderRadius:5,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between'
        }}
        >
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <TouchableOpacity
        onPress={() => {
            props.navigation.openDrawer()
        }}
        >
            <Feather
            name='menu'
            color='black'
            size={25}
            style={{paddingLeft:10}}
            />
            </TouchableOpacity>
        <TextInput
        placeholder="Search"
        placeholderTextColor={'black'}
        style={{color:'black',paddingLeft:10,fontSize:15}}
        />
        </View>
        <TouchableOpacity>
            <MaterialCommunityIcons
            name='microphone'
            color={Colors.primaryColor}
            size={28}
            style={{paddingRight:10}}
            />
        </TouchableOpacity>
        </View> */}
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
                    renderItem={itemData => <OrderCard data={itemData.item} />}
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
                Configure su billetera de rayas, vuelva a abrir la aplicación y luego podrá ver los pedidos.
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
});
