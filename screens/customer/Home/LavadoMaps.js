import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { CheckIcon, HStack, Image, Select, Text, VStack } from 'native-base'
import { MapCarDefault } from '../../../components/Customer/MapCarDefault'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { ServiceSkeleton } from '../../../components/Services/ServiceSkeleton'
import { customer_api_urls } from '../../../util/api/api_essentials'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { getUserId } from '../../../util/local-storage/auth_service'
import axios from 'axios'
import { deviceWidth } from '../../../util/Dimentions'
import Colors from '../../../util/styles/colors'
import CommonStyles from '../../../util/styles/styles'
import { ListServices } from '../../../components/Services/ListServices'

export const LavadoMaps = (props) => {

  const [addresses, setAddresses] = useState(null)

  const { carActive, address } = useSelector(state => state.user)

  const [stores, setStores] = useState(null)
  const [defaultAddress, setDefaultAddress] = useState(address)


  const getAddresses = async () => {
    try {

      const userId = await getUserId();
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

  const getStoreService = async () => {
    try {

      const apiCall = await axios.post(`${customer_api_urls.get_carwash}`, 
      { 
        addresses, 
        carActive 
      }
      );

      
      setStores(apiCall?.data?.data)
    } catch (error) {

      showToaster('Error con el servidor')
    }
  }

  const goService = (item) => {

    const findAddres = addresses.find(item => item?._id === defaultAddress);

    props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.DETAILS_SERVICES, {
      service: item,
      address: findAddres,
      car: carActive,
      type:'lavado'
    })
  }

  const changeCar = () => {

    props.navigation.navigate(BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT, { screen: CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_CARS })
  }

  const handleAddress = (address) => {

    setDefaultAddress(address)
  }



  useEffect(() => {
    getAddresses()
    getCars();
  }, [])

  useEffect(() => {
    if (addresses) {
      getStoreService()
    }
  }, [defaultAddress, carActive])



  if (!addresses) return <ServiceSkeleton />

  return (
    <View style={styles.map} >
    
      <HStack alignItems={'center'} justifyContent={'center'} >
        <Image
          source={require('../../../assets/images/30.png')}
          alt='dirrecion'
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
          Talleres Automotriz
        </Text>
        <Text
          
          style={CommonStyles.h3}
        >
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