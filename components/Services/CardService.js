import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { AspectRatio, Box,Center,HStack,Heading,Image,Stack,Text, VStack } from 'native-base'
import Colors from '../../util/styles/colors'
import {  base_url } from '../../util/api/api_essentials'
import CommonStyles from '../../util/styles/styles'
import { comisionMoneda, moneda } from '../../util/Moneda'
import { ItemServiceDetail } from './ItemServiceDetail'
import { AirbnbRating } from 'react-native-ratings'
import { adjust } from '../../util/Dimentions'

export const CardService = ({service,comision}) => {

  
  return (
    <Box >
    <Box 
    my={'5px'} 
    rounded="2xl" 
    overflow="hidden" 
    borderColor="coolGray.200" 
    borderWidth="0.5px" 
    _dark={{
    borderColor: Colors.white,
    backgroundColor: Colors.bgColor
    }} 
    _light={{
      borderColor: Colors.white,
      backgroundColor: Colors.bgColor
    }}
    >
      <Box alignItems="center" rounded={'2xl'}  overflow="hidden" >
        <AspectRatio w="90%" ratio={20/9} rounded={'lg'} >
          <Image 
          source={{
            uri: `${base_url}/${service?.business_id.logo}`
          }} 
          alt="image" 
          rounded={'2xl'}
          marginTop={3}
          />
        </AspectRatio>
  
      </Box>
      <Stack p="4" >
        <HStack justifyContent={'space-between'} >
          {/* <VStack> */}
              <Text>{service?.business_id?.storeName}</Text>
              <HStack alignItems={'center'} >
              <AirbnbRating
              showRating={false}
              count={5}
              defaultRating={service?.business_id?.averageRating}
              size={10}
              isDisabled
              />
              <Text fontSize={adjust(9)} color={Colors.placeholder} >({service?.business_id?.numberOfRatings})</Text>
              </HStack>
          {/* </VStack> */}
            
        </HStack>
        <HStack space={2} alignItems={'center'} >
        <Image 
          source={require('../../assets/images/13.png')} 
          alt="image" 
          style={{width:20,height:20}}
          resizeMode='contain'
          />
          <Heading 
          size="md" 
          style={CommonStyles.h3}
          isTruncated
          >
          {service?.business_id?.location?.formatted_address}
          </Heading>
        
        </HStack>
        
        <Text style={CommonStyles.h2} >
          Tipo de {service?.type_services.type === 'ESTETICA' ? 'Lavado' : 'Servicio'} 
          {service?.type_services?.name}
        </Text>

        <HStack  space={4} justifyContent="space-between">
       
            <Text 
           
            style={CommonStyles.h2}
            
            >
              {comisionMoneda(service?.price , comision)} MXN
            </Text>


            
          <HStack>
           
            <Text 
            color={Colors.white} _dark={{
            color: Colors.white

            }} 
            style={CommonStyles.h3}
            fontWeight="400"
            >
              10 km de tu ubicación 
            </Text>
          </HStack>
        </HStack>
        
     
      </Stack>
    </Box>
  </Box>
  )
}

 
const styles = StyleSheet.create({})