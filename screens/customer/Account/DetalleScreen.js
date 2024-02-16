import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { MyCarActive } from '../../../components/Customer/MyCarActive';
import { deviceHeight, deviceWidth } from '../../../util/Dimentions';
import Colors from '../../../util/styles/colors';
import { Box, Center,  HStack,  Image } from 'native-base';

import CardServicio from '../../../components/Detalle/CardServicio';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import { CUSTOMER_HOME_SCREEN_ROUTES, MAIN_ROUTES } from '../../../util/constants';
import CardServiceAdditional from '../../../components/Detalle/CardServiceAdditional';
import { useContext } from 'react';
import { ProductContext } from '../../../util/context/Product/ProductContext';
import { useCompras } from '../../../hooks/useCompras';
import LoaderComponent from '../../../components/Loader/Loader.component';
import { customer_api_urls } from '../../../util/api/api_essentials';
import axios from 'axios';
import { useEffect } from 'react';

export const DetalleScreen = ({ route,navigation }) => {
  const [data, setData] = useState(route.params)
  const {comision} = useContext(ProductContext)
  const { buyAdditional,loading } = useCompras()
  const [reception, setReception] = useState(null)



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


  const receptionViewCar = async () => {
    try {
      if (data.type === 'refaccion') return
      
      const apiCall = await axios.get(`${customer_api_urls.get_car_reception}/${data._id}`);


      if (apiCall?.data?.success) {
        setReception(apiCall.data?.data)
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    receptionViewCar()
  }, [])
  

  
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
      {
                reception && (
                  <HStack mt={2}  alignItems={'center'} justifyContent={'center'} >
                    
                      <Box alignItems={'center'} p={2} w={'50%'} backgroundColor={Colors.white}  rounded={'lg'} justifyContent={'center'} >
                      <Pressable
                     onPress={() => navigation.navigate(MAIN_ROUTES.VIEW_RECEPTION_CAR,{reception,car:data?.car})}
                    >
                        <Image
                        source={require('../../../assets/images/hoja.png')}
                        alt='img'
                        style={{
                          width:60,height:40
                        }}
                        resizeMode='contain'
                        />
                         </Pressable>
                      </Box>
                   
                    
                  </HStack>
                  
                )
              }

      <BtnPrincipal 
      text={'Ver seguimiento'}
      onPress={goSeguimiento} 
      backgroundColor={Colors.seguimiento} 
      />


{
          data?.car &&  data?.type !== 'refaccion' && (
            <BtnPrincipal text={'Ver Diagnostico'}
              onPress={() => navigation.navigate(MAIN_ROUTES.VIEW_DIAGNOSTIC_CAR, data?.car)}
              marginHorizontal={10}
            />
          )
        }
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