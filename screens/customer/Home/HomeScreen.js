import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { ButtonService } from '../../../components/Home/ButtonService'
import { Avatar, Box, HStack, Heading, Image } from 'native-base'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { useDispatch, useSelector } from 'react-redux'
import Colors from '../../../util/styles/colors'
import { getCarActive } from '../../../util/local-storage/auth_service'
import { addCarActiveToUser } from '../../../util/ReduxStore/Actions/CustomerActions/UserInfoActions'
import { deviceWidth } from '../../../util/Dimentions'
import { BackgroundCar } from '../../../components/Background/BackgroundCar'
import { MyCarActive } from '../../../components/Customer/MyCarActive'

export const HomeScreen = ({navigation}) => {




  
  return (
    <View style={styles.body} >
      
      <MyCarActive/>
       
      <BackgroundCar/>
     
      <HStack
      justifyContent={'space-around'}
      backgroundColor={'white'}
      mb={'50px'}
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
    paddingVertical:20,
    flex:1,
    justifyContent:'space-between',
    backgroundColor:Colors.bgColor
  },
 
})