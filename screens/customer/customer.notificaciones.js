import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, ScrollView, Platform, PermissionsAndroid, FlatList } from 'react-native';
import ProductListing from '../../components/customer-components/ProductsListing.component';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import Geolocation from '@react-native-community/geolocation';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import axios from 'axios';
import {  api_urls, customer_api_urls } from '../../util/api/api_essentials';
import { deleteNotification, getNotification, getUser, getUserId } from '../../util/local-storage/auth_service';

import { adjust, deviceWidth } from '../../util/Dimentions';
import { NotificationContext } from '../../util/context/NotificationContext';
import TopCircleComponent from '../../components/top-circle/top-circle.component';
import { NotificationCard } from '../../components/NotificationCard';
import { NotificationEmpty } from '../../components/NotificationEmpty';


export const CustomerNotificationViewScreen = React.memo((props) => {

    const [comision, setComision] = useState(0);
    const [delivery, setDelivery] = useState(0)
    const {notificaciones,getNotificaciones} = useContext(NotificationContext);
  
    const orderDetail = (body) => {
        // const {orderNumber,orderId} = route.params
        
        props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_DETAIL,
            {order:body, 
                comision,
                delivery})
        
        if (body?._id && !body?.viewCustomer)  {
            viewItem(body._id);
            
        }
    }

    const viewItem = async(orderId) => {
        try {
          
            await axios.post(`${api_urls.viewNotification}/${orderId}`,{user:'customer'});
            getNotificaciones();
        //   console.log(apiCall.status);
        } catch(e) {
         console.log({detail:e});
        }
    }

   
  
    return (
        <View style={{ ...CommonStyles.flexOne,backgroundColor:Colors.bgColor }}>
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 5 }}>
            {
                    notificaciones && notificaciones?.length > 0 ? ( notificaciones.map((item,index) => {
                       
                        return (
                            <View key={item._id}  >
                              <TouchableOpacity  
                              onPress={() => orderDetail(item?.body)} 
                              activeOpacity={0.2}
                              style={[styles.card, {backgroundColor: item.body?.viewCustomer ?  Colors.white :  '#E8F2FD'} ]}
                              >
                                <NotificationCard item={item}  orderDetail={orderDetail} />
                              </TouchableOpacity>
                               
                            </View>
                        )
                       
                    })
                    ) : (
                        <View>
                           <NotificationEmpty/>
                        </View>
                    )
                }
            </ScrollView>
        </View>
    </View>
  );
})

const styles = StyleSheet.create({
    card: {
      marginHorizontal: 10,
      padding: 10,
      marginVertical: 5,
      
   
      flexDirection:'row',
      flexWrap:'wrap',
      // height:deviceWidth / 2
      
    },
  })

