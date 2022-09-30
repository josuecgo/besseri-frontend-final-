import {useIsFocused, useRoute} from '@react-navigation/native';
import axios from 'axios';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Linking,
} from 'react-native';

import ButtonComponent from '../../components/button/button.component';
import OrderCard from '../../components/customer-components/ordercard.component';
import LoaderComponent from '../../components/Loader/Loader.component';
import {
  api_statuses,
  api_urls,
  base_url,
  customer_api_urls,
  rider_api_urls,
} from '../../util/api/api_essentials';
import {
  CUSTOMER_HOME_SCREEN_ROUTES,
  OrderStatusCode,
  showToaster,
} from '../../util/constants';
import {getRiderId, getUserId} from '../../util/local-storage/auth_service';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AddressComponent from '../../components/customer-components/customer.addresscard.component';
import {
  RiderSecurityCodeModal,
  ThinlineSeparator,
} from '../../components/CommonComponents';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import MapView, {Marker} from 'react-native-maps';
import {reloadEarnings} from '../../util/ReduxStore/Actions/RiderActions/RiderActions';
import {useDispatch} from 'react-redux';
import {adjust, deviceHeight, deviceWidth} from '../../util/Dimentions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HeaderBackground} from '../../components/Background/HeaderBackground';
import { NotificationContext } from '../../util/context/NotificationContext';

