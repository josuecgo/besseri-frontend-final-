import { StyleSheet, View } from 'react-native'
import React, { useEffect, } from 'react'
import { ButtonService } from '../../../components/Home/ButtonService'
import { HStack, } from 'native-base';
import { BOTTOM_TAB_CUSTOMER_ROUTES, CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { useSelector } from 'react-redux'
import Colors from '../../../util/styles/colors'
import { BackgroundCar } from '../../../components/Background/BackgroundCar'
import { MyCarActive } from '../../../components/Customer/MyCarActive'

import { useInfoUser } from '../../../hooks/useInfoUsers'
import LoaderComponent from '../../../components/Loader/Loader.component';
import { useIsFocused } from '@react-navigation/native';
import { Alert } from 'react-native';





export const HomeScreen = ({ navigation }) => {

  const { getUserInfo, getNotificaciones } = useInfoUser();
  const { carActive, user } = useSelector(state => state.user);
  const isFocused = useIsFocused()





  useEffect(() => {
    getUserInfo()
  }, [])

  useEffect(() => {
    if (isFocused) {

      getNotificaciones()
    }

  }, [isFocused])




  return (
    <View style={styles.body} >

      <MyCarActive navigation={navigation} />

      <BackgroundCar home={true} />

      <HStack
        justifyContent={'space-around'}
        alignItems={'center'}
        mb={'50px'}

      >
        {
          user?.role !== 'mechanic' && (<ButtonService
            label={'Servicios'}
            icono={require('../../../assets/images/home/servicios.png')}
            onPress={() => {

              navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.HOME_VALET, { lavado: false })
              // navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SERVICES_CATEGORIES)
            }}
            style={74}

          />)

        }

        <ButtonService
          label={'Refacciones'}
          icono={require('../../../assets/images/home/refaccion.png')}
          onPress={() => {

            if (!carActive) {
              Alert.alert(
                'Active un vehículo para ver los productos.',
                '¿Ir a Mis Autos?',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel',
                  },
                  {
                    text: 'Ir',
                    onPress: () => {
                      navigation.navigate(BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT, {
                      screen: CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_HOME,
                      params: { goTo: CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_CARS },
                    });

                    },
                  },
                ],
                { cancelable: true }
              );

            
              return
            }
            navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_REFACCIONES)

          }}
          style={85}
        />

        {
          user?.role !== 'mechanic' && (
            <ButtonService
              label={'Lavado'}
              icono={require('../../../assets/images/home/lavado.png')}
              onPress={() => {

                navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.HOME_VALET, { lavado: true })
              }}

            />)

        }

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