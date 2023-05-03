import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ButtonService } from '../../../components/Home/ButtonService'
import { HStack } from 'native-base'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'

export const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.body} >
      <View/>

      <HStack
      justifyContent={'space-around'}
      >
        <ButtonService
        label={'Servicios'}
        icono={require('../../../assets/images/iconos/velocimetro.png')}
        onPress={()=>{ navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SERVICIO) }}
        />
        <ButtonService
        label={'Refacciones'}
        icono={require('../../../assets/images/iconos/bateria.png')}
        onPress={()=>{ navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_REFACCIONES) }}
        />
        <ButtonService
        label={'Lavado'}
        icono={require('../../../assets/images/iconos/carwash.png')}
        onPress={()=>{ showToaster('Proximamente') }}
        />
      </HStack>
      
    </View>
  )
}



const styles = StyleSheet.create({
  body:{
    paddingVertical:50,
    flex:1,
    justifyContent:'space-between',
    
  }
})