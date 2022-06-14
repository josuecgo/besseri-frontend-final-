import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { NotificationContext } from '../../util/context/NotificationContext';

import TopCircleComponent from '../../components/top-circle/top-circle.component';
import { NotificationCard } from '../../components/NotificationCard';
import Colors from '../../util/styles/colors';
import { BOTTOM_TAB_RIDER_ROUTES } from '../../util/constants';
import { getRiderProfile } from '../../util/local-storage/auth_service';
import { useLocation } from '../../hooks/useLocation';
import { ScrollView } from 'react-native-gesture-handler';
import { deviceHeight, deviceWidth } from '../../util/Dimentions';
import { NotificationEmpty } from '../../components/NotificationEmpty';

export const RiderNotification = ({navigation}) => {
  const {notificaciones,getNotificaciones} = useContext(NotificationContext);
  const {updateUbication} = useLocation()
  const orderDetail = (item) => {
    navigation.navigate(BOTTOM_TAB_RIDER_ROUTES.RIDER_EXPLORE,{item})
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
                  onPress={() => orderDetail(item?.body)}
                  activeOpacity={0.2}
                  style={[
                    styles.card,
                    {opacity: item.body?.viewRider ? 0.9 : 1},
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
    backgroundColor: Colors.white,
    flexDirection:'row',
    flexWrap:'wrap',
    // height:deviceWidth / 2
    opacity:0.7
  },
})