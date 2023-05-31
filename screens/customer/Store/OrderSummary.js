import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import CommonStyles from '../../../util/styles/styles'
import { Box, Button, HStack, Text, VStack } from 'native-base'
import AddressFormatted from '../../../components/AddressFormatted'
import Colors from '../../../util/styles/colors'
import { moneda } from '../../../util/Moneda'
import { ProductosPago } from '../../../components/Customer/ProductosPago'
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../util/local-storage/auth_service';
import axios from 'axios';
import { api_statuses, customer_api_urls, paymentApis } from '../../../util/api/api_essentials';
import { showToaster } from '../../../util/constants';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import { useEffect } from 'react'



export const OrderSummary = (props) => {
  const order = props?.route?.params;
  const {initPaymentSheet,presentPaymentSheet} = useStripe();
  const [stripeEssentials,setStripeEssentials] = useState(null);
  const [allCharges, setallCharges] = useState({
    delivery_charges: order.delivery_fee,
    besseri_commission: order?.comission,
    totalAmount: Number(order?.totalAmount),
    subtotal: order?.subtotal,
    descuento: order?.descuento,
    comision: order?.comision,

  })
  const [isVisible, setIsVisible] = useState(false)
  const cartProduct = useSelector(state => state.cart);
  const placeOrder = async() => {
        
    if (!stripeEssentials?.intentId) {
        await initializePaymentSheet()
        setIsVisible(false);
    }
    
    try {
        setLoading(true);
        const body = {
        ordered_by_id:user?._id,
        products:products,
        storeId:business?._id,
        total_amount:totalAmount,
        delivery_address:deliveryAddress,
        ordered_on:new Date(),
        delivery_fee:allCharges?.delivery_charges,
        besseri_comission:allCharges?.besseri_commission,
        intentId:stripeEssentials?.intentId,
        cupon: params?.cupon
        }
        
    
     const apiCall = await axios.post(`${customer_api_urls.place_order}`,body);
     setLoading(false);
     
     if(apiCall.status == api_statuses.success) {
        // setOrderPlaced(true)
        for (var a=0;a<products?.length;a++) {
            dispatch(deleteItemFromCart(products[a]?._id,products[a]?.price))
        }
        showToaster('Pedido realizado');
        props.navigation.navigate('OrderSuccessful',props.navigation)
        setIsVisible(false) 
     } else {
         showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 3')
         setIsVisible(false);
     }
    } catch(e) 
    { 
        setLoading(false);
        console.log({code4:e});
        setLoading(false);  
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo 2 code: 4')
        refundPayment()
        setIsVisible(false)
    }
   
      
}



const refundPayment = async() => {
     try {
      const apiCall = await axios.post(paymentApis?.refundPayment,{
        intentId:stripeEssentials?.intentId
      });
      setIsVisible(false);
      if(apiCall?.status == 200) {
          showToaster('Su cantidad ha sido reembolsada');
          return
      }
     } catch(e) {
        //  Alert.alert('Refund failed',JSON.stringify(e))
        setIsVisible(false);
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 5')
        // console.log(e?.response?.data)
     }
}


const fetchPaymentSheetParams = async (walletId) => {
    let ids = [];

    cartProduct?.cart_items.map((item) => {
      
      for (let index = 0; index < item.quantity; index++) {
        // console.log(item._id)
        ids.push(item._id);
      }
    })
   try {
    const customerData = await getUser();
    
    const data = {
        customerId:customerData?.customerId,
        walletId:business?.wallet_id,
        amount:totalAmount,
        deliveryDistance:distancia,
        productsIds:ids,
        cupon:desc
    }
    
    if(!business?.wallet_id) {
        showToaster('La tienda aún no ha configurado la billetera, por lo que no es posible realizar un pedido desde esta tienda');
        props.navigation.goBack()
        return;
    }
    const response = await axios.post(customer_api_urls?.create_payment_sheet,data); 
   
    const apiResponse = {
        paymentIntent:response?.data?.paymentIntent,
        ephemeralKey:response?.data?.ephemeralKey,
        customer:response?.data?.customer,
        publishableKey:response?.data?.publishableKey,
        intentId:response?.data?.intentId
    }

    console.log({apiResponse});
    setStripeEssentials(apiResponse)
    setIsVisible(false);
    return {
        paymentIntent:response?.data?.paymentIntent,
        ephemeralKey:response?.data?.ephemeralKey,
        customer:response?.data?.customer,
        publishableKey:response?.data?.publishableKey
    };
   } catch(e) {
    //    console.log('line 183',e)

       showToaster('Algo salió mal, intenta de nuevo code: 6')
   }
   setIsVisible(false);
};


const initializePaymentSheet = async (walletId) => {
    
    
    try {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
          } = await fetchPaymentSheetParams(walletId);
        const { error } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,
        merchantDisplayName:'Besseri'
        });

        if (!error) {
        console.log({initializePay:error})
        }
    } catch (error) {
        console.log({init:error});
    }
    
};

  const openPaymentSheet = async () => {
    setIsVisible(true);
    
        await initializePaymentSheet();
        if(!order.address) {
            showToaster('Por favor, seleccione la dirección de entrega');
            setIsVisible(false);
            return;
        }
        if(!order?.business) {
            showToaster('Aún no se ha obtenido el negocio, espere, por favor...');
            setIsVisible(false);
            return;
        }
        if(!order.products) {
            showToaster('No se puede realizar el pedido cuando la cantidad de productos es cero :/');
            setIsVisible(false);
            return;
        }
        if (!stripeEssentials) {
            showToaster('Intente de otra vez');
            setIsVisible(false);
            return;
        }

        
        const { error } = await presentPaymentSheet();
        
        if (error) {
            
            setIsVisible(false);
            Alert.alert(`Error code: ${error.code}`, error.message);
          
        } else {
          placeOrder()
        }
   
};


useEffect(async() => {
 
   await initializePaymentSheet()
  
},[]);
  return (
    <View style={styles.container} >
      <ScrollView>
        


       
      </ScrollView>

    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    ...CommonStyles.screenY,
    // paddingHorizontal:10
  }
})