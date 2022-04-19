import React, { useEffect, useRef, useState } from 'react';
import {Text, TouchableOpacity, View,StyleSheet, FlatList, ScrollView, Alert} from 'react-native';
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo'
import CommonStyles from '../../util/styles/styles';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import ButtonComponent from '../../components/button/button.component';
import { AddressesListingModal, ThinlineSeparator } from '../../components/CommonComponents';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../util/local-storage/auth_service';
import axios from 'axios';
import { api_statuses, customer_api_urls, paymentApis, vendor_api_urls } from '../../util/api/api_essentials';
import { showToaster } from '../../util/constants';
import LoaderComponent from '../../components/Loader/Loader.component';
import { Modalize } from 'react-native-modalize';
import AddressComponent from '../../components/customer-components/customer.addresscard.component';
import {CUSTOMER_HOME_SCREEN_ROUTES} from '../../util/constants';
import { useStripe } from '@stripe/stripe-react-native';
import { StackActions, useRoute } from '@react-navigation/native';
import { deleteItemFromCart, removeItemFromCart } from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useCostos } from '../../hooks/useCostos';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';
import { BackgroundImage } from '../../components/Background/BackgroundImage';




const CustomerOrderSummary = (props) => {
    const {params} = useRoute();
    const {initPaymentSheet,presentPaymentSheet} = useStripe();
    const [isOrderPlaced,setOrderPlaced] = useState(false);
    const addressListingRef = useRef(null);
    const cartProductIds = useSelector(state => state.cart.cart_items_ids);
    const dispatch = useDispatch();
    const products = params?.products;
    const business = params?.business;
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(false);
    const [addresses,setAddresses] = useState([]);
    const [stripeEssentials,setStripeEssentials] = useState(null);
    const {costoEnvio,CalcularDistancia,distancia } =   useCostos()
    const costoK = params.delivery_fee
   
    const [allCharges,setallCharges] = useState({
        delivery_charges:params.delivery_fee,
        besseri_commission:params?.comission,
        totalAmount:params?.totalAmount,
        subtotal:params?.subtotal
    })
    
    const subTotal = totalAmount - (allCharges?.delivery_charges + allCharges?.besseri_commission);
    const [deliveryAddress,setDeliveryAddress] = useState(null);
    const [deliveryDistance,setDeliveryDistance] = useState(0)
    const totalAmount = allCharges?.subtotal  + allCharges?.besseri_commission + costoEnvio;



    // console.log({subtotal:allCharges?.subtotal  , comision: allCharges?.besseri_commission , costoEnvio});

    useEffect(() => {
        CalcularDistancia(business?.location?.longitude,business?.location?.latitude,deliveryAddress?.longitude,deliveryAddress?.latitude,costoK)
        setDeliveryDistance(distancia)
        
    }, [deliveryAddress])
    
    
   
    const handleModalize = async(flag) => {
        if(flag == 'open') {
            addressListingRef?.current?.open()
        } else {
            
            
            await CalcularDistancia(business?.location?.longitude,business?.location?.latitude,deliveryAddress?.longitude,deliveryAddress?.latitude)
            setDeliveryDistance(distancia)
            addressListingRef?.current?.close();

        }
    }

    // useEffect(() => {
    //    if(deliveryAddress) {
    //     initializePaymentSheet()
    //    }
    // },[deliveryDistance]);

    const getUserDetails = async() => {
        setLoading(true);
        const userData = await getUser();
        setUser(userData);
        setLoading(false);
    }
    useEffect(() => {
        getUserDetails();
    },[]);
    // const getBusinessDetails = async(id) => {
    //     try {
    //         setLoading(true);
    //      const apiCall = await axios.get(`${customer_api_urls.get_business_details}/${id}`);
    //      setLoading(false);
    //      if(apiCall.status == api_statuses.success) {
    //        setBusiness(apiCall.data.data);
    //        initializePaymentSheet(apiCall?.data?.data?.store?.wallet_id)
    //      } else {
    //          showToaster('Something went wrong please try again');
    //      }
    //     }catch(e) {
    //         setLoading(false);
    //        showToaster('Something went wrong please try again later')
    //     }
    // }
    // useEffect(() => {
    //     initializePaymentSheet(business?.wallet_id)
    // },[]);
  
   
    const DetailItem = ({label,value}) => {
        return (
            <View style={{width:'100%',height:60,borderBottomWidth:label == 'Total Charges' ? 0 : 0.3,borderColor:Colors.dark,flexDirection:'row',justifyContent:'space-between',alignItems:'center',alignSelf:'center'}}>
                <Text style={{...CommonStyles.fontFamily,fontSize:16}}>{label}</Text>
                <Text style={{fontSize:16}}>{value}</Text>
            </View>
        )
    }
    const getAddresses = async() => {
        try {
            setLoading(true);
         const apiCall = await axios.get(`${customer_api_urls.get_addresses}/${user?._id}`);
         setLoading(false);
         if(apiCall.status == api_statuses.success) {
             setAddresses(apiCall.data.data);
         } else {
             showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
         }
        } catch(e) 
        { 
            console.log(e.response)
            setLoading(false);  
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
        }
    }
    const placeOrder = async() => {
        
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
            intentId:stripeEssentials?.intentId
            }
            
        
         const apiCall = await axios.post(`${customer_api_urls.place_order}`,body);
         setLoading(false);
         if(apiCall.status == api_statuses.success) {
             showToaster('Pedido realizado');
             setOrderPlaced(true)
             for (var a=0;a<products?.length;a++) {
                 dispatch(deleteItemFromCart(products[a]?._id,products[a]?.price))
             }
         } else {
             showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
         }
        } catch(e) 
        { 
            setLoading(false);  
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
            refundPayment()
        }
    }
    
    useEffect(() => {
        getAddresses();
    },[]);

     const refundPayment = async() => {
         try {
          const apiCall = await axios.post(paymentApis?.refundPayment,{
            intentId:stripeEssentials?.intentId
          });
          if(apiCall?.status == 200) {
              showToaster('Su cantidad ha sido reembolsada');
              return
          }
         } catch(e) {
            //  Alert.alert('Refund failed',JSON.stringify(e))
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo')
            console.log(e?.response?.data)
         }
     }

     
    const fetchPaymentSheetParams = async (walletId) => {
       try {
        const customerData = await getUser();
        
        const data = {
            customerId:customerData?.customerId,
            walletId:business?.wallet_id,
            amount:allCharges.totalAmount,
            deliveryDistance:distancia,
            productsIds:cartProductIds,
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
        setStripeEssentials(apiResponse)
        return {
            paymentIntent:response?.data?.paymentIntent,
            ephemeralKey:response?.data?.ephemeralKey,
            customer:response?.data?.customer,
            publishableKey:response?.data?.publishableKey
        };
       } catch(e) {
           console.log('line 183',e)
           showToaster('Algo salió mal, intenta de nuevo')
       }
      };
    
      const initializePaymentSheet = async (walletId) => {
        
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
          console.log(error)
        }
      };
    
      const openPaymentSheet = async () => {
        await initializePaymentSheet();
        if(!deliveryAddress) {
            showToaster('Por favor, seleccione la dirección de entrega');
            return;
        }
        if(!business) {
            showToaster('Aún no se ha obtenido el negocio, espere, por favor...');
            return;
        }
        if(!products) {
            showToaster('No se puede realizar el pedido cuando la cantidad de productos es cero :/');
            return;
        }

        
        const { error } = await presentPaymentSheet();
        
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
          placeOrder()
        }
      };
    
    //   useEffect(() => {
    //     initializePaymentSheet();
    //   }, []);

    //   console.log({costoEnvio,Number(totalAmount)});
    //   console.log({totalAmount});
    if(isOrderPlaced) {
        return (
            <> 
            <BackgroundImage/>
            <View style={{...CommonStyles.flexOneCenter}}>
               
             <Ionicons
             name='checkmark-circle'
             color={Colors.terciarySolid} 
             size={160}
             />
                <Text style={{fontSize:30,...CommonStyles.fontFamily,color:Colors.white}}>Pedido realizado</Text>
                <Text style={{fontSize:15,fontWeight:'300',width:'75%',alignSelf:'center',textAlign:'center',color:Colors.white}}>
                Tu pedido ha sido realizado con éxito, pronto recibirás tu paquete
                </Text>

             <ButtonComponent
            handlePress={() => {
                props.navigation.replace(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)
            }}
            borderRadius={10}
            colorT={Colors.white}
            buttonText={'Continuar'}
            colorB={Colors.terciarySolid}
            width={200}
            margin={30}
            />
            </View>
            </>
            
        )
    }

    return (
    <View style={{flex:1,backgroundColor:'white'}}>
        <AddressesListingModal
        addressListingRef={addressListingRef}
        >
         {/* <FlatList
         data={addresses}
         keyExtractor={item => item?._id}
         renderItem={itemData => (
            
         )}
         /> */}
         {
             addresses.map((item) => (
                 <View key={item?._id}>
                    <AddressComponent
                    selected={deliveryAddress?._id == item?._id}
                    info={item.info}
                    phone={item.phone}
                    onPress={() => {
                    setDeliveryAddress(item)
                        //  const distance = Math.sqrt(
                        //     Math.pow(69.1 * (Number(business?.location?.latitude) - [itemData?.item?.latitude]), 2) +
                        //     Math.pow(69.1 * ([itemData?.item?.longitude] - Number(business?.location?.longitude)) * Math.cos(Number(business?.location?.latitude) / 57.3), 2));
                        //     setDeliveryDistance(distance)
                        //     console.log(distance)
                        //     setallCharges({
                        //     delivery_charges:Math.ceil((distance * params?.delivery_fee)),
                        //     besseri_commission:params?.comission,
                        //     totalAmount:params?.totalAmount,
                        //     subtotal:params?.subtotal,
                        //  })
                        handleModalize('close')
                    }}
                    addressLine={item.addressLine} label={item.label}/>
                 </View>
             ))
         }
        </AddressesListingModal>
        <LoaderComponent
        isVisible={loading}
        />
        <HeaderBackground/>
        <View style={styles.header}>
            <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            >
                <MaterialCommunityIcons
                name='keyboard-backspace'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>Resumen del pedido</Text>
           <View/>
        </View>
      <View>

      </View>


    <ScrollView contentContainerStyle={{flexGrow:1}}>
     <View style={{width:'93%',alignSelf:'center',marginTop:'8%'}}>
         <View style={{...CommonStyles.flexDirectionRow,...CommonStyles.justifySpaceBetween}}>
         <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Dirección de entrega</Text>
         <TouchableOpacity onPress={() => handleModalize('open')}>
             <MaterialIcons name='edit' color={Colors.terciarySolid} size={20}/>
         </TouchableOpacity>
         </View>
         {
             deliveryAddress ? 
             <AddressComponent
             width={'100%'}
             label={deliveryAddress?.label}
             addressLine={deliveryAddress?.addressLine}
             phone={deliveryAddress?.phone}
             info={deliveryAddress?.info}
             />
            //  <View style={{width:'100%',margin:10,height:100,backgroundColor:Colors.lightPink,alignSelf:'center',borderColor:Colors.darkPink,borderWidth:1,borderRadius:10,flexDirection:'row',alignItems:'center'}}>
            //  <Entypo
            //  name='location-pin'
            //  color={Colors.darkPink}
            //  size={40}
            //  />
            //  <Text style={{...CommonStyles.fontFamily,fontSize:13,width:'92%'}}>{deliveryAddress?.addressLine}</Text>
            //  <Text style={{...CommonStyles.fontFamily,fontSize:13,width:'92%'}}>{deliveryAddress?.addressLine}</Text>
            //  </View>
             :
             <ButtonComponent
             buttonText={'Seleccionar dirección de entrega'}
             colorB={Colors.primarySolid}
             width={'100%'}
             borderRadius={5}
             margin={10}
             padding={0}
             handlePress={() => {
                 getAddresses();
                 addressListingRef?.current?.open()
             }}
             />
         }
     </View>
     <ThinlineSeparator margin={10}/>

     <View style={{width:'93%',alignSelf:'center',marginTop:'1%'}}>
         <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Información del vendedor</Text>
         <View style={{width:'100%',margin:10,paddingVertical:14,backgroundColor:Colors.white,alignSelf:'center',borderColor:Colors.gray,borderWidth:1,borderRadius:10}}>
         <Text style={{fontSize:16,...CommonStyles.fontFamily,paddingLeft:25,marginBottom:10}}>{business?.storeName}</Text>
         <View style={{flexDirection:'row',alignItems:'center'}}>
         <Entypo
         name='location-pin'
         color={Colors.darkPink}
         size={30}
         />
         <Text style={{fontSize:13,width:'92%'}}>{business?.address}</Text>
         </View>
         </View>
     </View> 
     <ThinlineSeparator margin={10}/>

     <View style={{width:'93%',alignSelf:'center',marginTop:'1%'}}>
         <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Información del cliente</Text>
         <View style={{width:'100%',margin:10,paddingVertical:14,backgroundColor:Colors.white,alignSelf:'center',borderColor:Colors.gray,borderWidth:1,borderRadius:10}}>
         <Text style={{fontSize:16,...CommonStyles.fontFamily,paddingLeft:25,marginBottom:10}}>{user?.name}</Text>
         <Text style={{fontSize:16,fontStyle:'italic',fontWeight:'300',paddingLeft:25,marginBottom:10}}>{user?.email}</Text>
         {/* <Text style={{fontSize:16,paddingLeft:25,fontWeight:'300',marginBottom:10}}>{user?.phone}</Text> */}

         {/* <View style={{flexDirection:'row',alignItems:'center'}}>
         <Entypo
         name='location-pin'
         color={Colors.darkPink}
         size={30}
         />
         <Text style={{fontSize:13,width:'92%'}}>A#79 Happy Homes Qasimabad Hyderabad Sindh Pakistan</Text>
         </View> */}
         </View>
     </View>
  
     <ThinlineSeparator margin={10}/>

     
    <View style={{width:'93%',alignSelf:'center'}}>
    <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Resumen de productos</Text>    
   {/* <FlatList
    data={products}
    contentContainerStyle={{flexGrow:1,marginTop:10}}
    renderItem={itemData => (
        
    )}
    /> */}
    {
        products.map((item) => (
            <View key={item._id} style={{flexDirection:'row',width:'100%',alignSelf:'center',marginTop:'3%',borderBottomWidth:0.3,height:50}}>
                <View style={{width:'65%'}}>
                    <Text style={{fontSize:14,fontWeight:'bold'}}>{item.name}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',width:'35%'}}>
                    <View>
                        <Text style={{fontSize:adjust(12),fontWeight:'bold'}}>{item.quantity}x</Text>
                    </View>
                    <View>
                        <Text style={{fontSize:adjust(12),fontWeight:'bold'}}>{moneda(item.quantity * item.price + allCharges?.besseri_commission)}</Text>
                    </View>
                </View>
            </View>
        ))
    }
     
    </View>
    <ThinlineSeparator margin={10}/>


      <View style={styles.detailCard}>
      {/* <DetailItem label={'Sub total'} value={`${moneda(allCharges?.subtotal)} MXN`}/> */}
       <DetailItem label={'Gastos de envío'} value={deliveryAddress ? `${moneda(costoEnvio)} MXN` : 'Seleccionar direccion'}/>
       
       <DetailItem label={'Total Charges'} value={deliveryAddress ? `${moneda(totalAmount.toFixed(2)) } MXN` : 'Seleccionar direccion' }/>
      </View> 
    </ScrollView>
      <ButtonComponent
      handlePress={openPaymentSheet}
      borderRadius={0}
      buttonText={'Verificar'}
      colorB={Colors.terciarySolid}
      />
    </View>
  );
};
const styles = StyleSheet.create({
    header:{
        height: Platform.OS == 'ios' ? deviceHeight * 0.13  : deviceHeight * 0.10,
        width: deviceWidth,
        // backgroundColor:Colors.primaryColor,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:20,
        alignItems:'center'
    },
    headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20},
    detailCard:{
        width:'100%',
        backgroundColor:'white',
        elevation:5,
        alignSelf:'center',
        padding:20,
    }
})

export default CustomerOrderSummary;
