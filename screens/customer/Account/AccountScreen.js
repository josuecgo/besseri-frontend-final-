import { View, StyleSheet, Platform, Linking, Alert } from 'react-native'
import React, { useEffect } from 'react'
import Colors from '../../../util/styles/colors'
import { MyCarActive } from '../../../components/Customer/MyCarActive'
import { BackgroundCar } from '../../../components/Background/BackgroundCar'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import {  CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { logout } from '../../../util/local-storage/auth_service'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector,useDispatch } from 'react-redux'
import { deleteToUser } from '../../../util/ReduxStore/Actions/CustomerActions/UserInfoActions'
import { resetOrdersUser } from '../../../util/ReduxStore/Actions/CustomerActions/PedidosAction'
import { useContext } from 'react'
import { NotificationContext } from '../../../util/context/NotificationContext'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Button } from 'native-base'
import { resetCart } from '../../../util/ReduxStore/Actions/CustomerActions/CartActions'
import { useNavigation, useRoute } from '@react-navigation/native'

export const AccountScreen = (props) => {
  
  const {user} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const {deleteNotificaciones} = useContext(NotificationContext)

    const navigation = useNavigation();
      const route = useRoute();

      useEffect(() => {
        if (route.params?.goTo) {
          navigation.navigate(route.params.goTo);
        }
      }, [route.params?.goTo]);
 
  const loginLogout = async() => {
    
     if (user) {
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro de que deseas cerrar sesión?',
        [
          {
            text: 'Cancelar',
            onPress: () => console.log('Cancelado'),
            style: 'cancel',
          },
          { text: 'Sí', onPress: () => logoutOff() },
        ],
        { cancelable: false }
      );
    }else{
       props.navigation.navigate('AuthStack',{reload:true});
    }
  }

  const logoutOff = async() => {
    try {
      await logout()
      await deleteNotificaciones()
      dispatch(deleteToUser())
      dispatch(resetOrdersUser())
      dispatch(resetCart())
      if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(0);
      }
      props.navigation.replace('Splash',{logout:true});
    } catch (error) {
      showToaster('Ocurrió un error.')
    }
  }



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
        {
          user?.role === 'client' && (
            <MyCarActive/>
          )
        }
       
        <BackgroundCar/>
      </View>
     

      <View style={{marginBottom:20}} >

        {
          user && (
           <>
            <BtnPrincipal
            text={'Mi cuenta'}
            onPress={() =>  props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.MY_ACCOUNT)}
            />
    
            <BtnPrincipal
            text={'Historial'}
            onPress={() =>  props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_PEDIDOS)}
            />

            {
              user?.role === 'mechanic' && (
                <BtnPrincipal
                text={'Mis cotizaciones'}
                onPress={() =>  props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_QUOTE)}
                />
              )
            }
             
           </>
          )
        }
       

        

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