import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { MyCarActive } from '../../../components/Customer/MyCarActive';
import { BackgroundCar } from '../../../components/Background/BackgroundCar';
import CommonStyles from '../../../util/styles/styles';
import { Box, Center, HStack, Heading, VStack } from 'native-base';
import Colors from '../../../util/styles/colors';
import AddressFormatted from '../../../components/AddressFormatted';
import { aplicarDescuento, comisionFormatted, comisionMoneda, moneda } from '../../../util/Moneda';
import { deviceHeight, deviceWidth } from '../../../util/Dimentions';
import moment from 'moment';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants';
import axios from 'axios';
import { customer_api_urls, vendor_api_urls } from '../../../util/api/api_essentials';
import ModalChildren from '../../../components/ModalChildren';
import { CardField, useConfirmPayment, useStripe } from '@stripe/stripe-react-native';
import { usePayment } from '../../../hooks/usePayment';
import { getUser, getUserId } from '../../../util/local-storage/auth_service';
import { useContext } from 'react';
import { ProductContext } from '../../../util/context/Product/ProductContext';
import { Cupon } from '../../../components/Customer/Cupon';
import { useCompras } from '../../../hooks/useCompras';



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
  const [coupon, setCoupon] = useState({
    discount:0
  })
  const total = comisionFormatted(serviceId?.price,comision)
  


  const fetchPaymentSheetParams = async () => {
    try {
      const customerData = await getUser();
      let amount = aplicarDescuento(total,coupon.discount)
      const data = {
        customerId: customerData?.customerId,
  
        walletId: "acct_1MpG6RIq5dapP1T4",
        amount:amount,

      }
  
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers you need
        },
      };
      
     
      
      const response = await axios.post(customer_api_urls?.create_payment_sheet_services, data, axiosConfig);
     
      const { paymentIntent, ephemeralKey, customer,publishableKey,intentId } = response?.data;
      setStripeEssentials({ paymentIntent, ephemeralKey, customer,publishableKey,intentId })
      return {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey
      };
    } catch (error) {
      
      showToaster('Error de conexión')

      return false
    }

  };

  const initializePaymentSheet = async () => {
    try {
      // const {
      //   paymentIntent,
      //   ephemeralKey,
      //   customer,
      //   publishableKey,
      // } = await fetchPaymentSheetParams();
      const data = await fetchPaymentSheetParams();
      if (!data) {
        return
      }
      const {
          paymentIntent,
          ephemeralKey,
          customer,
          publishableKey,
        } = data

      const { error } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        merchantDisplayName: 'Besseri',

      });


      
      if (!error) {
        // Es solo para cargar el loading
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
      showToaster('No hay conexion en este momento');
      setLoading(false);
      setFetchLoading(false)
    }
  };



  const openPaymentSheet = async () => {
   
    if (coupon.discount === 100) { 
      freeAgendarCita()
    
      return
    }
    setFetchLoading(true)
    await initializePaymentSheet();



    const { error } = await presentPaymentSheet();

    if (error) {
      setFetchLoading(false)
      
      Alert.alert(`Pago cancelado`);

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
        comision:comision,
        coupon
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

  const freeAgendarCita = async () => {
    try {
      
      if (fetchLoading) return
      

      setFetchLoading(true)
     
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
        // total_amount:aplicarDescuento(total,coupon?.discount),
        total_amount:comisionFormatted(serviceId?.price,comision),
        comision:comision,
        coupon
      }
    

     
      const apiCall = await axios.post(customer_api_urls.book_service, data)
      setFetchLoading(false)
      if (apiCall.data.success) {
        aplicarPromotion(coupon)
        // showToaster(apiCall.data.message);
        setShowModal(true)
      } else {
        setFetchLoading(false)
        showToaster(apiCall.data.message);
      }
     
    } catch (error) {
      
      setFetchLoading(false)
      
      showToaster('Error con el servidor')


    }
  }

 

  const aplicarPromotion = async (coupon) => {
    try {
       
        const id = await getUserId();
       

        const data = {
            code: coupon?.code,
            serviceId: serviceId._id
        };

        const apiCall = await axios.post(`${vendor_api_urls.aplicar_promotion_besser}/${id}`, data);

        console.log(apiCall.data?.data);
       
    } catch (error) {
        console.log(error, 'aplicar promotion');
       
    } 
};


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
          {/* <Text style={{ ...CommonStyles.h2 }} >Hora: </Text> */}
        </VStack>

        <HStack justifyContent={'space-between'} mt={'10px'} flexWrap={'wrap'} >
          <Text style={{ ...CommonStyles.h2 }} >Servicio: {serviceId?.type_services?.type} </Text>
          <Text style={{ ...CommonStyles.h2 }} >${
          aplicarDescuento(total,coupon?.discount)} MXN </Text>

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

      <Cupon setCoupon={setCoupon} serviceId={serviceId._id} />

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