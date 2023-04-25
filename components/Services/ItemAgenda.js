import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Box, HStack, Heading, Pressable, Stack, Text, VStack } from 'native-base';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { adjust } from '../../util/Dimentions';
import { dateToHour } from '../../util/utility-functions';
import moment from 'moment';

export const ItemAgenda = ({ service,goBooking }) => {

  const { serviceId } = service;
  
  
  return (
    <Box alignItems="center" my={2} >
      <Pressable
      onPress={() => goBooking(service)}
      >
        <Box
        maxW="95%"
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700"
        }} _web={{
          shadow: 2,
          borderWidth: 0
        }} _light={{
          backgroundColor: "gray.50"
        }}
      >

        <Stack px="5" py="3" space={2}>


          <HStack justifyContent={'space-between'} alignItems={'center'} >
            <View style={styles.bg_title} >
              <Heading style={styles.title} >
                {serviceId.type_services.name}
              </Heading>
            </View>

            <Text style={styles.plan} >{serviceId.type_services.type}</Text>
          </HStack>



          <HStack
            justifyContent="center"
            // alignItems={'center'}
            space={2}
          >
            <MaterialIcons
              name="explore"
              color='black'
              size={30}
            />
            <Text>
              {service.businessId.location?.formatted_address}
            </Text>
          </HStack>

          <VStack>
         
            <Text fontWeight={'bold'} >Dia: {moment(service?.startDate).format('LL') } </Text>
            <Text fontWeight={'bold'} >Hora: {moment(service?.startDate).format('HH:mm')} </Text>
          </VStack>



          <HStack
            alignItems="flex-end"
            space={2}
            justifyContent="flex-end"

          >
            <HStack
              alignItems="flex-end"
              backgroundColor={'#0AF159'}
              rounded="lg"
              px='5'
              py='1'
            >
              <Text color="white"
                fontWeight="500">
                {service.status}
              </Text>
            </HStack>
          </HStack>
        </Stack>
      </Box>
      </Pressable>
      
    </Box>

  )
}


const styles = StyleSheet.create({
  agenda: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    padding: 10,
    overflow: 'hidden',

  },
  bg_title: {
    backgroundColor: 'black',
    borderRadius: 7,
    paddingVertical: 2,
    paddingHorizontal: 30
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: adjust(15)
  },
  plan: {
    fontWeight: 'bold',
    fontSize: adjust(15)
  }
})