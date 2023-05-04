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

export const HomeScreen = ({navigation}) => {
  const {address,carActive} = useSelector(state => state.user);
  const dispatch = useDispatch()


  // Lo puedo volver un hook
  const getInfoUser = async() => {
    if (carActive) {
      return
    }
    const carActive = await getCarActive();
    dispatch( addCarActiveToUser(carActive) )
  }
  useEffect(() => {
    getInfoUser()
  }, [])
  
  return (
    <View style={styles.body} >
      <HStack alignItems={'center'} space={2} mx={2} >

        <Avatar size={'lg'} ></Avatar>
        <Heading size={'sm'} color={Colors.white} >{carActive?.marca?.name} {carActive?.modelo?.name}</Heading>
     
      </HStack>
       
       <Image
       alt='car'
       source={require('../../../assets/images/car_home.png')}
       resizeMode='cover'
       style={styles.img}
       />
     
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
  img:{
    width:deviceWidth,
    height:deviceWidth - 10
  }
})