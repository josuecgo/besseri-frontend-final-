import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Box, Button } from 'native-base'

import { deviceWidth } from '../../util/Dimentions'
import { api_statuses, customer_api_urls } from '../../util/api/api_essentials'
import { getUserId } from '../../util/local-storage/auth_service'
import axios from 'axios'
import { showToaster } from '../../util/constants'

export const SelectAddress = ({address,navigation}) => {
  const {label,phone,latitude,longitude,address_components,formatted_address,place_id} = address;

  const setUpLocation = async() => {
    try {
     
      
      const userId = await getUserId();
     
      const apiCall = await axios.post(customer_api_urls.create_address,{
          latitude:latitude,
          longitude:longitude,
          address_components,
          formatted_address,
          place_id,
          userId,
      });
      
     
      navigation.pop();
  
    } catch(e) {
      
      
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
    //  console.log(e?.response?.data)
    }
  }
  return (
    <View style={styles.body} >
      <Text>Mi direccion:</Text>
     
      <Box 
      maxW={deviceWidth * 0.9} 
      rounded="lg" 
      overflow="hidden" 
      borderColor="coolGray.200" 
      borderWidth="1" 
      padding={2}
      marginBottom={5}
      _dark={{
      borderColor: "coolGray.600",
      backgroundColor: "gray.700"
      }}
      _light={{
        backgroundColor: "gray.50"
      }}
      >
        <Text style={{textAlign:'center'}} >{address.formatted_address}</Text>
      </Box>


      
      
      <Button size={'lg'} onPress={setUpLocation} >Guardar direccion</Button>
    </View>
  )
}


const styles = StyleSheet.create({
  body:{
    
    margin:10,
   
  }
})