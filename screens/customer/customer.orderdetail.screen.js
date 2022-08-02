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
  Platform,
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
import {CUSTOMER_HOME_SCREEN_ROUTES, showToaster} from '../../util/constants';
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
import {HeaderBackground} from '../../components/Background/HeaderBackground';
import {adjust, deviceHeight} from '../../util/Dimentions';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CustomerOrderDetail = props => {
  const {width, height} = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const {params} = useRoute();
  const address = params.order.delivery_address;
  let store = params.order.store;
  const totalAmount = parseInt(params.order.total_amount);
  const {top} = useSafeAreaInsets();
  const comision = params.comision;
  const [storeId, setStoreId] = useState(null);

  const openMapa = () => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${store?.location?.latitude},${store?.location?.longitude}`;
    const label = store?.storeName;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };


  const getStore = async () => {
    const url = `${customer_api_urls.get_store_data}/${params?.order.storeId}`;
    const apiCall = await axios.get(url);
    // console.log(apiCall?.data?.data?.profile);

    setStoreId(apiCall?.data?.data?.profile);
  };



  useEffect(() => {
    if (!store) {
      getStore();
    }
  }, []);

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

  return (
    <View style={{flex: 1, backgroundColor: Colors.bgColor}}>
      <HeaderBackground />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => props?.navigation?.goBack()}
          style={{position: 'absolute', left: 5}}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            color={Colors.white}
            size={25}
          />
        </TouchableOpacity>
        <View style={{...CommonStyles.flexDirectionRow}}>
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
            <Text style={styles.headerText}>
              Pedido #{params?.order?.orderId}
            </Text>
            <Text
              style={{
                ...CommonStyles.fontFamily,
                fontSize: 13,
                paddingLeft: 12,
                color: Colors.white,
              }}>
              {moment(params.order.ordered_on).format('DD-MM-YYYY hh:mm A')}
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
        <DetailItem
          label={'Status'}
          value={params?.order?.order_status}
          orderStatus={true}
        />
        <Text
          style={{
            ...CommonStyles.fontFamily,
            padding: 10,
            marginTop: 10,
            fontSize: 13,
          }}>
          Productos que ha pedido
        </Text>
        <View>
          <View
            style={{
              width: '95%',
              minHeight: 70,
              padding: 5,
              padding: 15,
              backgroundColor: Colors.lightPrimary,
              alignSelf: 'center',
              marginVertical: 20,
            }}>
            <Text
              style={{
                ...CommonStyles.fontFamily,
                color: 'black',
                fontSize: adjust(25),
              }}>
              {params?.order?.delivery_security_code}
            </Text>
            <Text
              style={{
                color: 'black',
                fontWeight: '300',
                fontSize: 12,
                marginTop: 10,
              }}>
              Tienes que decirle este código al pasajero cuando te entregue un
              pedido, sin decirle este código al pasajero es posible que no
              recibas el paquete.
            </Text>
          </View>

      
          <View>
         
            <DetailItem
              label={'Total'}
              value={`${totalAmount.toFixed(2)} MXN`}
            />
            <ThinlineSeparator />
          </View>
          <View style={{width: '93%', alignSelf: 'center', marginTop: '5%'}}>
            <Text style={{...CommonStyles.fontFamily, fontSize: 15}}>
              Información del vendedor
            </Text>
            <View
              style={{
                width: '100%',
                margin: 10,
                paddingVertical: 14,
                backgroundColor: Colors.white,
                alignSelf: 'center',
                borderRadius: 1,
                elevation: 1,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  ...CommonStyles.fontFamily,
                  paddingLeft: 25,
                  marginBottom: 10,
                }}>
                {store ? store?.storeName : storeId?.storeName}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Entypo name="location-pin" color={Colors.darkPink} size={30} />
                <Text style={{fontSize: 13, width: '92%'}}>
                  
                  {store ? store?.address : storeId?.address}
                </Text>
              </View>
            </View>
          </View>
          <ThinlineSeparator margin={20} />
        </View>

        {address?.label ? (
          <>          
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
          </>

        ) : (
          <>      
          <Text
          style={{
            ...CommonStyles.fontFamily,
            padding: 10,
            marginTop: 10,
            fontSize: 16,
          }}>
          Dirección de tienda
        </Text>
          <TouchableOpacity onPress={openMapa} style={styles.btnMap}>
              <Text style={styles.textMap}>Abrir Mapa</Text>
              <Feather name="navigation" size={20} color={Colors.white} />
            </TouchableOpacity>
          </>
    
        )}
        <ThinlineSeparator margin={20 + top} />
        <LoaderComponent isVisible={loading} />
      </ScrollView>
      <View
        style={{
          ...CommonStyles.flexDirectionRow,
          justifyContent: 'space-around',
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 15 + top,
        }}>
        <ButtonComponent
          buttonText={'¿Factura?'}
          width={width / 2.2}
          colorB={Colors.terciarySolid}
          borderRadius={10}
          margin={10}
          handlePress={() => {
            Linking.openURL(
              `mailto:${store?.email}?subject=Solicitud de Facura`,
            );
          }}
        />
        <ButtonComponent
          buttonText={'Ayuda'}
          width={width / 2.2}
          colorB={Colors.info}
          borderRadius={10}
          margin={10}
          handlePress={() => {
            Linking.openURL(`mailto:${store?.email}`);
          }}
        />
      </View>
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
    // paddingHorizontal:20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'red'
  },
  headerText: {
    ...CommonStyles.fontFamily,
    color: Colors.white,
    fontSize: 20,
    paddingLeft: 10,
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
});
export default CustomerOrderDetail;