const RiderOrderDetail = props => {
  const dispatch = useDispatch();
  const {width, height} = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [delivery_security_code, setDelivery_security_code] = useState('');
  const RiderSecurityCodeModalRef = useRef(null);
  const {params} = useRoute();
  // console.log(params);
  const [order, setOrder] = useState(params?.order);
  const address = order.delivery_address;
  const user = order?.user;
  const store = order.store;
  const {top} = useSafeAreaInsets();
  const totalAmount = Number(order?.total_amount);
  const [direccion, setDireccion] = useState(null);
  const {getNotificaciones} = useContext(NotificationContext);
  useEffect(() => {
    if (order?.user._id) {
      getMyAddress();
    }
  }, [order?.user._id]);

  const changeOrderStatus = async (orderStatus, orderStatusCode) => {
    try {
      setLoading(true);
      const riderId = await getRiderId();
      const apiCall = await axios.patch(rider_api_urls.change_order_status, {
        status_code: orderStatusCode,
        status: orderStatus,
        riderId: riderId,
        orderId: order?._id,
        ...(orderStatusCode == 'PARCEL_DELIVERED'
          ? {delivery_security_code: delivery_security_code}
          : {}),
      });
      setLoading(false);
      if (apiCall?.status == api_statuses.success) {
        showToaster('status changed successfully');
        setOrder(apiCall?.data?.data);
        if (apiCall?.data?.data?.order_status_code == 'PARCEL_DELIVERED') {
          dispatch(reloadEarnings());
        }
        // console.log(apiCall?.data?.data);
      } else {
        showToaster('Algo salió mal por favor inténtalo de nuevo más tarde');
      }
    } catch (e) {
      setLoading(false);
      showToaster(
        e?.response?.data?.message
          ? e?.response?.data?.message
          : 'Something went wrong',
      );
      // console.log(e?.response?.data);
    }
  };

  const DetailItem = ({label, value, orderStatus}) => {
    return (
      <View
        style={{
          width: '100%',
          borderColor: Colors.dark,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          padding: 10,
        }}>
        <Text style={{...CommonStyles.fontFamily, fontSize: 13}}>{label}</Text>
        <Text
          style={{
            fontSize: 16,
            ...CommonStyles.fontFamily,
            color: orderStatus ? Colors.brightBlue : 'black',
          }}>
          {value}
        </Text>
      </View>
    );
  };

  const getMyAddress = async () => {
    try {
      setLoading(true);

      const apiCall = await axios.get(
        `${customer_api_urls.get_addresses}/${order?.user._id}`,
      );
      setLoading(false);
      if (apiCall.status == api_statuses.success) {
        // setDireccion(apiCall.data.data)

        setDireccion({
          lat: apiCall.data.data[0]?.latitude,
          long: apiCall.data.data[0]?.longitude,
        });
      } else {
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo ');
      }
    } catch (e) {
      // console.log(e);
      setLoading(false);
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
    }
  };

  const openMapa = () => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${direccion.lat},${direccion.long}`;
    const label = user?.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  const viewItem = async() => {

    try {
      
      await axios.post(`${api_urls.viewNotification}/${order._id}`,{user:'rider'});
     
     
    } catch(e) {
    //  console.log({detail:e});
    }
  }

  useEffect(() => {
    viewItem();
    getNotificaciones();
  }, [])

  
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <LoaderComponent isVisible={loading} />
      <RiderSecurityCodeModal
        RiderSecurityCodeModalRef={RiderSecurityCodeModalRef}
        securityCode={delivery_security_code}
        onChangeSecurityCode={dc => setDelivery_security_code(dc)}
        //  onClose={() => RiderSecurityCodeModalRef.current.close()}
        onProceed={() => {
          if (!delivery_security_code) {
            showToaster('Por favor ingrese el código de seguridad de entrega');
            return;
          }
          if (delivery_security_code == order?.delivery_security_code) {
            Alert.alert(
              '¿Paquete entregado?',
              '¿Has entregado el paquete? si continúa, cambiará el estado del pedido a pedido entregado.',
              [
                {
                  text: 'No',
                },
                {
                  text: 'Sí',
                  onPress: () => {
                    changeOrderStatus('Parcel Delivered', 'PARCEL_DELIVERED');
                    RiderSecurityCodeModalRef?.current?.close();
                  },
                },
              ],
            );
          } else {
            showToaster('Ha introducido un código de seguridad no válido');
            RiderSecurityCodeModalRef?.current?.close();
          }
        }}
      />
      {/* Inicia header */}
      <HeaderBackground />
      <View style={styles.header}>
        {/* <ImageBackground
                source={require('../../assets/images/header2.png')}
                resizeMode="stretch"
                style={styles.header}> */}
        <TouchableOpacity>
          <MaterialCommunityIcons
            onPress={() => props.navigation.goBack()}
            name="keyboard-backspace"
            color={Colors.white}
            size={25}
          />
        </TouchableOpacity>
        <View
          style={{
            ...CommonStyles.flexDirectionRow,
            ...CommonStyles.horizontalCenter,
            // marginTop: 10,
          }}>
          <View
            style={{
              width: deviceWidth * 0.14,
              height: deviceWidth * 0.14,
              ...CommonStyles.flexCenter,
              borderRadius: 5,

              alignItems: 'flex-end',
            }}>
            <Feather name="box" size={30} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.headerText}>Pedido #{order?.orderId}</Text>
            <Text
              style={{
                ...CommonStyles.fontFamily,
                fontSize: adjust(12),
                paddingLeft: 12,
                color: Colors.white,
              }}>
              {moment(order.ordered_on).format('DD-MM-YYYY hh:mm A')}
            </Text>
          </View>
        </View>
        {/* </ImageBackground> */}
      </View>

      {/* Fin Header */}
      <View
        style={{
          width: '95%',
          minHeight: 70,
          padding: 5,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            order?.order_status_code == 'PARCEL_DELIVERED'
              ? '#90ee90'
              : Colors.lightPink,
          alignSelf: 'center',
          marginVertical: 20,
        }}>
        {order?.order_status_code == 'PARCEL_DELIVERED' ? (
          <Text
            style={{
              ...CommonStyles.fontFamily,
              color: 'black',
              fontSize: adjust(11),
            }}>
            Lo entregaste con éxito el{' '}
            <Text style={{color: 'green', fontSize: adjust(11)}}>
              {moment(order?.delivered_on).format('dddd - MMM - YY')}
            </Text>
          </Text>
        ) : (
          <Text
            style={{
              ...CommonStyles.fontFamily,
              color: 'black',
              fontSize: adjust(11),
            }}>
            Tienes que entregar este pedido antes del{' '}
            <Text style={{color: 'red'}}>
              {moment(order?.to_deliver_on).format('dddd - MMM - YY')}
            </Text>
          </Text>
        )}
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: 'white',
          paddingBottom: '20%',
        }}>
        <DetailItem
          label={'Estado del pedido'}
          value={OrderStatusCode[order?.order_status_code]}
          orderStatus={true}
        />
        <ThinlineSeparator />
        <Text
          style={{
            ...CommonStyles.fontFamily,
            padding: 10,
            marginTop: 10,
            fontSize: 13,
          }}>
          Productos pedidos
        </Text>
        <View>
          {order.products.map(itemData => {
            return (
              <View
                key={itemData._id}
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignSelf: 'center',
                  marginTop: '3%',
                  borderBottomWidth: 0.3,
                  height: 50,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    width: '65%',
                    ...CommonStyles.flexDirectionRow,
                    ...CommonStyles.horizontalCenter,
                  }}>
                  <Image
                    source={{uri: `${base_url}/${itemData.productImg}`}}
                    style={{width: 40, height: 40, borderRadius: 40 / 2}}
                  />
                  <Text
                    style={{
                      fontSize: adjust(11),
                      fontWeight: 'bold',
                      paddingLeft: 5,
                    }}>
                    {itemData.name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '35%',
                  }}>
                  <View>
                    <Text style={{fontSize: adjust(11), fontWeight: 'bold'}}>
                      {itemData.quantity}x
                    </Text>
                  </View>
                  <View>
                    <Text style={{fontSize: adjust(14), fontWeight: 'bold'}}>
                      {itemData.quantity * itemData.price} MXN
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
          <View>
            
            <DetailItem
              label={'Totales'}
              value={`${totalAmount.toFixed(2)} MXN`}
            />
            <ThinlineSeparator />
          </View>
          <View style={{width: '93%', alignSelf: 'center', marginTop: '5%'}}>
            <Text style={{...CommonStyles.fontFamily, fontSize: adjust(12)}}>
              Información del vendedor
            </Text>
            <View
              style={{
                width: '100%',
                margin: 10,
                paddingVertical: 14,
                backgroundColor: Colors.white,
                alignSelf: 'center',
                borderColor: Colors.gray,
                borderWidth: 1,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: adjust(12),
                  ...CommonStyles.fontFamily,
                  paddingLeft: 25,
                  marginBottom: 10,
                }}>
                {store?.storeName}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Entypo name="location-pin" color={Colors.darkPink} size={30} />
                <Text style={{fontSize: adjust(10), width: '92%'}}>
                  {store?.address}
                </Text>
              </View>
            </View>
            {store?.location?.latitude && store?.location?.longitude ? (
              <MapView
                style={{height: 150, width: width - 40, alignSelf: 'center'}}
                //specify our coordinates.
                initialRegion={{
                  latitude: Number(store?.location?.latitude),
                  longitude: Number(store?.location?.longitude),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                <Marker
                  coordinate={{
                    latitude: Number(store?.location?.latitude),
                    longitude: Number(store?.location?.longitude),
                  }}
                  title={`${store?.storeName}'s location`}
                />
              </MapView>
            ) : null}
          </View>
        </View>
        {order?.order_status_code == 'PARCEL_DELIVERED' ? null : (
          <View>
            <View style={{width: '93%', alignSelf: 'center', marginTop: '5%'}}>
              <Text style={{...CommonStyles.fontFamily, fontSize: adjust(12)}}>
                Información del cliente
              </Text>
              <View
                style={{
                  width: '100%',
                  margin: 10,
                  paddingVertical: 14,
                  backgroundColor: Colors.white,
                  alignSelf: 'center',
                  borderColor: Colors.gray,
                  borderWidth: 1,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    ...CommonStyles.fontFamily,
                    paddingLeft: 25,
                    marginBottom: 10,
                  }}>
                  {user?.name}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Entypo
                    name="location-pin"
                    color={Colors.darkPink}
                    size={30}
                  />
                  <Text style={{fontSize: adjust(10), width: '92%'}}>
                    {store?.address}
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                ...CommonStyles.fontFamily,
                padding: 10,
                marginTop: 10,
                fontSize: 16,
              }}>
              Dirección de entrega
            </Text>
            <AddressComponent
              label={address?.label}
              addressLine={address?.addressLine}
              info={address?.info}
              phone={address?.phone}
            />
            <TouchableOpacity onPress={openMapa} style={styles.btnMap}>
              <Text style={styles.textMap}>Abrir Mapa</Text>
              <Feather name="navigation" size={20} color={Colors.white} />
            </TouchableOpacity>
            <ThinlineSeparator margin={20} />
          </View>
        )}
        <LoaderComponent isVisible={loading} />
      </ScrollView>
      <View
        style={{
          ...CommonStyles.flexDirectionRow,
          justifyContent: 'space-around',
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 15,
        }}>
        {order?.order_status_code == 'PARCEL_DELIVERED' ? null : (
          <ButtonComponent
            buttonText={
              order?.order_status_code == 'RIDER_ASSIGNED'
                ? '¿Paquete recogido?'
                : order?.order_status_code == 'PARCEL_PICKED'
                ? 'Sale para la entrega'
                : order?.order_status_code == 'OUT_FOR_DELIVERY'
                ? '¿Paquete entregado?'
                : ''
            }
            width={width - 20}
            colorB={Colors.brightBlue}
            borderRadius={10}
            margin={10}
            handlePress={() => {
              if (order?.order_status_code == 'RIDER_ASSIGNED') {
                Alert.alert(
                  '¿Pedido recogido?',
                  '¿Has elegido el pedido? continuar cambiará el estado del pedido a pedido recogido.',
                  [
                    {
                      text: 'No',
                    },
                    {
                      text: 'Si',
                      onPress: () => {
                        changeOrderStatus('Order Picked', 'PARCEL_PICKED');
                      },
                    },
                  ],
                );
              } else if (order?.order_status_code == 'PARCEL_PICKED') {
                Alert.alert(
                  '¿Fuera para entrega?',
                  '¿Estás fuera para la entrega? continuar cambiará el estado del pedido a pedido recogido.',
                  [
                    {
                      text: 'No',
                    },
                    {
                      text: 'Si',
                      onPress: () => {
                        changeOrderStatus(
                          'Out for delivery',
                          'OUT_FOR_DELIVERY',
                        );
                      },
                    },
                  ],
                );
              } else if (order?.order_status_code == 'OUT_FOR_DELIVERY') {
                
                Alert.alert(
                  'Entregar paquete',
                  order?.chargeId === 'cash' ? `Recuerda recibir el pago del producto $${order?.total_amount }` : '¿Estás entregando el paquete?',
                  [
                    {
                      text: 'No',
                    },
                    {
                      text: 'Si',
                      onPress: () => {
                        RiderSecurityCodeModalRef?.current?.open();
                      },
                    },
                  ],
                );
                
              }
            }}
          />
        )}
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  placeOrderText: {...CommonStyles.fontFamily, fontSize: adjust(12)},
  placeOrderTextDetail: {
    fontSize: 13,
    fontWeight: '300',
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
    color: Colors.dark,
  },
  placeOrderWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 40,
  },
  header: {
    // width: '100%',
    // minHeight: 110,
    // backgroundColor: Colors.primaryColor,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // width:deviceWidth,
    width: deviceWidth,
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.1,

    paddingHorizontal: 20,
  },
  btnMap: {
    backgroundColor: Colors.primarySolid,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginVertical: 5,
    // width:deviceWidth / 2
    flexDirection: 'row',
  },
  textMap: {
    fontSize: adjust(12),
    color: Colors.white,
    right: 5,
  },
  headerText: {
    ...CommonStyles.fontFamily,
    color: Colors.white,
    fontSize: adjust(20),
    paddingLeft: 10,
  },
});
export default RiderOrderDetail;


