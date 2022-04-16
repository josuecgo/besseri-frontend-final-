import React from 'react';
import {Text, View,StyleSheet,Image,TouchableOpacity} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import ButtonComponent from '../button/button.component';

import 'moment/locale/es';
import { adjust } from '../../util/Dimentions';
import { OrderStatusCode } from '../../util/constants';
moment.locale('es');


const OrderCard = ({data,onPress,isRider}) => {
  
  return (
    <View style={styles.cardContainer}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text style={{...CommonStyles.fontFamily, fontSize: adjust(12)}}>
        #{data?.orderId}
      </Text>
      <Text style={{...CommonStyles.fontFamily}}>
        {moment(data?.ordered_on).format('DD-MM-YYYY hh:mm A')}
      </Text>
    </View>
    <View>
      <Text
        style={{
          ...CommonStyles.fontFamily,
          fontSize: adjust(12),
          paddingVertical: 5,
        }}>
        {data?.store?.storeName}
      </Text>
      <View
        style={{
          ...CommonStyles.flexDirectionRow,
          ...CommonStyles.justifySpaceBetween,
          ...CommonStyles.horizontalCenter,
        }}>
        <Text style={{fontSize: adjust(12), ...CommonStyles.fontFamily}}>
          Items: {data?.products?.length}
        </Text>
        <Text style={{...CommonStyles.fontFamily}}>
          Cantidad total: {data?.total_amount} MXN
        </Text>
      </View>
      {isRider ? (
        <View
          style={{
            flexDirection: 'row',
          //   flexWrap: 'wrap',
              justifyContent: 'space-between',
             
          }}>
          <View style={{width:'70%'}} >
              <Text
              style={{
              //   ...CommonStyles.fontFamily,
                paddingVertical: 10,
                color: 'grey',
                
              }}
              >
              {data?.order_status_code == 'PARCEL_DELIVERED'
                ? 'Has entregado correctamente este pedido'
                : 'Tienes que entregar este pedido antes'}
              :
              </Text>
          </View>
          <View style={{width:'30%',alignItems:'flex-end',justifyContent:'center'}} >
              <Text
                  style={{
                  color:
                      data?.order_status_code == 'PARCEL_DELIVERED'
                      ? 'green'
                      : 'red',
                  }}>
                  {' '}
                  {moment(
                  data?.order_status_code == 'PARCEL_DELIVERED'
                      ? data?.delivered_on
                      : data?.to_deliver_on,
                  ).format('DD-MM-YYYY')}
              </Text>
          </View>
        </View>
      ) : null}
      <View
        style={{
          marginTop: 10,
          ...CommonStyles.flexDirectionRow,
          ...CommonStyles.justifySpaceBetween,
          ...CommonStyles.horizontalCenter,
        }}>
        <ButtonComponent
          handlePress={onPress}
          buttonText={'Detalles'}
          width={'70%'}
          colorB={Colors.primarySolid}
          borderRadius={3}
        />
        <Text
          style={{
            color: Colors.brightBlue,
            ...CommonStyles.fontFamily,
            fontSize: adjust(12),
          }}>
          {/* {data?.order_status} */}
          {OrderStatusCode[data?.order_status_code]}
        </Text>
      </View>
    </View>
  </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    width: '95%',
    minHeight: 100,
    borderWidth: 2,
    borderColor: Colors.white,
    elevation: 3,
    margin: 15,
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 2,
    elevation: 2,
    backgroundColor: Colors.white,
  },
  labelCircle: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.darkPink,
    backgroundColor: Colors.lightPink,
    ...CommonStyles.flexCenter,
    borderRadius: 40 / 2,
  },
  flexWrapper: {
    ...CommonStyles.flexDirectionRow,
    ...CommonStyles.horizontalCenter,
    paddingLeft: 5,
    paddingTop: 5,
  },
})

export default OrderCard;
