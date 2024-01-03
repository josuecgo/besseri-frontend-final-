import { StyleSheet, View } from 'react-native'
import React, { useEffect, } from 'react'
import { ButtonService } from '../../../components/Home/ButtonService'
import { HStack,  } from 'native-base';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { useSelector } from 'react-redux'
import Colors from '../../../util/styles/colors'
import { BackgroundCar } from '../../../components/Background/BackgroundCar'
import { MyCarActive } from '../../../components/Customer/MyCarActive'

import { useInfoUser } from '../../../hooks/useInfoUsers'





export const HomeScreen = ({ navigation }) => {

  const { getUserInfo } = useInfoUser();
  const { carActive } = useSelector(state => state.user);



  useEffect(() => {
    getUserInfo()
  }, [])





  return (
    <View style={styles.body} >

      <MyCarActive navigation={navigation} />

      <BackgroundCar home={true}  />

      <HStack
        justifyContent={'space-around'}
        alignItems={'center'}
        mb={'50px'}

      >
        <ButtonService
          label={'Servicios'}
          icono={require('../../../assets/images/home/servicios.png')}
          onPress={() => {
            navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.HOME_VALET,{lavado:false})
            // navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SERVICES_CATEGORIES)
          }}
          style={74}

        />
        <ButtonService
          label={'Refacciones'}
          icono={require('../../../assets/images/home/refaccion.png')}
          onPress={() => {
            if (!carActive) {

              showToaster('Active un vehículo para ver los productos.')
              return
            }
            navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_REFACCIONES)
          }}
          style={85}
        />
        <ButtonService
          label={'Lavado'}
          icono={require('../../../assets/images/home/lavado.png')}
          onPress={() => {

            navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.HOME_VALET,{lavado:true})
          }}

        />
      </HStack>

    </View>
  )
}



const styles = StyleSheet.create({
  body: {
    // paddingTop:20,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: Colors.bgColor,
  },

})