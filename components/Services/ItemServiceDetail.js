import { StyleSheet } from 'react-native'
import React from 'react'
import { Box, HStack, Heading, Stack, Text, VStack } from 'native-base'
import { moneda } from '../../util/Moneda';
import CommonStyles from '../../util/styles/styles';
import { numberToKm } from '../../util/utility-functions';


export const ItemServiceDetail = ({service}) => {
  
  return (
    <Box alignItems="center">
    <Box 
    width={'100%'}
    rounded="lg" 
    overflow="hidden" 
    >

      <Stack p="4" space={3}>
      <Text style={CommonStyles.h1} >Descripción</Text>
        <Stack space={2}>
          <Heading style={CommonStyles.h2}>
            {service?.type_services?.name}
          </Heading>
          
          <Text style={CommonStyles.h2}>
           Servicio {service?.type_services?.type}.
          </Text>

          <Text style={CommonStyles.h2}>
            Precio {moneda(service?.price)}
          </Text>


          <Text style={CommonStyles.h2}>
          Servicio para autos tipo {service?.type_car?.type}
          </Text>
          <Text style={CommonStyles.h2}>
          Duración del servicio <Text fontWeight="bold" >{service?.duration / 60 == 0.5 ? `30 minutos` : `${service?.duration  / 60} hr` }.</Text>
          </Text>
        </Stack>



    
        
        
       
          {
            service?.type_services?.type != 'ESTETICA' && (
              <HStack justifyContent={'space-around'}>
              <VStack>
                <Text style={CommonStyles.h2} >Garantía</Text>
                
                <Text style={CommonStyles.h2}>&#8226; {service?.warranty?.tiempo} meses</Text>
                <Text style={CommonStyles.h2}>&#8226; {numberToKm(service?.warranty?.km) } kilometros</Text>
              </VStack>
              <VStack>
                <Text style={CommonStyles.h2}>Incluye</Text>
                {
                  service.consumables.map((item,i) => (
                    <Text key={i} style={CommonStyles.h2}>&#8226; {item} </Text>
                  ))
                }
              </VStack>
              </HStack>
            )
          }
         
        
       
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