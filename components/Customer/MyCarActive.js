import {  View } from 'react-native'
import React from 'react'
import { HStack, Heading, Image, VStack } from 'native-base'
import Colors from '../../util/styles/colors'
import {  useSelector } from 'react-redux'

import { base_url } from '../../util/api/api_essentials'

export const MyCarActive = () => {
  const {carActive} = useSelector(state => state.user);
  
 
  

  return (
    <View style={{top:-10}} >
      <HStack alignItems={'center'} space={2} mx={2} >

        {
          carActive ? (
            <>
            <Image
            source={{uri: `${base_url}/${carActive?.maker.photo}` }}
            alt='marca'
            style={{height:60,width:60}}
            resizeMode='contain'
            />
            <Heading size={'sm'} color={Colors.white} >{carActive?.maker?.name} {carActive?.model?.name}</Heading>
    
            </>
          ):(
            <VStack justifyContent={'center'} alignItems={'center'} width={'100%'} >
            
            </VStack>
          )
        }

      </HStack>
    </View>
  )
}

 
