import { StyleSheet } from 'react-native'
import React from 'react'
import { Box, Heading, ScrollView, Text } from 'native-base';

export const AppointmentScreen = (props) => {
  const { service } = props.route.params
  console.log(service.availability);
  return (
    <ScrollView
      contentContainerStyle={styles.appointment}
    >

      <Heading size="md" >
        {service?.type_services?.name}
      </Heading>
      <Text fontSize="xs"
        fontWeight="500" mt="-1">
        {service?.type_services?.type}.
      </Text>

      <Heading
        size="sm"
        textTransform={'uppercase'}
        marginY={'4'}
        >
          disponibilidad
      </Heading>
      <Box
      my={'2'}
      >
        
        <Text fontSize="xs"
        fontWeight="500" mt="-1">
        Selecciona fecha
        </Text>


      </Box>
    </ScrollView>
  )
}



const styles = StyleSheet.create({
  appointment: {
    margin: 10,

  }
})