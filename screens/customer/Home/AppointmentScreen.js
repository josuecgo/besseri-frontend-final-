import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Box, Button, HStack, Heading, ScrollView, Text } from 'native-base';
import { AgendaService } from '../../../components/Services/AgendaService';
import axios from 'axios';
import { customer_api_urls } from '../../../util/api/api_essentials';
import moment from 'moment';

export const AppointmentScreen = (props) => {
  const { service } = props.route.params;
  const [daySelected, setDaySelected] = useState('')
  const [showCalendar, setShowCalendar] = useState(false);
  const [citas, setCitas] = useState([])

  const handleCalendar = (data) => {
    setShowCalendar(data)
  }


  const citasDisponibles = async() => {
    
    try {
      const url = `${customer_api_urls.get_availability_services}/${service._id}`
      const apiCall = await axios.post(url,{date:daySelected})

      
      setCitas(apiCall.data.data)
    } catch (error) {
      console.log("🚀 ~ file: AppointmentScreen.js:26 ~ citasDisponibles ~ error:", error)
      
    }
  }
  

  console.log(citas);

  useEffect(() => {
    if (daySelected) {
      citasDisponibles()
    }
    
  }, [daySelected])
  
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
        <Button
        variant={'ghost'}
        onPress={() => handleCalendar(true)}
        >{daySelected ? daySelected : 'Elige una fecha'}</Button>

        {
          showCalendar && (
            <AgendaService 
            daySelected={daySelected}
            setDaySelected={setDaySelected}
            handleCalendar={handleCalendar}
            showCalendar={showCalendar}
            />
          )
        }
        

      </Box>
      <Box
      my={'2'}
      >
        
        <Text fontSize="xs"
        fontWeight="500" mt="-1">
        Selecciona hora
        </Text>
        
        <HStack
        borderWidth={1}
        rounded={'lg'}
        >
          {
            citas.map((item) => (
              <View 
              key={item.start}
              style={styles.hora}
              // rounded={'lg'}
              // bg={'#404040'}
              // borderRadius={100}
              // padding={5}
              >
                <Text color={'white'} >{item.start}</Text>
              </View>
            ))
          }
        </HStack>
        
        

      </Box>
    </ScrollView>
  )
}



const styles = StyleSheet.create({
  appointment: {
    margin: 10,

  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  hora:{
    borderRadius:100,
    backgroundColor:'#404040',
    margin:5,
    padding:10,
    width:60,
    height:60,
    alignItems:'center',
    justifyContent:'center'
  }
})