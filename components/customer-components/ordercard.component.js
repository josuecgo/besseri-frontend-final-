import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';

import moment from 'moment';
import ButtonComponent from '../button/button.component';

import 'moment/locale/es';
import { adjust, deviceWidth } from '../../util/Dimentions';
import { OrderStatusCode } from '../../util/constants';
import { Image } from 'native-base';
import { base_url } from '../../util/api/api_essentials';
moment.locale('es');


const OrderCard = ({ data, onPress, isRider,isDelivered }) => {
  // console.log(isDelivered);
  const { products } = data;
  // console.log(products);
  return (
    <View style={styles.cardContainer}>
      <View>


        <View
          style={{
           marginLeft:10,
           marginBottom:5,
            ...CommonStyles.flexDirectionRow,
            ...CommonStyles.justifySpaceBetween,
            ...CommonStyles.horizontalCenter,
          }}>

          <Text
            style={{
              color: Colors.brightBlue,
              ...CommonStyles.fontFamily,
              fontSize: adjust(15),
            }}>
            {/* {data?.order_status} */}
            {OrderStatusCode[data?.order_status_code]}
          </Text>
        </View>
    </View>
      <View style={styles.cardTop}>
        <View style={styles.contentImg} >

          {
            products.map((item, i) => {
              // if (i == 2) return
              return (
                <Image
                  key={item._id}
                  source={{ uri: `${base_url}/${item?.productImg}` }}
                  alt="Image"
                  resizeMode="cover"
                  style={{
                    width: deviceWidth * 0.20,
                    height: deviceWidth * 0.20,
                    borderRadius: 10,
                    marginVertical: 2
                  }}
                />

              )
            })
          }
        </View>

        <View style={styles.sidebar} >
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{ ...CommonStyles.fontFamily, fontSize: adjust(12) }}>
                #{data?.orderId}
              </Text>
              <Text style={{ ...CommonStyles.fontFamily }}>
                {moment(data?.ordered_on).format('DD-MM-YYYY hh:mm A')}
              </Text>
            </View>
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
              <Text style={{ fontSize: adjust(12), ...CommonStyles.fontFamily }}>
                Items: {data?.products?.length}
              </Text>
              <Text style={{ ...CommonStyles.fontFamily }}>
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
                <View style={{ width: '70%' }} >
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
                <View style={{ width: '30%', alignItems: 'flex-end', justifyContent: 'center' }} >
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
          </View>

          {/* <View> */}


            {/* <View
              style={{
                marginTop: 10,
                ...CommonStyles.flexDirectionRow,
                ...CommonStyles.justifySpaceBetween,
                ...CommonStyles.horizontalCenter,
              }}>

              <Text
                style={{
                  color: Colors.brightBlue,
                  ...CommonStyles.fontFamily,
                  fontSize: adjust(12),
                }}>
                
                {OrderStatusCode[data?.order_status_code]}
              </Text>
            </View> */}
          {/* </View> */}

        </View>

      </View>
      <View style={styles.cardBottom} >
        <ButtonComponent
        handlePress={onPress}
        buttonText={'Detalles'}
        width={(!isRider && isDelivered) ? deviceWidth * 0.3 : deviceWidth * 0.80}
        colorB={Colors.primarySolid}
        borderRadius={10}
        margin={5}
        />
        {
          (!isRider && isDelivered) && (
            <ButtonComponent
            handlePress={onPress}
            buttonText={'Escribir un comentario'}
            width={deviceWidth * 0.5}
            colorB={Colors.alert}
            borderRadius={10}
            margin={5}
            />
          )
        }
        

      </View>
      
    </View>

  );
};
const styles = StyleSheet.create({
  cardContainer: {
    width: '95%',
    minHeight: 100,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.white,
    elevation: 3,
    margin: 15,
    alignSelf: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 1,

    elevation: 2,
    backgroundColor: Colors.white,
   
  },
  cardTop: {
    width: '100%',
    // minHeight: 100,
    // borderRadius: 7,
    // borderWidth: 2,
    // borderColor: Colors.white,
    // elevation: 3,
    // margin: 15,
    // alignSelf: 'center',
    // paddingHorizontal: 5,
    // paddingVertical: 5,
    // borderWidth: 1,
    flexDirection: 'row'
  },
  cardBottom:{
    flexDirection:'row',
    flex:1,
    // backgroundColor:'red',
    justifyContent:'center',
    // marginHorizontal:5
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
  contentImg: {
    marginHorizontal: 7,

    // height:100
  },
  sidebar: {
    // backgroundColor: 'red',
    flex: 1,
    justifyContent: 'space-between',
    padding: 10
  }
})

export default OrderCard;
