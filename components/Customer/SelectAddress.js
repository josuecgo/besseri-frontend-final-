import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Box, Button, Icon, InfoOutlineIcon, Input } from 'native-base'

import { deviceWidth } from '../../util/Dimentions'

export const SelectAddress = ({address}) => {
  return (
    <View style={styles.body} >
      <Text>Mi direccion:</Text>
     
      <Box 
      maxW={deviceWidth * 0.9} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" 
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
      
      <Input 
      placeholder="Telefono" 
      variant="filled" 
      width="100%" 
      borderRadius="10" 
      py="1" 
      px="2" 
      InputLeftElement={<InfoOutlineIcon/>}
      />
      <Button>Guardar direccion</Button>
    </View>
  )
}


const styles = StyleSheet.create({
  body:{
    
    marginHorizontal:10
  }
})