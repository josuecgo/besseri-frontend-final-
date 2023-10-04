import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { MyCarActive } from '../../../components/Customer/MyCarActive';
import { deviceHeight, deviceWidth } from '../../../util/Dimentions';
import Colors from '../../../util/styles/colors';
import { Box, Center,  Image } from 'native-base';

import CardServicio from '../../../components/Detalle/CardServicio';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants';
import CardServiceAdditional from '../../../components/Detalle/CardServiceAdditional';
import { useContext } from 'react';
import { ProductContext } from '../../../util/context/Product/ProductContext';
import { useCompras } from '../../../hooks/useCompras';
import LoaderComponent from '../../../components/Loader/Loader.component';

export const DetalleScreen = ({ route,navigation }) => {
  const [data, setData] = useState(route.params)
  const {comision} = useContext(ProductContext)
  const { buyAdditional,loading } = useCompras()
 
  const goSeguimiento = () => {
    // 
    let status;
    switch (data.type) {
      case 'refaccion':
        status = {
          status : data.order_status,
          status_code : data.order_status_code,
          type:data.type
        }
        break;       
      default:
        status = {
          status : data.status,
          status_code : data.status_code,
          type:data.type
        }
        break;
    }
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SEGUIMIENTO,status )
  }

  const aceptedAdditional = async(item,status) => {
    const title = status === 'RECHAZADO' ? 'Rechazar' : 'Aceptar';
    const description = status === 'RECHAZADO' ? 'Estas a punto de rechazar un servicio adicional' : 'Estas a punto de aceptar un servicio adicional';

    Alert.alert(title, description, [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'Aceptar', onPress: async() => {
        const result = await buyAdditional({
          additional:item,
          status
        })
    
        if (!result) {
          
          return
        }
        navigation.goBack()
    
      }},
  ]);
   
   

   
    // setData(result)

  }


  return (
    <ScrollView contentContainerStyle={styles.container} >
      <LoaderComponent isVisible={loading} /> 
      <MyCarActive />
      <Center>
        <Image
          source={require('../../../assets/images/car_home.png')}
          alt='car'
          style={styles.img}
        />
      </Center>

      <Box rounded={'lg'} borderWidth={'1px'} borderColor={Colors.white} padding={'10px'}>
        <CardServicio data={data} comision={comision} />
      </Box>
     
      <CardServiceAdditional data={data} comision={comision} aceptedAdditional={aceptedAdditional} />
    

      <BtnPrincipal 
      text={'Ver seguimiento'}
      onPress={goSeguimiento} 
      backgroundColor={Colors.seguimiento} 
      />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: deviceHeight,
    backgroundColor: Colors.bgColor,
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  img: {
    height: deviceWidth * 0.45,
    width: deviceWidth * 0.70,
    resizeMode: 'cover'
  },
 
})