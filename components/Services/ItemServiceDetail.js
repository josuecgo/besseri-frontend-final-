import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Box, HStack, Heading, Stack, Text } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { moneda } from '../../util/Moneda';


export const ItemServiceDetail = ({service}) => {
  // console.log( service)
  return (
    <Box alignItems="center">
    <Box 
    width={'100%'}
    rounded="lg" 
    overflow="hidden" 
    borderColor="coolGray.200" 
    borderWidth="1" 
    _light={{
      backgroundColor: "gray.50"
    }}>

      <Stack p="4" space={3}>
        <Stack space={2}>
          <Heading size="md" ml="-1">
            {service?.type_services?.name}
          </Heading>
          
          <Text fontSize="xs" 
          fontWeight="500" ml="-0.5" mt="-1">
            {service?.type_services?.type}.
          </Text>

          <Text color="coolGray.600" _dark={{
              color: "warmGray.200"
            }} fontWeight="700">
               {moneda(service?.price)}
          </Text>


          <Text fontSize="xs" 
          fontWeight="500" ml="-0.5" mt="-1">
          Servicio para autos tipo {service?.type_car?.type}.
          </Text>
        </Stack>
        <HStack justifyContent={'space-between'} >
          <MaterialIcons
            name="explore"
            color='black' 
            
            size={25}
          />
          <Text fontWeight="400">
             {service.business_id.location.formatted_address}
          </Text>
        </HStack>
        <HStack 
        alignItems="center" 
        space={4} 
        justifyContent="space-between"
        >
          
          
        </HStack>
      </Stack>
    </Box>
  </Box>
  )
}



const styles = StyleSheet.create({
  detail:{
    borderWidth:1,
    borderRadius:7,
    padding:10
  }
})