import { View, StyleSheet, Platform, Linking } from 'react-native'
import React from 'react'
import Colors from '../../../util/styles/colors'
import { MyCarActive } from '../../../components/Customer/MyCarActive'
import { BackgroundCar } from '../../../components/Background/BackgroundCar'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import {  CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants'
import { logout } from '../../../util/local-storage/auth_service'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector,useDispatch } from 'react-redux'
import { deleteToUser } from '../../../util/ReduxStore/Actions/CustomerActions/UserInfoActions'
import { resetOrdersUser } from '../../../util/ReduxStore/Actions/CustomerActions/PedidosAction'
import { useContext } from 'react'
import { NotificationContext } from '../../../util/context/NotificationContext'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Button } from 'native-base'

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

  const openWhatsApp = (phoneNumber) => {
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
  
    Linking.canOpenURL(whatsappUrl).then((supported) => {
      if (supported) {
        return Linking.openURL(whatsappUrl);
      } else {
        console.error("WhatsApp is not installed on the device");
      }
    }).catch((err) => console.error("An error occurred", err));
  };

  const abrirWhatsApp = (numero) => {
    const enlaceWhatsApp = `https://wa.me/${numero}`;
    
    if (!numero) {
      return;
    }
    
    Linking.canOpenURL(enlaceWhatsApp)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(enlaceWhatsApp);
        } else {
          showToaster("No se puede abrir WhatsApp.");
        }
      })
      .catch((error) => console.log(error));
  };
  
  return (
    <View style={styles.account} >
      <View>
        <MyCarActive/>
        <BackgroundCar/>
      </View>
     

      <View style={{marginBottom:20}} >
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
         <Button 
          variant={'ghost'}
          leftIcon={<MaterialIcons  name="whatsapp" size={25} color={Colors.white} />}
          onPress={() =>  abrirWhatsApp('+5215534715331')}
          _text={{
            fontWeight: '700',
            fontSize: '18px',
            color: Colors.white,
            // fontFamily:'Arial',
            fontStyle:'normal'
          }}
          >
            Soporte
          </Button>
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