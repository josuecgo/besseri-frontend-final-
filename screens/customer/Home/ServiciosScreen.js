import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import axios from 'axios'
import {  customer_api_urls } from '../../../util/api/api_essentials'
import { useState } from 'react'
import { useEffect } from 'react'
import { TypeServices } from '../../../components/Services/TypeServices'
import { Heading, Pressable } from 'native-base'
import CommonStyles from '../../../util/styles/styles'

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
    
      <Text style={CommonStyles.h1} >Elegir servicio</Text>
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
      showsVerticalScrollIndicator={false}
      ListFooterComponent={() => <View style={{width:100,height:50}} />}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  servicios:{
    paddingHorizontal:10,
    ...CommonStyles.screenY
  }
})