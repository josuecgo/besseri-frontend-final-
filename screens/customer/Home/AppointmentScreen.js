import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Box, Button, HStack, ScrollView, Text, Image } from 'native-base';
import { AgendaService } from '../../../components/Services/AgendaService';
import axios from 'axios';
import { base_url, customer_api_urls } from '../../../util/api/api_essentials';
import { getUserId } from '../../../util/local-storage/auth_service';
import moment from 'moment';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants';
import { deviceHeight, deviceWidth } from '../../../util/Dimentions';
import CommonStyles from '../../../util/styles/styles';
import Colors from '../../../util/styles/colors';


export const AppointmentScreen = (props) => {
  const { service, car, address,type } = props.route.params;
  const [daySelected, setDaySelected] = useState('');
  const [hourSelected, setHourSelected] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [citas, setCitas] = useState([])

  const handleCalendar = (data) => {
    setShowCalendar(data)
  }



  const citasDisponibles = async () => {

    try {
      setHourSelected(null)
      const url = `${customer_api_urls.get_availability_services}/${service._id}`
      
      const apiCall = await axios.post(url, { 
        date: daySelected, 
        timezone: "America/Mexico_City",
        scheduleId:service._id
      })

      
      if (apiCall.status != 200) {
        setCitas(null);
      } else {
        setCitas(apiCall.data);

      }

    } catch (error) {
      setHourSelected(null)
      showToaster(error?.response?.data?.message)
      

    }
  }


  const agendarCita = async () => {





    // try {

    const userId = await getUserId();
    if (!userId || !service._id || !service?.business_id._id || !hourSelected?.start || !hourSelected?.end) return showToaster('Faltan campos.')
    
    const date = new Date(hourSelected.start);
    // const date = moment(hourSelected.start).local()
    const startDate = moment(date).local();
    // const startDate = moment(date.toISOString());
    const date2  = new Date(hourSelected.end);
 

    const endDate = moment(date2).local()


    const data = {
      booked_by_id: userId,
      serviceId: service,
      businessId: service?.business_id._id,
      startDate: startDate,
      endDate: endDate,
      car,
      address,
      type
    }
    
   
    
    props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.AGENDAR, {
      data
    })


    // const apiCall = await axios.post(customer_api_urls.book_service,data)

    // if (apiCall.data.success) {
    //   showToaster(apiCall.data.message);
    //   props.navigation.replace(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)
    // }else{
    //   showToaster(apiCall.data.message);
    //   setCitas([]);
    //   setDaySelected('')
    //   setHourSelected(null)
    // }

    //   } catch (error) {


    //     showToaster('Error con el servidor')


    // }
  }


  const handleHour = (hour) => {

    setHourSelected(hour);
  }

  useEffect(() => {
    if (daySelected) {
      citasDisponibles()
    }

  }, [daySelected])

  console.log(daySelected);
  return (
    <ScrollView
      contentContainerStyle={styles.appointment}
      showsVerticalScrollIndicator={false}
    >

      <Box>

        <HStack justifyContent={'flex-end'} mb={'5px'} >
          <Text style={CommonStyles.h2} >10 km de tu ubicación </Text>
        </HStack>
        <Image
          source={{
            uri: `${base_url}/${service?.business_id.logo}`
          }}
          alt="image"
          rounded={'2xl'}
          // marginTop={3}
          resizeMode='stretch'
          style={styles.img}
        />

        <Box
          flexDirection={'row'}
          space={2}

          my={'10px'} >
          <Image
            source={require('../../../assets/images/13.png')}
            alt='dirrecion'
            style={styles.icon}
          />
          <Box maxWidth={295} flexWrap={'wrap'} flexDirection={'row'}>
            <Text style={CommonStyles.h3}>
              {service?.business_id?.location?.formatted_address}
            </Text>
          </Box>
        </Box>

        <Text style={CommonStyles.h1} >Disponibilidad</Text>
        <Box
          my={'2'}
        >

          <TouchableOpacity
            onPress={() => handleCalendar(true)}
          >
            <HStack space={4} alignItems={'center'} >
              <Text style={CommonStyles.h2} >
                Selecciona fecha
              </Text>
              <Image
                source={require('../../../assets/images/calendar.png')}
                alt="image"
                resizeMode='stretch'
                style={styles.icon}
              />
            </HStack>
          </TouchableOpacity>




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

          {
            daySelected ? (
              <Box
                justifyContent={'center'}
                borderWidth={'1px'}
                borderColor={Colors.white}
                rounded={'lg'}
                padding={5}
                alignItems={'center'}
              >
                <Text style={{ ...CommonStyles.h2 }} >
                  {/* {moment(daySelected).format('DD-MM-YYYY')} */}
                  {daySelected}
                </Text>
              </Box>


            ) : null
          }


        </Box>
        <Box
          my={'2'}
        >

          {
            daySelected && (
              <>

                <HStack space={4} alignItems={'center'} mb={4}>
                  <Text style={CommonStyles.h2} >
                    Selecciona hora
                  </Text>
                  <Image
                    source={require('../../../assets/images/reloj.png')}
                    alt="image"
                    resizeMode='stretch'
                    style={styles.icon}
                  />
                </HStack>


                <HStack
                  borderWidth={daySelected ? 1 : 0}
                  rounded={'2xl'}
                  style={{ flexWrap: 'wrap', justifyContent: 'space-around' }}
                  justifyContent={'center'}

                  borderColor={Colors.white}

                  padding={5}
                  alignItems={'center'}
                >
                  {

                    citas ? citas.map((item) => {
                      var fecha = new Date(item.start);
                      var hora = fecha.getHours();
                      var minutos = fecha.getMinutes();
                      var horaFormateada = hora.toString().padStart(2, "0");
                      var minutosFormateados = minutos.toString().padStart(2, "0");
                      
                      
                      console.log(item.status);
                    

                      return (
                        <TouchableOpacity
                          key={item.start}
                          style={[styles.hora, {
                            backgroundColor: item.status === 'off' ? 'gray' : hourSelected === item ? 'white' : '#404040'
                          }]}
                          disabled={item.status === 'off' ? true : false}
  
                          onPress={() => {
                            if (item.status === 'off') return
                            handleHour(item)
                          }}
                        >
                          <Text color={hourSelected === item ? 'black' : '#FFFFFF'} >
                            {horaFormateada + ":" + minutosFormateados}
                          </Text>
  
                        </TouchableOpacity>
                      )
                    }
                    ) : (
                      <Box
                        style={styles.noCitas}
                      >
                        <Text style={CommonStyles.h2}>
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

      <View style={{ height: 50 }} />
    </ScrollView>
  )
}



const styles = StyleSheet.create({

  appointment: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    paddingVertical: 20,
    backgroundColor: Colors.bgColor,
    minHeight: deviceHeight
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
  hora: {
    borderRadius: 100,
    backgroundColor: '#404040',

    marginVertical: 5,
    padding: 10,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',

  },
  img: {
    width: deviceWidth,
    height: deviceWidth * 0.55
  },
  noCitas: {
    margin: 5,
    padding: 10,
    width: '95%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',

  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 5
  }
})