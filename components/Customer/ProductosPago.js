import { View } from 'react-native'
import React from 'react'
import { Box, HStack, Text, VStack } from 'native-base'
import { deviceWidth } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';
import { showToaster } from '../../util/constants';
import CommonStyles from '../../util/styles/styles';

export const ProductosPago = ({productos,totalAmount}) => {




  return (
    <VStack
    space={6}
    mt={'5px'}
    >
     
     {/* {productos.map((item,i) => {  
      console.log(item.name);
      
      return(
        <HStack 
        justifyContent={'space-between'}
        key={i}
        >
            <Box w={'55%'} >
              <Text style={CommonStyles.h2} isTruncated >{item.name}</Text>
            </Box>
           
            <Box>
              <Text style={CommonStyles.h2} isTruncated>{moneda(item?.precio)}</Text>
            </Box>
          
   
        </HStack>
      )
      
      })} */}

  <HStack 
        justifyContent={'space-between'}
       
        >
            <Box w={'55%'} >
              <Text style={CommonStyles.h2} isTruncated >Total a pagar</Text>
            </Box>
           
            <Box>
              <Text style={CommonStyles.h2} isTruncated>{moneda(totalAmount)}</Text>
            </Box>
          
   
        </HStack>

    </VStack>
  )
}

 