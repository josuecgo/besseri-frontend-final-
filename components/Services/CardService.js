import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { AspectRatio, Box,Center,HStack,Heading,Image,Stack,Text } from 'native-base'
import Colors from '../../util/styles/colors'
import { api_urls, base_url } from '../../util/api/api_essentials'
import CommonStyles from '../../util/styles/styles'

export const CardService = ({service}) => {
  
  return (
    <Box >
    <Box 
    // maxW="80" 
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
      <Stack p="4" space={3}>
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
       

        <HStack alignItems="flex-end" space={4} justifyContent="flex-end">
          <HStack alignItems="flex-end">
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