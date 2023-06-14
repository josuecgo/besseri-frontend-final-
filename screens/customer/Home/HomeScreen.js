import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonService } from '../../../components/Home/ButtonService'
import { Avatar, Box, HStack, Heading, Image } from 'native-base'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { useDispatch, useSelector } from 'react-redux'
import Colors from '../../../util/styles/colors'
import { getCarActive, getGarage, getUserAddress } from '../../../util/local-storage/auth_service'
import { addCarActiveToUser } from '../../../util/ReduxStore/Actions/CustomerActions/UserInfoActions'
import { deviceWidth } from '../../../util/Dimentions'
import { BackgroundCar } from '../../../components/Background/BackgroundCar'
import { MyCarActive } from '../../../components/Customer/MyCarActive'
import ChecksHome from '../../../components/Customer/ChecksHome'
import { useInfoUser } from '../../../hooks/useInfoUsers'
import { AgendaService } from '../../../components/Services/AgendaService'

export const HomeScreen = ({navigation}) => {

  const {getUserInfo} = useInfoUser();
  const {carActive} = useSelector(state => state.user);




  useEffect(() => {
    getUserInfo()
  }, [])
  

  return (
    <View style={styles.body} >
      
      <MyCarActive/>
       
      <BackgroundCar home={true} />
   
      <HStack
      justifyContent={'space-around'}
      alignItems={'center'}
      mb={'50px'}
     
      >
        <ButtonService
        label={'Servicios'}
        icono={require('../../../assets/images/home/servicios.png')}
        onPress={()=>{ navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SERVICES_CATEGORIES) }}
        style={74}
        
        />
        <ButtonService
        label={'Refacciones'}
        icono={require('../../../assets/images/home/refaccion.png')}
        onPress={()=>{ 
          if (!carActive) {
            
            showToaster('Active un vehiculo para ver los productos.')
            return
          }
          navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_REFACCIONES) 
        }}
        style={85}
        />
        <ButtonService
        label={'Lavado'}
        icono={require('../../../assets/images/home/lavado.png')}
        onPress={()=>{ navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.LAVADO) }}
        
        />
      </HStack>
      
    </View>
  )
}



const styles = StyleSheet.create({
  body:{
    paddingTop:20,
    flex:1,
    justifyContent:'space-around',
    backgroundColor:Colors.bgColor,
  },
 
})