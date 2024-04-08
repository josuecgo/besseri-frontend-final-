import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { Box, Center, Divider, Flex, HStack, Heading, Text, VStack } from 'native-base';
import { formatNumberWithCommas, moneda } from '../../util/Moneda';
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
       px={'1'}
    >

      <Flex direction="row" style={styles.contentItems}  >
        
        <VStack style={styles.item}  >
          <Text style={styles.title} >{fuelTotal} L</Text>
          <Text style={styles.subtitle} >Consumo</Text>
        </VStack>


        <VStack style={styles.item} >
          <Text style={styles.title} >{moneda(amountTotal)} </Text>
          <Text style={styles.subtitle} >Gasolina</Text>
        </VStack>

        <VStack style={styles.item} >
          <Text style={styles.title} >{formatNumberWithCommas(kmPerByDay) ?? ''}</Text>
          <Text style={styles.subtitle} >km/día</Text>
        </VStack>


        <VStack style={styles.item} >
          <Text style={styles.title}>{formatNumberWithCommas(totalKmTraveled)}</Text>
          <Text style={styles.subtitle}>
            Distancia
          </Text>
        </VStack>

      </Flex>


      <Divider my="2" 
      bg="warmGray.600"
      />


    </Box>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: adjust(12),
    fontWeight:'bold',
  },
  subtitle:{
    fontSize: adjust(12),
    textTransform:'uppercase',
    fontWeight:'bold',
    // marginBottom:-5,
    color:'#888B90',
   
  },
  contentItems: {
    justifyContent:'space-between',
    alignItems:'center'
  },
  item:{
    // borderWidth:1,
    borderColor:Colors.white,
    borderRadius:10,
    overflow:'hidden',
    padding:7,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column-reverse'
  }
})