import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { NotificationContext } from '../../util/context/NotificationContext';

import TopCircleComponent from '../../components/top-circle/top-circle.component';
import { NotificationCard } from '../../components/NotificationCard';
import Colors from '../../util/styles/colors';
import { BOTTOM_TAB_RIDER_ROUTES, RIDER_STACK_ROUTES, showToaster } from '../../util/constants';
import { getRiderId, getRiderProfile } from '../../util/local-storage/auth_service';
import { useLocation } from '../../hooks/useLocation';
import { ScrollView } from 'react-native-gesture-handler';
import { deviceHeight, deviceWidth } from '../../util/Dimentions';
import { NotificationEmpty } from '../../components/NotificationEmpty';
import { api_statuses, api_urls, rider_api_urls } from '../../util/api/api_essentials';
import axios from 'axios';

export const RiderNotification = ({navigation}) => {
  const {notificaciones,getNotificaciones} = useContext(NotificationContext);
  const {updateUbication} = useLocation()
 

  const orderDetail = async(body,item) => {
   
    if (!item?.isView)  {
      viewItem(item._id);
              
    }

    if (body?.order_status_code === 'RIDER_ASSIGNED') {

        try {
          
          const riderId = await getRiderId();
          const apiCall = await axios.get(`${rider_api_urls.get_myorders}/${riderId}`);
         
          if (apiCall.status == api_statuses.success) {
            const data =  apiCall.data.data;

            const d = data.filter( item => item.orderId === body?.orderId )
            
            navigation.navigate(RIDER_STACK_ROUTES.RIDER_ORDER_DETAIL,{
              order:d[0]
            })
          } else {
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
          }
        } catch (e) {
          console.log(e?.response?.data)
  
        }
      
    }else{
      navigation.navigate(BOTTOM_TAB_RIDER_ROUTES.RIDER_EXPLORE,{body})
    }
   
     
    }

   

    const viewItem = async(id) => {
        try {
          
            await axios.post(`${api_urls.viewNotification}/${id}`);
            getNotificaciones();
      
        } catch(e) {
         console.log({detail:e});
        }
    }

  const location = async( ) => {
    const p = await getRiderProfile();
    if (p.location.latitude != 0) {
      updateUbication()
    }
  }
  useEffect(() => {
    location();
  }, []);

  useEffect(() => {
    getNotificaciones()
  }, [])
  
 


  return (
    <View>
      <TopCircleComponent textHeading={'Notificaciones'} />
      <ScrollView>
        {notificaciones && notificaciones?.length > 0 ? (
          notificaciones.map((item, index) => {
           
            return (
              <View key={item._id}>
                <TouchableOpacity
                  onPress={() => orderDetail(item?.body,item)}
                  activeOpacity={0.2}
                  style={[
                    styles.card,
                    {backgroundColor: item?.isView ?  Colors.white :  '#E8F1FE'},
                  ]}>
                  <NotificationCard
                    item={item}
                    navigation={navigation}
                    orderDetail={orderDetail}
                  />
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <View>
            <NotificationEmpty/>
          </View>
        )}

      <View style={{width:deviceWidth, height:100}} />
      </ScrollView>
      
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
   
    flexDirection:'row',
    flexWrap:'wrap',
    // height:deviceWidth / 2
   
  },
})






