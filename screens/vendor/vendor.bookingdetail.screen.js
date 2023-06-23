import {useIsFocused, useRoute} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import ButtonComponent from '../../components/button/button.component';
import OrderCard from '../../components/customer-components/ordercard.component';
import LoaderComponent from '../../components/Loader/Loader.component';
import {
  api_statuses,
  base_url,
  customer_api_urls,
  vendor_api_urls,
} from '../../util/api/api_essentials';
import {
  CUSTOMER_HOME_SCREEN_ROUTES,
  showToaster,
  STATUSES_COLORS,
} from '../../util/constants';
import {getUserId} from '../../util/local-storage/auth_service';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AddressComponent from '../../components/customer-components/customer.addresscard.component';
import {ThinlineSeparator} from '../../components/CommonComponents';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {adjust, deviceHeight} from '../../util/Dimentions';
import {HeaderBackground} from '../../components/Background/HeaderBackground';
import { TranslateStatus } from '../../util/helpers/StatusText';


const VendorBookingDetail = props => {
  const {width, height} = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const {params} = useRoute();
  const totalAmount = Number(params.booking.total_amount);
  const [booking, setBooking] = useState(params.booking);
  
  

  const confirmationAlert = (head, detail, status, code) => {
    Alert.alert(head, detail, [
      {text: 'No'},
      {
        text: 'Si',
        onPress: () => {
          chaneStatus(status, code);
        },
      },
    ]);
  };
  const cancelAppointment = async () => {
    try {
      setLoading(true);
      const apiCall = await axios.post(customer_api_urls.cancel_booking, {
        booking_id: booking?._id,
      });
      setLoading(false);
      if (apiCall.status == api_statuses.success) {
        setBooking(apiCall.data.data[0]);
      } else {
        showToaster('Algo salió mal');
      }
    } catch (e) {
      setLoading(false);
      showToaster('Algo salió mal');
      // //console.log(e.response);
    }
  };
  const chaneStatus = async (status, code) => {
    try {
      setLoading(true);
      const apiCall = await axios.post(vendor_api_urls.change_booking_status, {
        booking_id: booking?._id,
        status: status,
        code: code,
      });
      setLoading(false);
      if (apiCall.status == api_statuses.success) {
        setBooking(apiCall.data.data[0]);
      } else {
        showToaster('Algo salió mal');
      }
    } catch (e) {
      setLoading(false);
      showToaster('Algo salió mal');
      // //console.log(e.response.data);
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
        <Text style={{...CommonStyles.fontFamily, fontSize: adjust(12)}}>
          {label}
        </Text>
        <Text
          style={{
            fontSize: 16,
            ...CommonStyles.fontFamily,
            color: orderStatus
              ? STATUSES_COLORS[booking?.booking_status_code]
              : 'black',
          }}>
          {value}
        </Text>
      </View>
    );
  };

  const DetailItem2 = ({label, value, orderStatus}) => {
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
        <Text style={{...CommonStyles.fontFamily, fontSize: adjust(12)}}>
          {label}
        </Text>
        <Text
          style={{
            fontSize: 16,
            ...CommonStyles.fontFamily,
            color: orderStatus
              ? STATUSES_COLORS[booking?.booking_status_code]
              : 'black',
          }}>
          {TranslateStatus(value)}
        </Text>
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderBackground />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={{left: 5, position: 'absolute'}}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            color={Colors.white}
            size={25}
          />
        </TouchableOpacity>
        <View
          style={{
            ...CommonStyles.flexDirectionRow,
            ...CommonStyles.horizontalCenter,
            marginTop: 10,
          }}>
          <View
            style={{
              width: 45,
              height: 45,
              borderWidth: 1,
              borderColor: Colors.white,
              backgroundColor: Colors.white,
              ...CommonStyles.flexCenter,
              borderRadius: 5,
            }}>
            <Feather name="box" size={30} color={Colors.primarySolid} />
          </View>
          <View>
            <Text style={styles.headerText}>#{booking?.bookingId}</Text>
            <Text
              style={{
                ...CommonStyles.fontFamily,
                fontSize: 13,
                paddingLeft: 12,
                color: Colors.white,
              }}>
              {moment(booking.booked_on).format('DD-MM-YYYY hh:mm A')}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: 'white',
          paddingBottom: '20%',
        }}>
        <DetailItem2
          label={'Estado de la reservación'}
          value={booking?.booking_status}
          orderStatus={true}
        />
        <ThinlineSeparator margin={20} />
        <View>
          <View
            style={{
              backgroundColor: Colors.lightPink,
              flexDirection: 'row',
              alignItems: 'center',
              height: 60,
              paddingHorizontal: 5,
              marginBottom: 20,
              justifyContent: 'center',
            }}>
            <Text style={{color: 'black', ...CommonStyles.fontFamily}}>
              Horarios reservados
            </Text>
            <Text
              style={{
                color: 'black',
                ...CommonStyles.fontFamily,
                fontSize: adjust(10),
              }}>
              {moment(booking?.date).format('DD-MMMM-YYYY')}-
              {moment(booking?.time).format('hh:mm A')}
            </Text>
          </View>

          <View style={{width: '93%', alignSelf: 'center'}}>
            <Text style={{...CommonStyles.fontFamily, fontSize: 15}}>
              Resumen del servicio
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Image
                source={{uri: `${base_url}/${booking?.service?.coverImg}`}}
                style={{width: 60, height: 60, borderRadius: 10}}
              />
              <Text
                style={{
                  paddingHorizontal: 10,
                  width: '80%',
                  fontWeight: '300',
                }}>
                {booking?.service?.description}
              </Text>
            </View>
          </View>

          <View>
            <ThinlineSeparator margin={20} />

            {/* <DetailItem label={'Besseri Cargos'} value={'2.00 MXN'} />
            <DetailItem
              label={'Subtotal'}
              value={`${totalAmount.toFixed(2)} MXN`}
            /> */}
            <DetailItem
              label={'Total'}
              value={`${(totalAmount).toFixed(2)} MXN`}
            />
            <ThinlineSeparator margin={20} />
          </View>
          <View style={{width: '93%', alignSelf: 'center', marginTop: '5%'}}>
            <Text style={{...CommonStyles.fontFamily, fontSize: 15}}>
              Información de usuario
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
                {booking?.user?.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  ...CommonStyles.fontFamily,
                  paddingLeft: 25,
                  marginBottom: 10,
                }}>
                {booking?.user?.email}
              </Text>

              {/* <View style={{flexDirection:'row',alignItems:'center'}}>
     <Entypo
     name='location-pin'
     color={Colors.darkPink}
     size={30}
     />
     <Text style={{fontSize:13,width:'92%'}}>{booking?.store?.address}</Text>
     </View> */}
            </View>
          </View>
          <ThinlineSeparator margin={20} />
        </View>

        <LoaderComponent isVisible={loading} />
      </ScrollView>
      {booking?.booking_status_code == 'CANCELLED' ? null : (
        <View
          style={{
            ...CommonStyles.flexDirectionRow,
            justifyContent: 'space-around',
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 15,
          }}>
          {booking?.booking_status_code == 'COMPLETED' ? null : (
            <ButtonComponent
              buttonText={'Cancelar'}
              width={width / 2.2}
              colorB={
                booking?.booking_status_code == 'PENDING'
                  ? Colors.red
                  : Colors.primarySolid
              }
              borderRadius={10}
              margin={10}
              handlePress={async () => {
                if (booking?.booking_status_code == 'PENDING') {
                  Alert.alert(
                    'CANCELACIÓN DE RESERVA',
                    '¿Realmente desea cancelar esta cita?',
                    [{text: 'No'}, {text: 'Si', onPress: cancelAppointment}],
                  );
                }
              }}
            />
          )}
          <ButtonComponent
            handlePress={() => {
              if (booking?.booking_status_code == 'PENDING') {
                confirmationAlert(
                  'Aceptando reserva',
                  '¿Realmente quieres aceptar este servicio?',
                  'En curso',
                  'ON_GOING',
                );
              } else if (booking?.booking_status_code == 'ON_GOING') {
                confirmationAlert(
                  'Servicio completo',
                  '¿Realmente desea cerrar este servicio ahora? ¿Estás seguro de que este servicio está hecho?',
                  'Completed',
                  'COMPLETED',
                );
              }else{
                 Linking.openURL(`mailto:${booking.user.email}?subject=Envio de Facura`)
              }
            }}
            buttonText={
              booking?.booking_status_code == 'PENDING'
                ? 'Accept'
                : booking?.booking_status_code == 'ON_GOING'
                ? 'Completo'
                : 'Enviar factura'
            }
            width={
              booking?.booking_status_code == 'COMPLETED'
                ? width - 20
                : width / 2.2
            }
            colorB={
              booking?.booking_status_code == 'COMPLETED'
                ? Colors.primarySolid
                : Colors.succes
            }
            borderRadius={10}
            margin={10}
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  placeOrderText: {...CommonStyles.fontFamily, fontSize: 20},
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
    width: '100%',
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.1,

    paddingHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    ...CommonStyles.fontFamily,
    color: Colors.white,
    fontSize: adjust(13),
    paddingLeft: 10,
  },
});
export default VendorBookingDetail;
