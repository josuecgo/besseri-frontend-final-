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
    const [allCharges,setallCharges] = useState({
        delivery_charges:0,
        besseri_commission:params?.comission,
        totalAmount:params?.totalAmount,
        subtotal:params?.subtotal
    })
    const totalAmount = allCharges?.subtotal + allCharges?.delivery_charges + allCharges?.besseri_commission
    const subTotal = totalAmount - (allCharges?.delivery_charges + allCharges?.besseri_commission);
    const [deliveryAddress,setDeliveryAddress] = useState(null);
    const [deliveryDistance,setDeliveryDistance] = useState(null)
    const handleModalize = (flag) => {
        if(flag == 'open') {
            addressListingRef?.current?.open()
        } else {
            addressListingRef?.current?.close();
        }
    }
    // const calcTotal = async( ) => {
    //     let totalProductsPrice = 0;
    //     for (var a = 0; a < products?.length;a++) {
    //         totalProductsPrice += products[a]?.price * products[a]?.quantity
    //     }
    //     setTotalAmount(totalProductsPrice + allCharges?.delivery_charges + allCharges?.besseri_commission);
    //     return totalAmount;
    // }
    // useEffect(() => {
    //     calcTotal()
    // },[]);
    useEffect(() => {
       if(deliveryDistance) {
        initializePaymentSheet()
       }
    },[deliveryDistance]);
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
             showToaster('Something went wrong please try again :/')
         }
        } catch(e) 
        { 
            console.log(e.response)
            setLoading(false);  
            showToaster('Something went wrong please try again :/')
        }
    }
    const placeOrder = async() => {
        try {
            setLoading(true);
            const body = {
                ordered_by_id:user?._id,
             products:products,
             storeId:business?._id,
             total_amount:allCharges?.totalAmount,
             delivery_address:deliveryAddress,
             ordered_on:new Date(),
             delivery_fee:allCharges?.delivery_charges,
             besseri_comission:allCharges?.besseri_commission,
             intentId:stripeEssentials?.intentId
            }
         console.log(body)
         const apiCall = await axios.post(`${customer_api_urls.place_order}`,body);
         setLoading(false);
         if(apiCall.status == api_statuses.success) {
             showToaster('Order placed');
             setOrderPlaced(true)
             for (var a=0;a<products?.length;a++) {
                 dispatch(deleteItemFromCart(products[a]?._id,products[a]?.price))
             }
         } else {
             showToaster('Something went wrong please try again :/')
         }
        } catch(e) 
        { 
            setLoading(false);  
            showToaster('Something went wrong please try again :/')
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
              showToaster('Your amount has been refunded');
              return
          }
         } catch(e) {
            //  Alert.alert('Refund failed',JSON.stringify(e))
            showToaster('something went wrong please try again')
            console.log(e?.response?.data)
         }
     }


    const fetchPaymentSheetParams = async (walletId) => {
       try {
        const customerData = await getUser();
        console.log(params?.deliveryDistance)
        const data = {
            customerId:customerData?.customerId,
            walletId:business?.wallet_id,
            amount:allCharges?.totalAmount,
            deliveryDistance:deliveryDistance,
            productsIds:cartProductIds,
        }
        if(!business?.wallet_id) {
            showToaster('The store has not setup the wallet yet, so it is not possible to place order from this store');
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
           showToaster('something went wrong try again')
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
        if(!deliveryAddress) {
            showToaster('Please select delivery address');
            return;
        }
        if(!business) {
            showToaster('Business hasnt been fetched yet, wait please...');
            return;
        }
        if(!products) {
            showToaster('Cant place order when products quantity is zero :/');
            return;
        }


        const { error } = await presentPaymentSheet();
       console.log(error)    
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
          placeOrder()
        }
      };
    
    //   useEffect(() => {
    //     initializePaymentSheet();
    //   }, []);



    if(isOrderPlaced) {
        return (
            <View style={{...CommonStyles.flexOneCenter,backgroundColor:Colors.primaryColor}}>
             <Ionicons
             name='checkmark-circle'
             color={Colors.white} 
             size={160}
             />
             <Text style={{fontSize:30,...CommonStyles.fontFamily,color:Colors.white}}>Order placed</Text>
             <Text style={{fontSize:15,fontWeight:'300',width:'75%',alignSelf:'center',textAlign:'center',color:Colors.white}}>Your order has been placed successfully, soon you will recieve your parcel</Text>

             <ButtonComponent
      handlePress={() => {
        props.navigation.replace(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)
      }}
      borderRadius={10}
      colorT={Colors.primaryColor}
      buttonText={'Continue'}
      colorB={Colors.white}
      width={200}
      margin={30}
      />
            </View>
        )
    }
  return (
    <View style={{flex:1,backgroundColor:'white'}}>
        <AddressesListingModal
        addressListingRef={addressListingRef}
        >
         <FlatList
         data={addresses}
         keyExtractor={item => item?._id}
         renderItem={itemData => (
             <AddressComponent
             selected={deliveryAddress?._id == itemData.item?._id}
             info={itemData.item.info}
             phone={itemData.item.phone}
             onPress={() => {
                 setDeliveryAddress(itemData.item)
                 const distance = Math.sqrt(
                    Math.pow(69.1 * (Number(business?.location?.latitude) - [itemData?.item?.latitude]), 2) +
                    Math.pow(69.1 * ([itemData?.item?.longitude] - Number(business?.location?.longitude)) * Math.cos(Number(business?.location?.latitude) / 57.3), 2));
                    setDeliveryDistance(distance)
                    console.log(distance)
                    setallCharges({
                     delivery_charges:Math.ceil((distance * params?.delivery_fee)),
                    besseri_commission:params?.comission,
                    totalAmount:params?.totalAmount,
                    subtotal:params?.subtotal,
                 })
                 handleModalize('close')
             }}
             addressLine={itemData.item.addressLine} label={itemData.item.label}/>
         )}
         />
        </AddressesListingModal>
        <LoaderComponent
        isVisible={loading}
        />
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
            <Text style={styles.headerText}>Order Summary</Text>
            <TouchableOpacity>
                <MaterialCommunityIcons
                name='dots-vertical'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
        </View>
      <View>

      </View>


    <ScrollView contentContainerStyle={{flexGrow:1}}>
     <View style={{width:'93%',alignSelf:'center',marginTop:'8%'}}>
         <View style={{...CommonStyles.flexDirectionRow,...CommonStyles.justifySpaceBetween}}>
         <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Delivery Address</Text>
         <TouchableOpacity onPress={() => handleModalize('open')}>
             <MaterialIcons name='edit' color={Colors.primaryColor} size={20}/>
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
             buttonText={'Select Delivery Address'}
             colorB={Colors.primaryColor}
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
         <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Seller info</Text>
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
         <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Customer info</Text>
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
    <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Products summary</Text>    
   <FlatList
    data={products}
    contentContainerStyle={{flexGrow:1,marginTop:10}}
    renderItem={itemData => (
        <View style={{flexDirection:'row',width:'100%',alignSelf:'center',marginTop:'3%',borderBottomWidth:0.3,height:50}}>
        <View style={{width:'65%'}}>
            <Text style={{fontSize:14,fontWeight:'bold'}}>{itemData.item.name}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'35%'}}>
            <View>
                <Text style={{fontSize:15,fontWeight:'bold'}}>{itemData.item.quantity}x</Text>
            </View>
            <View>
                <Text style={{fontSize:16,fontWeight:'bold'}}>{itemData.item.quantity * itemData.item.price} MXN</Text>
            </View>
        </View>
       </View>
    )}
    />
     
    </View>
    <ThinlineSeparator margin={10}/>


      <View style={styles.detailCard}>
      <DetailItem label={'Sub total'} value={`${allCharges?.subtotal} MXN`}/>
       <DetailItem label={'Delivery charges'} value={`${allCharges?.delivery_charges} MXN`}/>
       <DetailItem label={'Commission'} value={`${allCharges?.besseri_commission} MXN`}/>
       <DetailItem label={'Total Charges'} value={`${totalAmount} MXN`}/>
      </View> 
    </ScrollView>
      <ButtonComponent
      handlePress={openPaymentSheet}
      borderRadius={0}
      buttonText={'Checkout'}
      colorB={Colors.brightBlue}
      />
    </View>
  );
};
const styles = StyleSheet.create({
    header:{
        width:'100%',
        height:80,
        backgroundColor:Colors.primaryColor,
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
