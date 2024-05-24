import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { api_statuses, customer_api_urls } from '../../../util/api/api_essentials';
import { getUserId } from '../../../util/local-storage/auth_service';

import { BOTTOM_TAB_CUSTOMER_ROUTES, CUSTOMER_HOME_SCREEN_ROUTES, showAlertLogin, showToaster } from '../../../util/constants';
import axios from 'axios';
import { CheckIcon, HStack, Heading, Image, Select, VStack } from 'native-base';
import { ServiceSkeleton } from '../../../components/Services/ServiceSkeleton';
import { ListServices } from '../../../components/Services/ListServices';
import { ProductContext } from '../../../util/context/Product/ProductContext';
import { MapCarDefault } from '../../../components/Customer/MapCarDefault';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../../util/styles/colors';
import CommonStyles from '../../../util/styles/styles';
import { deviceWidth } from '../../../util/Dimentions';
import { MAIN_ROUTES } from '../../../util/constants';
import { useIsFocused } from '@react-navigation/native';
import LoaderComponent from '../../../components/Loader/Loader.component';
import { addAddressToUser, addDefaultAddressToUser } from '../../../util/ReduxStore/Actions/CustomerActions/UserInfoActions';



export const MapServiceScreen = (props) => {

  const { carActive,addresses,defaultAddress } = useSelector(state => state.user);
  const direccionStore = useSelector(state => state.user.addresses);
  const { type,isHome } = props.route.params;
  const [stores, setStores] = useState(null)
  const isFocus = useIsFocused()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();



  const getAddresses = async () => {
    try {
      setLoading(true)
      const userId = await getUserId();
      if (!userId) {
      
      if(direccionStore){
        const data = {
          _id:1,
          ...direccionStore[0]
        }
   
        dispatch(addAddressToUser([data]))
         
          
        dispatch( addDefaultAddressToUser(1) )
        return
      }
        showAlertLogin(goLogin,goCancel)
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
        dispatch(addAddressToUser(apiCall.data.data))
        if (apiCall?.data?.data.length > 0) {
          if (!defaultAddress) {
             dispatch( addDefaultAddressToUser(apiCall.data.data[0]._id) )
          }
         
         

        } else {
          dispatch( addDefaultAddressToUser(null) )
        
        
        }
      }

      setLoading(false)

    } catch (e) {
      setLoading(false)
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
      setLoading(true)
      
      if (!addresses) return
      
      const userId = await getUserId();
      const findAddress =   addresses.find(item => item?._id === defaultAddress  );
      
      
      
      const apiCall = await axios.post(`${customer_api_urls.get_stores_type_services}/${type}`, {
         addresses:findAddress, carActive,isHome 
        });
      
      setStores(apiCall?.data?.data)
     
      setLoading(false)
    } catch (error) {
      setLoading(false);
     
      showToaster('Error con el servidor');
    }
  }

  const goService = async(item) => {

    const userId = await getUserId();
    if (!userId) {
    
      showAlertLogin(goLogin, goCancel)
      return
    }
    const findAddres = addresses.find(item => item._id === defaultAddress)
    props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.DETAILS_SERVICES, {
      service: item,
      address: findAddres,
      car: carActive,
      type:'servicio'
    })
  }

  const changeCar = async() => {
    const id = await getUserId();
    if (!id) {
      
      showAlertLogin(goLogin,goCancel)
      return
    }
    props.navigation.navigate(BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT, { screen: CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_CARS })
  }

  const handleAddress = (address) => {

   
    dispatch( addDefaultAddressToUser(address) )
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
   
  }, [])

  useEffect(() => {
    if (defaultAddress) {
       getStoreService()
    }
   
    
  }, [defaultAddress, carActive])



  if (!addresses || loading ) return  <LoaderComponent isVisible={loading} />




  return (
    <View style={styles.map} >
      <HStack alignItems={'center'} justifyContent={'center'} >
        <Image
          source={require('../../../assets/images/30.png')}
          alt='direccion'
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
        marginTop={4}
      >
        <Text
        
          textTransform={'uppercase'}
          style={CommonStyles.h1}
        >
          Talleres Automotriz
        </Text>
        <Text
          
          style={CommonStyles.h2}
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