import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import axios from 'axios'
import {  customer_api_urls } from '../../../util/api/api_essentials'
import { useState } from 'react'
import { useEffect } from 'react'
import { TypeServices } from '../../../components/Services/TypeServices'
import { Heading, Pressable } from 'native-base'

export const ServiciosScreen = ({navigation}) => {
  const [servicios, setServicios] = useState([]);


  const getServicios = async() => {
    try {
       
      const apiCall = await axios.get(customer_api_urls.get_type_services);

      setServicios(apiCall?.data.data.existServices);

    } catch (error) {
      
      showToaster('No hay conexion')
    }
  }

  const goMapServices = async(type) => {
   
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.MAP_SERVICES,{type})
  }

  useEffect(() => {
    getServicios()
  }, [])
  
  

  return (
    <View style={styles.servicios} >
    
      <Heading>Elegir servicio</Heading>
      <FlatList
      data={servicios}
      renderItem={({item}) => (
        <Pressable
        onPress={() => goMapServices(item._id)}
        >
          <TypeServices service={item}  />
        </Pressable>
      )}
      keyExtractor={(item) => item._id}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  servicios:{
    marginHorizontal:10
  }
})