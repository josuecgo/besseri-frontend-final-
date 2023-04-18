import {  StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Box, Button, HStack, Heading, ScrollView, Text,Pressable } from 'native-base';
import { AgendaService } from '../../../components/Services/AgendaService';
import axios from 'axios';
import { customer_api_urls } from '../../../util/api/api_essentials';
import { getUserId } from '../../../util/local-storage/auth_service';
import moment from 'moment';
import { dateToHour } from '../../../util/utility-functions';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants';
import { ItemServiceDetail } from '../../../components/Services/ItemServiceDetail';


export const AppointmentScreen = (props) => {
  const { service } = props.route.params;
  const [daySelected, setDaySelected] = useState('');
  const [hourSelected, setHourSelected] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [citas, setCitas] = useState([])

  const handleCalendar = (data) => {
    setShowCalendar(data)
  }

  
  const citasDisponibles = async() => {
    
    try {
      setHourSelected(null)
      const url = `${customer_api_urls.get_availability_services}/${service._id}`
      const apiCall = await axios.post(url,{date:daySelected})

      if (apiCall.data.data.length <= 0) {
        setCitas(null);
      }else{
        setCitas(apiCall.data.data);
        
      }
      
    } catch (error) {
      setHourSelected(null)
      showToaster('Error con el servidor')
      
    }
  }


  const agendarCita = async() => {
    try {
      const userId = await getUserId();
      if(!userId || !service._id  || !service?.business_id._id || !hourSelected?.start || !hourSelected?.end) return showToaster('Faltan campos.')
   
      const startDate = new Date(hourSelected.start).toISOString()
      const endDate  = new Date(hourSelected.end).toISOString()
      const data = {
        booked_by_id:userId,
        serviceId:service,
        businessId: service?.business_id._id,
        startDate,
        endDate,
      }
      const apiCall = await axios.post(customer_api_urls.book_service,data)
     
      if (apiCall.data.success) {
        showToaster(apiCall.data.message);
        props.navigation.replace(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)
      }else{
        showToaster(apiCall.data.message);
        setCitas([]);
        setDaySelected('')
        setHourSelected(null)
      }

      } catch (error) {
      
        showToaster('Error con el servidor')
     
      
    }
  }
  

  const handleHour = (hour) => {
   
    setHourSelected(hour);
  }

  useEffect(() => {
    if (daySelected) {
      citasDisponibles()
    }
    
  }, [daySelected])
  
  
  return (
    <ScrollView
      contentContainerStyle={styles.appointment}
    >

      <Box>

      <ItemServiceDetail service={service} />
     

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
        
      {
        daySelected  && (
          <>
            <Text fontSize="xs"
            fontWeight="500" mt="-1">
            Selecciona hora
            </Text>
            
            <HStack
            borderWidth={daySelected ? 1 : 0}
            rounded={'2xl'}
            style={{flexWrap:'wrap',justifyContent:'space-around'}}
            >
              {

                citas ? citas.map((item) => (
                  <TouchableOpacity 
                  key={item.start}
                  style={[styles.hora,{
                    backgroundColor:item.status === 'off' ? 'gray' : hourSelected === item ? 'white' : '#404040'
                  }]}
                  disabled={item.status === 'off' ? true : false}
                
                  onPress={()=> {
                    if (item.status === 'off') return
                    handleHour(item)
                  }}
                  >
                    <Text color={hourSelected === item ? 'black' : '#FFFFFF'} >
                      {dateToHour(item.start) } 
                    </Text>
                    
                  </TouchableOpacity>
                )) : (
                  <Box
                  style={styles.noCitas}
                  >
                    <Text fontSize="xs"
                    fontWeight="500" mt="-1">
                    No hay citas disponibles.
                    </Text>
                  </Box>
                  
                )
              }
            </HStack>
          </>
        )
      }

      
        
        

      </Box>
      </Box>

      <Button
      onPress={agendarCita}
      size={'lg'}
      backgroundColor={'#5B7CF4'}
      >
        Agendar
      </Button>
    </ScrollView>
  )
}



const styles = StyleSheet.create({
  appointment: {
    margin: 10,
    justifyContent:'space-between',
    flex:1
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
    
    marginVertical:5,
    padding:10,
    width:60,
    height:60,
    alignItems:'center',
    justifyContent:'center',
    
  },
  noCitas:{
    margin:5,
    padding:10,
    width:'95%',
    height:60,
    alignItems:'center',
    justifyContent:'center',
    
  }
})