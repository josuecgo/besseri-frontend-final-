import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { MyCarActive } from '../../../components/Customer/MyCarActive';
import { BackgroundCar } from '../../../components/Background/BackgroundCar';
import CommonStyles from '../../../util/styles/styles';
import { Box, Center, HStack, Heading, VStack } from 'native-base';
import Colors from '../../../util/styles/colors';
import AddressFormatted from '../../../components/AddressFormatted';
import { moneda } from '../../../util/Moneda';
import { deviceHeight, deviceWidth } from '../../../util/Dimentions';
import moment from 'moment';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import { showToaster } from '../../../util/constants';
import axios from 'axios';
import { customer_api_urls } from '../../../util/api/api_essentials';
import ModalChildren from '../../../components/ModalChildren';

export const AgendarScreen = (props) => {
  const {
    booked_by_id, serviceId,
    businessId, startDate,
    endDate, car, address,type
  } = props.route.params.data;
  const [showModal, setShowModal] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  
  
  const agendarCita = async () => {
    try {
      if (fetchLoading) {
        return
      }
      if (!booked_by_id) return showToaster('Faltan campos.');
      setFetchLoading(true)
      const data = {
        booked_by_id,
        serviceId,
        businessId,
        startDate,
        endDate,
        car,
        address: address._id,
        type
      }
      const apiCall = await axios.post(customer_api_urls.book_service, data)
      setFetchLoading(false)
      if (apiCall.data.success) {
        // showToaster(apiCall.data.message);
        setShowModal(true)
      } else {
        showToaster(apiCall.data.message);
      }

    } catch (error) {
      setFetchLoading(false)
      
      showToaster('Error con el servidor')


    }
  }


  return (
    <ScrollView contentContainerStyle={styles.container} >
      <Text>AgendarScreen</Text>
      <MyCarActive />
      <BackgroundCar bottom={0} />
      <Text style={{ ...CommonStyles.h1 }} >Detalle</Text>
      <Box
        borderWidth={'1px'}
        borderColor={Colors.white}
        rounded={'lg'}
        paddingY={'1.5'}
        paddingX={'10px'}
      >
        <AddressFormatted address={serviceId?.business_id?.location?.formatted_address} />

        <VStack space={4} mt={'10px'} >
          <Text style={{ ...CommonStyles.h2 }} >Dia: {moment(startDate).format('LLLL')}</Text>
          <Text style={{ ...CommonStyles.h2 }} >Hora: </Text>
        </VStack>

        <HStack justifyContent={'space-between'} mt={'10px'} flexWrap={'wrap'} >
          <Text style={{ ...CommonStyles.h2 }} >Servicio: {serviceId?.type_services?.type} </Text>
          <Text style={{ ...CommonStyles.h2 }} >{moneda(serviceId?.price)} MXN </Text>

        </HStack>
      </Box>

      <Heading size="xs" marginY="3" color={Colors.white}>Dirección</Heading>
      <Box
        rounded={'lg'}
        borderColor={Colors.lightBorder}
        backgroundColor={Colors.lightBlack}
        paddingX={3}
        paddingY={2}
        mb="3"
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Text style={{ color: Colors.white }} >{address?.formatted_address}</Text>
      </Box>

      <BtnPrincipal
        text={ fetchLoading ? 'Enviando...' : 'Reservar'}
        marginHorizontal={0}
        onPress={agendarCita}
      />

      <ModalChildren
      showModal={showModal}
      handleModal={() => {
        setShowModal(false)
        props.navigation.replace('Splash')
      }}
      >
        <Box backgroundColor={Colors.bgColor} rounded={'md'} padding={5} m={5} >
          <Center mb={'30px'} >
            <Text style={{...CommonStyles.h2,textTransform:'uppercase' }} >Reservacion exitosa</Text>
          </Center>
          <Center mb={'30px'} >
            <Text style={{...CommonStyles.h5,textTransform:'uppercase' }} >Pronto uno de nuestros valets recogera tu vehiculo.
              Revisa en tu zona de pedidos 
            </Text>
          </Center>
          <BtnPrincipal
          text={'Aceptar'}
          onPress={() =>  {
            setShowModal(false)
            props.navigation.replace('Splash')
          }}
          />
        </Box>

       
      </ModalChildren>

    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgColor,
    paddingHorizontal: 15,
    minHeight: deviceHeight,

  }
})