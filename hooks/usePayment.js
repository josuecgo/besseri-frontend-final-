import { useCallback, useContext, useEffect, useState } from 'react';
import { getUser } from '../util/local-storage/auth_service';
import axios from 'axios';
import { customer_api_urls } from '../util/api/api_essentials';
import { showToaster } from '../util/constants';
import { Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';




export const usePayment = () => {

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [stripeEssentials, setStripeEssentials] = useState(null);
  
  

    const fetchPaymentSheetParams = async (value) => {
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
       
        showToaster('Error de conexión')
      }
  
    };
  
    const initializePaymentSheet = async (data) => {
      try {
        const {
          paymentIntent,
          ephemeralKey,
          customer,
          publishableKey,
        } = await fetchPaymentSheetParams(data);
  
  
  
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
  
  
  
    const openPaymentSheet = async (data) => {
  
  
      await initializePaymentSheet(data);
  
  
  
      const { error } = await presentPaymentSheet();
  
      return error
      if (error) {
  
  
        Alert.alert(`Error.Pago cancelado`);
  
      } else {
        placeServices(data)
      }
  
    };
  
    const placeServices = async (data) => {
      try {
        // const data = {
        //     booked_by_id,
        //     serviceId,
        //     businessId,
        //     startDate,
        //     endDate,
        //     car,
        //     address: address._id,
        //     type
        //   }
          
       
          const apiCall = await axios.post(customer_api_urls.book_service, data)
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
  


    



    return {
        // initializePaymentSheet,
        openPaymentSheet,
        placeServices
    }
}