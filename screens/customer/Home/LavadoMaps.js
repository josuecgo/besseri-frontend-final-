import { Alert, StyleSheet, View } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { CheckIcon, HStack, Image, Select, Text, VStack } from 'native-base'
import { MapCarDefault } from '../../../components/Customer/MapCarDefault'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { ServiceSkeleton } from '../../../components/Services/ServiceSkeleton'
import { customer_api_urls } from '../../../util/api/api_essentials'
import { BOTTOM_TAB_CUSTOMER_ROUTES, CUSTOMER_HOME_SCREEN_ROUTES, MAIN_ROUTES, showAlertLogin, showToaster } from '../../../util/constants'
import { getUserId } from '../../../util/local-storage/auth_service'
import axios from 'axios'
import { deviceWidth } from '../../../util/Dimentions'
import Colors from '../../../util/styles/colors'
import CommonStyles from '../../../util/styles/styles'
import { ListServices } from '../../../components/Services/ListServices'
import { useIsFocused } from '@react-navigation/native'
import LoaderComponent from '../../../components/Loader/Loader.component'

export const LavadoMaps = (props) => {
  const isHome = props.route.params
  const [addresses, setAddresses] = useState(null)
  const isFocus = useIsFocused()
  const { carActive, address } = useSelector(state => state.user)
  const [isLoading, setIsLoading] = useState(false)
  const [stores, setStores] = useState(null)
  const [defaultAddress, setDefaultAddress] = useState(address)
  const direccionStore = useSelector(state => state.user.addresses);

  const getAddresses = async () => {
    try {

      const userId = await getUserId();
      if (!userId) {
        if(direccionStore){
       

          const arreglo = [
            {
              _id:1,
              ...direccionStore[0]
            }
          ];
        setAddresses(arreglo);
        setDefaultAddress(1)
          return
        }
        showAlertLogin(goLogin, goCancel)
        return
      }
      const apiCall = await axios.get(`${customer_api_urls.get_addresses}/${userId}`);


      if (apiCall?.data?.data.length <= 0) {
        Alert.alert('No tienes ninguna direccion', 'Crea una direccion', [
          {
            text: 'Cancelar',
            onPress: () => props.navigation.goBack(),
            style: 'cancel',
          },
          { text: 'Crear', onPress: () => props.navigation.navigate('Mi dirección') },
        ]);
      } else {
        setAddresses(apiCall.data.data);
        if (apiCall?.data?.data.length > 0) {
          setDefaultAddress(apiCall.data.data[0]._id)

        } else {
          setDefaultAddress(null)
        }
      }

    } catch (e) {
      console.log(e);
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 2')
    }
  }

  const getCars = async () => {

    if (!carActive) {
      Alert.alert('No tienes ningun auto seleccionado', 'Crea una o selecciona un auto', [
        {
          text: 'Cancelar',
          onPress: () => props.navigation.goBack(),
          style: 'cancel',
        },
        { text: 'Crear', onPress: () => changeCar() },
      ]);
    }
  }

  // console.log(addresses[0]);
  const getStoreService = async () => {
    try {

      if (!addresses) return
      setIsLoading(true)
      const userId = await getUserId();
      const findAddres =  userId ? addresses.find(item => item?._id === defaultAddress  ) : addresses[0] ;
      
      const apiCall = await axios.post(`${customer_api_urls.get_carwash}`,
        {
          addresses:findAddres,
          carActive,
          isHome
        }
      );


      setStores(apiCall?.data?.data);
      setIsLoading(false)
    } catch (error) {
   
      setIsLoading(false)
      showToaster('Error con el servidor')
    }
  }
  
  const goService = async(item) => {

    const userId = await getUserId();
    if (!userId) {
     
      showAlertLogin(goLogin, goCancel)
      return
    }
   
    const findAddres = addresses.find(item => item?._id === defaultAddress);

    props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.DETAILS_SERVICES, {
      service: item,
      address: findAddres,
      car: carActive,
      type: 'lavado'
    })
  }

  const changeCar = () => {

    props.navigation.navigate(BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT, { screen: CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_CARS })
  }

  const handleAddress = (address) => {

    setDefaultAddress(address)
  }

  const goLogin = () => {
    props.navigation.navigate(MAIN_ROUTES.AUTH_STACK)

  }

  const goCancel = () => {
    props.navigation.goBack()
  }



  useEffect(() => {
    if (isFocus) {
      getAddresses()
      getCars();
    }

  }, [isFocus])

  useEffect(() => {
    if (addresses) {
      getStoreService()
    }
  }, [defaultAddress, carActive])



  if (!addresses) return <ServiceSkeleton />

  return (
    <View style={styles.map} >
      <LoaderComponent isVisible={isLoading} /> 
      <HStack alignItems={'center'} justifyContent={'center'} >
        <Image
          source={require('../../../assets/images/30.png')}
          alt='dirección'
          style={styles.icon}
        />
        <Select
          selectedValue={defaultAddress}
          defaultValue={defaultAddress}
          minWidth={deviceWidth - 50}
          accessibilityLabel="Elegir direccion"
          placeholder={'Elegir direccion'}
          placeholderTextColor={Colors.white}
          variant='unstyled'
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }}
          mt={1}
          onValueChange={itemValue => handleAddress(itemValue)}
          borderColor={Colors.bgColor}
          color={Colors.white}
          backgroundColor={Colors.bgColor}
        >
          {
            addresses.map((item) => (
              <Select.Item key={item._id} label={item.formatted_address} value={item._id} />
            ))
          }


        </Select>
      </HStack>


      <MapCarDefault changeCar={changeCar} />
      <VStack
        space={1}
      >
        <Text

          textTransform={'uppercase'}
          style={CommonStyles.h2}
        >
          Lavados Automotriz
        </Text>
        <Text style={CommonStyles.h3}>
          Disponibles según tu ubicación
        </Text>
      </VStack>

      <ListServices services={stores} goService={goService} />
    </View>
  )
}


const styles = StyleSheet.create({
  map: {
    ...CommonStyles.screenY,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain'
  }
})