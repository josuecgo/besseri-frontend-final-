import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Box, Center, HStack, Heading, Stack, Text, VStack } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { moneda } from '../../util/Moneda';
import moment from 'moment';
import { dateToHour } from '../../util/utility-functions';
import { useContext } from 'react';
import { ProductContext } from '../../util/context/Product/ProductContext';

export const BookingDetails = ({ booking }) => {
  const service = booking.serviceId;
  const {comision} = useContext(ProductContext);


  return (
    <Box alignItems="center">
      <Box
        width={'100%'}
        overflow="hidden"
      >

        <Stack p="4" space={3}>
          <Stack space={2}>
            <HStack justifyContent={'space-between'} alignItems={'center'} >
              <Heading size="md" ml="-1">
                {service?.type_services?.name}
              </Heading>
              <Heading size="xs" ml="-1">
                {booking?.status}
              </Heading>
            </HStack>


            <Text fontSize="xs"
              fontWeight="500" ml="-0.5" mt="-1">
              {service?.type_services?.type}.
            </Text>

            <Text color="coolGray.600" _dark={{
              color: "warmGray.200"
            }} fontWeight="700">
              {moneda(service?.price + comision)}
            </Text>
            <Text fontWeight={'bold'} >Dia: {moment(booking.startDate).format('LL') } </Text>
            <Text fontWeight={'bold'} >Hora: {dateToHour(booking.startDate)} </Text>
          

            <Text fontSize="xs"
              fontWeight="500" ml="-0.5" mt="-1">
              Servicio para autos tipo {service?.type_car?.type}.
            </Text>
            <Text fontSize="xs"
              fontWeight="500" ml="-0.5" mt="-1">
              Duración del servicio <Text fontWeight="bold" >{service?.duration / 60} horas.</Text>
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


          <HStack justifyContent={'space-around'}>
            <VStack>
              <Text>Garantía</Text>

              <Text fontSize="xs"
                fontWeight="500">Meses: {service.warranty.tiempo}</Text>
              <Text fontSize="xs"
                fontWeight="500" >Kilometros: {service.warranty.km}</Text>
            </VStack>
            <VStack>
              <Text>Incluye</Text>
              {
                service.consumables.map((item, i) => (
                  <Text fontSize="xs"
                    fontWeight="500" key={i} >{item} </Text>
                ))
              }
            </VStack>
          </HStack>

        </Stack>
        <Center>
        <Text>Código de seguridad</Text>
          <Text fontSize="lg" fontWeight="bold">{booking.delivery_security_code}</Text>
        </Center>
        
      </Box>
    </Box>
  )
}


const styles = StyleSheet.create({})