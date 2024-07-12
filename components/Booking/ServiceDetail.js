import {  StyleSheet } from 'react-native'
import React from 'react'
import { Box, Center, Heading, HStack,  Image,  Text, VStack } from 'native-base'

import { comisionFormatted,  moneda } from '../../util/Moneda';
import Colors from '../../util/styles/colors';
import { adjust, deviceHeight } from '../../util/Dimentions';

import moment from 'moment';
import AddressFormatted from '../AddressFormatted';


export const ServiceDetail = ({ booking, comision }) => {
  const service = booking.serviceId;
  const { businessId, address, car, startDate } = booking;
   
  
  const amount = comisionFormatted(service?.price, comision)
  const total = booking?.pieceCost + amount
  
  return (

    <Box alignItems="center" >
      <Box
        width={'100%'}
        overflow="hidden"

      >
        {/* <Box paddingX={3} py={1} >
          <Text style={styles.car} >{car?.maker?.name} {car?.model?.name} - {car?.type?.type}</Text>
        </Box> */}

        <Center>
          <Image
            source={require('../../assets/images/car_home.png')}
            alt='car'
            style={styles.img}
            resizeMode='contain'
          />
        </Center>


        <Box borderWidth={1} borderColor={Colors.white} rounded={'lg'} paddingX={3} py={1}>

          <VStack space={1} >
            <Heading size={'md'} >{businessId.storeName}</Heading>
            <AddressFormatted address={address?.formatted_address} location={{ latitude: address.latitude, longitude: address.longitude }} />
            <Box>
              <Text fontWeight={'bold'} >Dia: {moment(startDate).add(1, 'hour').format('LL')} </Text>
              <Text fontWeight={'bold'} >Hora: {moment(startDate).add(1, 'hour').format('HH:mm')} </Text>
            </Box>
            <HStack justifyContent={'space-between'} >
              <Text bold textTransform={'uppercase'} >{service?.type_services?.name}</Text>
              <Text>{moneda(amount)}</Text>
            </HStack>


            {
              booking?.pieceCost > 0 && (
                <>

                  <HStack justifyContent={'space-between'} >
                    <Text bold >Refacción</Text>
                    <Text>{moneda(booking?.pieceCost)}</Text>
                  </HStack>
                  <HStack justifyContent={'space-between'} >
                    <Text bold >Total</Text>
                    <Text>{moneda(total)}</Text>
                  </HStack>
                </>
              )
            }
          </VStack>
        </Box>


      



      </Box>
    </Box>



  )
}



const styles = StyleSheet.create({
  car: {
    fontSize: adjust(16),
    fontWeight: 'bold',
  },
  img: {
    width: deviceHeight * 0.3,
    height: deviceHeight * 0.3
  }
})