import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { MyCarActive } from '../../../components/Customer/MyCarActive';
import { BackgroundCar } from '../../../components/Background/BackgroundCar';
import CommonStyles from '../../../util/styles/styles';
import { Box, Center, HStack, Heading, VStack } from 'native-base';
import Colors from '../../../util/styles/colors';
import AddressFormatted from '../../../components/AddressFormatted';
import { comisionFormatted, comisionMoneda, moneda } from '../../../util/Moneda';
import { deviceHeight, deviceWidth } from '../../../util/Dimentions';
import moment from 'moment';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants';
import axios from 'axios';
import { customer_api_urls } from '../../../util/api/api_essentials';
import ModalChildren from '../../../components/ModalChildren';
import { CardField, useConfirmPayment, useStripe } from '@stripe/stripe-react-native';
import { usePayment } from '../../../hooks/usePayment';
import { getUser } from '../../../util/local-storage/auth_service';
import { useContext } from 'react';
import { ProductContext } from '../../../util/context/Product/ProductContext';



export const AgendarScreen = (props) => {
  const {
    booked_by_id, serviceId,
    businessId, startDate,
    endDate, car, address,type
  } = props.route.params.data;
  const [showModal, setShowModal] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const {comision} = useContext(ProductContext)

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [stripeEssentials, setStripeEssentials] = useState(null);


  
  const fetchPaymentSheetParams = async () => {
    try {
      const customerData = await getUser();
      const data = {
        customerId: customerData?.customerId,
  
        walletId: "acct_1MpG6RIq5dapP1T4",
        amount:comisionFormatted(serviceId?.price,comision),

      }
  
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers you need
        },
      };
  
  
      const response = await axios.post(customer_api_urls?.create_payment_sheet_services, data, axiosConfig);
      const { paymentIntent, ephemeralKey, customer,publishableKey,intentId } = response.data;
      setStripeEssentials({ paymentIntent, ephemeralKey, customer,publishableKey,intentId })
      return {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey
      };
    } catch (error) {
      
      showToaster('Error de conexión')
    }

  };

  const initializePaymentSheet = async () => {
    try {
      const {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
      } = await fetchPaymentSheetParams();



      const { error } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,
        merchantDisplayName: 'Besseri',

      });


      console.log(error,'errorr');
      if (!error) {
        // Es solo para cargar el loading
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
      showToaster('No hay conexion en este momento')
    }
  };



  const openPaymentSheet = async () => {

    setFetchLoading(true)
    await initializePaymentSheet();



    const { error } = await presentPaymentSheet();

    if (error) {
      setFetchLoading(false)

      Alert.alert(`Error.Pago cancelado`);

    } else {
      agendarCita()
    }

  };




  const refundPayment = async () => {
    try {
        const apiCall = await axios.post(paymentApis?.refundPayment, {
            intentId: stripeEssentials?.intentId
        });
        setIsVisible(false);
        if (apiCall?.status == 200) {
            showToaster('Su cantidad ha sido reembolsada');
            return
        }
    } catch (e) {
        //  Alert.alert('Refund failed',JSON.stringify(e))
        setIsVisible(false);
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 5')
        // //console.log(e?.response?.data)
    }
  }
  

  const agendarCita = async () => {
    try {
      if (fetchLoading) {
        return
      }

     
      if (!booked_by_id) return showToaster('Faltan campos.');
    


      
      const customerData = await getUser();
      const data = {
        booked_by_id,
        serviceId,
        businessId,
        startDate,
        endDate,
        car,
        address: address._id,
        type,
        customerId: customerData?.customerId,
        chargeId: stripeEssentials?.intentId,
        amount: serviceId?.price,
        total_amount:comisionFormatted(serviceId?.price,comision),
        comision:comision
      }
    

     
      const apiCall = await axios.post(customer_api_urls.book_service, data)
      setFetchLoading(false)
      if (apiCall.data.success) {
        // showToaster(apiCall.data.message);
        setShowModal(true)
      } else {
        setFetchLoading(false)
        showToaster(apiCall.data.message);
      }

    } catch (error) {
      refundPayment()
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
          <Text style={{ ...CommonStyles.h2 }} >{
          comisionMoneda(serviceId?.price,comision)} MXN </Text>

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
        onPress={openPaymentSheet}
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
            <Text style={{...CommonStyles.h2,textTransform:'uppercase' }} >Reservación exitosa</Text>
          </Center>
          <Center mb={'30px'} >
            {
              serviceId?.is_home ? (
                <Text style={{...CommonStyles.h5,textTransform:'uppercase' }} >
                Pronto uno de nuestros lavadores estará en tu domicilio.
                Revisa en tu zona de pedidos 
              </Text>
              ): (
                <Text style={{...CommonStyles.h5,textTransform:'uppercase' }} >
                Pronto uno de nuestros valets recogerá tu vehículo.
                Revisa en tu zona de pedidos 
              </Text>
              )
            }
           
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