import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState,useEffect, useContext } from 'react'
import { api_statuses, customer_api_urls } from '../../../util/api/api_essentials';
import { getUserId } from '../../../util/local-storage/auth_service';

import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants';
import axios from 'axios';
import { CheckIcon, Heading, Select, VStack } from 'native-base';
import { ServiceSkeleton } from '../../../components/Services/ServiceSkeleton';
import { ListServices } from '../../../components/Services/ListServices';
import { ProductContext } from '../../../util/context/Product/ProductContext';
import { MapCarDefault } from '../../../components/Customer/MapCarDefault';


export const MapServiceScreen = (props) => {
  const [addresses, setAddresses] = useState(null)
  const [defaultAddress, setDefaultAddress] = useState(null)
  const {type} = props.route.params;
  const [stores, setStores] = useState(null)
  const {carDefault} = useContext(ProductContext);
  
  
 

  const getAddresses = async() => {
    try {
       
        const userId = await getUserId();
        const apiCall = await axios.get(`${customer_api_urls.get_addresses}/${userId}`);
           
        
        if(apiCall?.data?.data.length <= 0) {
          Alert.alert('No tienes ninguna direccion', 'Crea una direccion', [
            {
              text: 'Cancelar',
              onPress: () => props.navigation.goBack(),
              style: 'cancel',
            },
            {text: 'Crear', onPress: () => props.navigation.navigate('Mi dirección')},
          ]);
        }else{
          setAddresses(apiCall.data.data);
          if (apiCall?.data?.data.length > 0) {
            setDefaultAddress(apiCall.data.data[0]._id)
          
          }else{
            setDefaultAddress(null)
          }
        }
        
        } catch(e) {
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 2')
        }
  }

  const getCars = async() => {
    if (!carDefault) {
      Alert.alert('No tienes ningun auto seleccionado', 'Crea una o selecciona un auto', [
        {
          text: 'Cancelar',
          onPress: () => props.navigation.goBack(),
          style: 'cancel',
        },
        {text: 'Crear', onPress: () => props.navigation.navigate('Garage')},
      ]);
    }
  }

  const getStoreService = async() => {
    try {
      
      const apiCall = await axios.post(`${customer_api_urls.get_stores_type_services}/${type}`,addresses);
     
      setStores(apiCall?.data?.data)
    } catch (error) {
      
      showToaster('Error con el servidor')
    }
  }

  const goService = (item) => {
    props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.APPOINTMENT_SERVICES,{
      service:item,
      address:defaultAddress,
      car:carDefault
    })
  }

  const changeCar = () => {
    props.navigation.navigate('Garage')
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
  }, [defaultAddress])
  
  
  
  if(!addresses) return <ServiceSkeleton/>


  
  return (
    <View style={styles.map} >
      <Select 
      selectedValue={defaultAddress} 
      defaultValue={defaultAddress} 
      minWidth="200" 
      accessibilityLabel="Elegir direccion" 
      placeholder={'Elegir direccion'} 
      _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} 
      mt={1} 
      onValueChange={itemValue => handleAddress(itemValue)}
      >
        {
           addresses.map((item) => (
            <Select.Item key={item._id} label={item.formatted_address} value={item._id} />
          ))
        }
         
         
      </Select>
      
      <MapCarDefault changeCar={changeCar}/>
      <VStack
      space={1}
      marginTop={10}
      >
      <Heading
      size="sm"
      textTransform={'uppercase'}
      >
        Talleres Automotriz
      </Heading>
      <Heading
      size="sm"
      >
        Disponibles según tu ubicación
      </Heading>
      </VStack>
     
      
      <ListServices services={stores} goService={goService} />
    </View>
  )
}



const styles = StyleSheet.create({
  map:{
    marginHorizontal:10
  }
})