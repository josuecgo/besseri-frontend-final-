import { View } from 'react-native'
import React from 'react'
import { Box, HStack, Text, VStack } from 'native-base'
import { deviceWidth } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';
import { showToaster } from '../../util/constants';
import CommonStyles from '../../util/styles/styles';

export const ProductosPago = ({productos}) => {




  
   
      

  return (
    <VStack
    space={6}
    mb={'15px'}
    >
     
     {productos.map((item,i) => {  
      return(
        <HStack 
        justifyContent={'space-between'}
        key={i}
        >
            <Box w={'50%'} >
              <Text style={CommonStyles.h2} isTruncated >{item?.name}</Text>
            </Box>
            <Box>
              <Text style={CommonStyles.h2} isTruncated>{moneda(item?.precio)}</Text>
            </Box>
   
        </HStack>
      )
      
      })}
    </VStack>
  )
}

 