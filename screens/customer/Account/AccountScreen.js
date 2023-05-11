import { View, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../../util/styles/colors'
import { MyCarActive } from '../../../components/Customer/MyCarActive'
import { BackgroundCar } from '../../../components/Background/BackgroundCar'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import { BOTTOM_TAB_CUSTOMER_ROUTES, CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { logout } from '../../../util/local-storage/auth_service'
import { useContext } from 'react'
import { NotificationContext } from '../../../util/context/NotificationContext'

export const AccountScreen = (props) => {
  const {getNotificaciones} = useContext(NotificationContext);
  
  return (
    <View style={styles.account} >
      <View>
        <MyCarActive/>
        <BackgroundCar/>
      </View>
     

      <View style={{marginBottom:25}} >
        <BtnPrincipal
        text={'Mis autos'}
        onPress={() =>  props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_CARS)}
        />

        <BtnPrincipal
        text={'Pedidos'}
        onPress={() =>  props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_PEDIDOS)}
        />

        <BtnPrincipal
        text={'Cerrar sesion'}
        onPress={async() =>{
          await logout()
          getNotificaciones()
          props.navigation.navigate(BOTTOM_TAB_CUSTOMER_ROUTES.HOME_SCREEN,{reload:true});
          showToaster('Cerraste sesión')
        }}

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