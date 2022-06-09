import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { customer_api_urls } from '../util/api/api_essentials';
import { useStripe } from '@stripe/stripe-react-native';
import { getUser } from '../util/local-storage/auth_service';
import { useSelector } from 'react-redux';
import { showToaster } from '../util/constants';




export const useCompras = (props) => {
    const [isVisible, setIsVisible] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [allCharges, setallCharges] = useState({
        delivery_charges: props.delivery_fee,
        besseri_commission: props?.comission,
        totalAmount: props?.totalAmount,
        subtotal: props?.subtotal,
      });
     
    const totalSinEnvio = allCharges?.subtotal + allCharges?.besseri_commission;
    const cartProductIds = useSelector(state => state.cart.cart_items_ids);
    const [loading, setLoading] = useState(false);
    const products = props?.products;
    const business = props?.business;
   
  
    const [stripeEssentials, setStripeEssentials] = useState(null);

    const placeOrder = async (body) => {
     

        try {
          setLoading(true);
          
          const body = {
            ordered_by_id: user?._id,
            products: products,
            storeId: business?._id,
            total_amount: totalSinEnvio,
            ordered_on: new Date(),
            delivery_fee: 0,
            besseri_comission: allCharges?.besseri_commission,
            intentId: stripeEssentials?.intentId,
          };
    
          const apiCall = await axios.post(
            `${customer_api_urls.place_order}`,
            body,
          );
          setLoading(false);
          setIsVisible(false);
          if (apiCall.status == api_statuses.success) {
            // setOrderPlaced(true)
            for (var a = 0; a < products?.length; a++) {
              dispatch(deleteItemFromCart(products[a]?._id, products[a]?.price));
            }
            showToaster('Pedido realizado');
            props.navigation.navigate('OrderSuccessful', props.navigation);
          } else {
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 3');
          }
        } catch (e) {
          setLoading(false);
          console.log({ code4: e });
          setLoading(false);
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo 2 code: 4');
          refundPayment();
          setIsVisible(false);
        }
      };

    const refundPayment = async () => {
        try {
          const apiCall = await axios.post(paymentApis?.refundPayment, {
            intentId: stripeEssentials?.intentId,
          });
          if (apiCall?.status == 200) {
            showToaster('Su cantidad ha sido reembolsada');
            return;
          }
        } catch (e) {
          //  Alert.alert('Refund failed',JSON.stringify(e))
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 5');
          console.log(e?.response?.data);
        }
      };
    
      const fetchPaymentSheetParams = useCallback(
        async() => {
          try {
            const customerData = await getUser();
           
            const data = {
              customerId: customerData?.customerId,
              walletId: business?.wallet_id,
              amount:allCharges?.totalAmount,
              deliveryDistance: 0,
              productsIds: cartProductIds,
            };
      
            if (!business?.wallet_id) {
              showToaster(
                'La tienda aún no ha configurado la billetera, por lo que no es posible realizar un pedido desde esta tienda',
              );
              props.navigation.goBack();
              return;
            }
            const response = await axios.post(
              customer_api_urls?.create_payment_sheet,
              data,
            );
      
            const apiResponse = {
              paymentIntent: response?.data?.paymentIntent,
              ephemeralKey: response?.data?.ephemeralKey,
              customer: response?.data?.customer,
              publishableKey: response?.data?.publishableKey,
              intentId: response?.data?.intentId,
            };
            setStripeEssentials(apiResponse);
            
            return {
              paymentIntent: response?.data?.paymentIntent,
              ephemeralKey: response?.data?.ephemeralKey,
              customer: response?.data?.customer,
              publishableKey: response?.data?.publishableKey,
            };
          } catch (e) {
            console.log('line 183', e);
            showToaster('Algo salió mal, intenta de nuevo code: 6');
          }
          setIsVisible(false);
        },
        [],
      )
      
    
      
      const initializePaymentSheet = useCallback(
        async(walletId) => {
          try {
            const { paymentIntent, ephemeralKey, customer, publishableKey } =
            await fetchPaymentSheetParams(walletId);
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
              // console.log({initializePay:error})
            }
          } catch (error) {
            console.log({ init: error });
          }
        },
        [],
      )
      
    
      const openPaymentSheet = useCallback(
        async() => {
          setIsVisible(true);
    
          await initializePaymentSheet();
    
          if (!business) {
            showToaster('Aún no se ha obtenido el negocio, espere, por favor...');
            setIsVisible(false);
            return;
          }
          if (!products) {
            showToaster(
              'No se puede realizar el pedido cuando la cantidad de productos es cero :/',
            );
            setIsVisible(false);
            return;
          }
          
    
          const { error } = await presentPaymentSheet();
    
          if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
          } else {
            return true;
          }
        },
        [],
      )
    
    useEffect(async() => {
        await initializePaymentSheet();
    }, [])
    
    return {
        isVisible,
        setIsVisible,
        stripeEssentials,
        openPaymentSheet
    }
}
