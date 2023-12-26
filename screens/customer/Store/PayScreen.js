import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { CardField, useConfirmPayment, useStripe } from '@stripe/stripe-react-native';
import { getUser } from '../../../util/local-storage/auth_service';
import axios from 'axios';
import { showToaster } from '../../../util/constants';
import { customer_api_urls, paymentApis } from '../../../util/api/api_essentials';

const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [stripeEssentials, setStripeEssentials] = useState(null);



  const fetchPaymentSheetParams = async () => {
    try {
      const customerData = await getUser();
      const data = {
        customerId: customerData?.customerId,
  
        walletId: "acct_1MpG6RIq5dapP1T4",
        amount: 1000,

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
      console.log(error,'errrorr');
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



      if (!error) {
        showToaster('Error, intente mas tarde')
      }
    } catch (error) {
      console.log(error);
      showToaster('No hay conexion en este momento')
    }
  };



  const openPaymentSheet = async () => {


    await initializePaymentSheet();



    const { error } = await presentPaymentSheet();

    if (error) {


      Alert.alert(`Error.Pago cancelado`);

    } else {
      placeServices()
    }

  };

  const placeServices = async () => {
    try {
        const body = {
            ordered_by_id: user?._id,
            products: order.products,
            storeId: order.storeId,
            total_amount: allCharges.totalAmount,
            delivery_address: order.address,
            ordered_on: new Date(),
            delivery_fee: allCharges?.delivery_charges,
            besseri_comission: allCharges?.besseri_commission,
            intentId: stripeEssentials?.intentId,
            cupon: order?.cupon,
            storePickup:!order.pickup
        }


        const apiCall = await axios.post(`${customer_api_urls.place_order}`, body);
        setLoading(false);

       
    } catch (e) {
      
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo 2 code: 4')
        refundPayment()
        setIsVisible(false)
    }


}


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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Selecciona tu método de pago:</Text>
      <Button
        variant="primary"
        
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </View>
  );
};

export default PaymentScreen;
