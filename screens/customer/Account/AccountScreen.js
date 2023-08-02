import { View, StyleSheet, Platform } from 'react-native'
import React from 'react'
import Colors from '../../../util/styles/colors'
import { MyCarActive } from '../../../components/Customer/MyCarActive'
import { BackgroundCar } from '../../../components/Background/BackgroundCar'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import {  CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants'
import { logout } from '../../../util/local-storage/auth_service'

import { useSelector,useDispatch } from 'react-redux'
import { deleteToUser } from '../../../util/ReduxStore/Actions/CustomerActions/UserInfoActions'
import { resetOrdersUser } from '../../../util/ReduxStore/Actions/CustomerActions/PedidosAction'
import { useContext } from 'react'
import { NotificationContext } from '../../../util/context/NotificationContext'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

export const AccountScreen = (props) => {
  
  const {user} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const {deleteNotificaciones} = useContext(NotificationContext)
 
  const loginLogout = async() => {
    
     if (user) {
      await logout();
      await deleteNotificaciones()
      dispatch(deleteToUser())
      dispatch(resetOrdersUser())
      if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(0);
      }
      props.navigation.replace('Splash',{reload:true});
    }else{
       props.navigation.replace('AuthStack',{reload:true});
    }
  }
  
  return (
    <View style={styles.account} >
      <View>
        <MyCarActive/>
        <BackgroundCar/>
      </View>
     

      <View style={{marginBottom:25}} >
        <BtnPrincipal
        text={'Mi cuenta'}
        onPress={() =>  props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.MY_ACCOUNT)}
        />

        <BtnPrincipal
        text={'Historial'}
        onPress={() =>  props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_PEDIDOS)}
        />

        <BtnPrincipal
        text={!user ? 'Iniciar sesion' : 'Cerrar sesion'}
        onPress={loginLogout}

        backgroundColor={Colors.cerrarSesion}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  account:{
    backgroundColor:Colors.bgColor,
    flex:1,
    paddingVertical:20,
    justifyContent:'space-around'
  }
})