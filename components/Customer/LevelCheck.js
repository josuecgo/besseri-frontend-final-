import { View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { Box, Center, Divider, HStack, Heading, Text, VStack } from 'native-base';
import { moneda } from '../../util/Moneda';
import Colors from '../../util/styles/colors';
import { adjust } from '../../util/Dimentions';

export const LevelCheck = () => {
    const {  
        kmPerByDay, 
        totalKmTraveled,
        daysPassed,
        fuelTotal,
        amountTotal 
    } = useSelector(state => state.fuel);

  return (
    <Box 
    backgroundColor={'#171717'}
      borderTopLeftRadius={90} // Ajusta el radio según tu preferencia
      borderTopRightRadius={90} // Ajusta el radio según tu preferencia
    //   px={'7'} // Ajusta el padding según tu diseño
    //   py={5}
      overflow={'hidden'}
    
    >
        
        <Box backgroundColor={'white'} height={30} width={'100%'}  rounded={'full'} >
        <Text>{fuelTotal} lt</Text>
        </Box>

      <Box alignItems="center">
        <Box w="140">
           <Heading size={'xs'} alignItems="center"  flexDirection="row">
        {totalKmTraveled} km recorridos
        </Heading>
            <Divider my="2" _light={{
                bg: "muted.800"
            }} _dark={{
                bg: "muted.50"
            }} />
        <Heading size={'xs'} alignItems="center"  flexDirection="row">
          {moneda(amountTotal)} 
        </Heading> 
        </Box>
        
      </Box>


      <HStack space={4} justifyContent={'space-between'} >
        <VStack justifyContent={'center'} alignItems={'center'} >
            <Text>{fuelTotal} lt</Text>
            <Text color={Colors.placeholder} fontSize={adjust(10)} >Gasolina</Text>
        </VStack>
        
        <Text>{kmPerByDay} km/dia</Text>
        {/* <Text>{daysPassed} Dias</Text> */}
      </HStack>
    </Box>
  )
}

