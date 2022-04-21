import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, FlatList, ScrollView, Image, useWindowDimensions, SafeAreaView } from 'react-native';
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
import { useSelector } from 'react-redux';
import { getUser } from '../../util/local-storage/auth_service';
import axios from 'axios';
import { api_statuses, base_url, customer_api_urls, paymentApis, vendor_api_urls } from '../../util/api/api_essentials';
import { showToaster } from '../../util/constants';
import LoaderComponent from '../../components/Loader/Loader.component';
import { Modalize } from 'react-native-modalize';
import AddressComponent from '../../components/customer-components/customer.addresscard.component';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { deviceHeight, deviceWidth } from '../../util/Dimentions';
const CustomerServiceBook = (props) => {
    const { width, height } = useWindowDimensions();
    const { params } = useRoute();
    const service = params.service;
    const [isBookingPlaced, setBookingPlaced] = useState(false);
    const addressListingRef = useRef(null);  
    const [business, setBusiness] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [besseri_charges,setBesseriCharges] = useState(null);
    const besseri_comission = Math.round((Number(besseri_charges) * Number(service?.price)) / 100);
    const [stripeEssentials,setStripeEssentials] = useState(null);
    const totalAmount = new Number(service?.price) + new Number(besseri_comission)
    const subTotal = new Number(service?.price);


    const onChange = (event, selectedDate) => {
      
        if (mode == 'date') {
            const currentDate = selectedDate || date;
            setShow(Platform.OS === 'ios');
            setDate(currentDate);
        } else {
            setShow(Platform.OS === 'ios');
            setTime(selectedDate);
        }
        setShow(false);
    };

    const fetchFees = async () => {
        try {
          const getFee = await axios.get(customer_api_urls?.get_fees);
          console.log(getFee.data)
          setBesseriCharges(getFee.data.data[0]?.besseri_comission);
        } catch (e) {
          console.log(e?.response);
          showToaster('Algo salió mal');
        }
      }
      useEffect(() => {
        fetchFees();
      }, []);

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

   
    const handleModalize = (flag) => {
        if (flag == 'open') {
            addressListingRef?.current?.open()
        } else {
            addressListingRef?.current?.close();
        }
    }
    const getUserDetails = async () => {
        setLoading(true);
        const userData = await getUser();
        setUser(userData);
        setLoading(false);
    }
    useEffect(() => {
        getUserDetails();
    }, []);
    const getBusinessDetails = async (id) => {
        try {
            setLoading(true);
            const apiCall = await axios.get(`${customer_api_urls.get_business_details}/${id}`);
            setLoading(false);
            if (apiCall.status == api_statuses.success) {
                setBusiness(apiCall.data.data);
                console.log(apiCall.data.data)
                initializePaymentSheet(apiCall.data.data?.store?.wallet_id)
            } else {
                showToaster('Algo salió mal, inténtalo de nuevo más tarde.');
            }
        } catch (e) {
            setLoading(false);
            showToaster('Algo salió mal, inténtalo de nuevo más tarde.')
        }
    }
    useEffect(() => {
        getBusinessDetails(service?.business_id);
    }, []);


    const DetailItem = ({ label, value }) => {
        return (
            <View style={{ width: '100%', height: 60, borderBottomWidth: label == 'Total Charges' ? 0 : 0.3, borderColor: Colors.dark, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
                <Text style={{ ...CommonStyles.fontFamily, fontSize: 16 }}>{label}</Text>
                <Text style={{ fontSize: 16 }}>{value}</Text>
            </View>
        )
    }

    const ValidationPopup = (text) => {
        showToaster(text);
        return;
    }

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

    const bookAppointment = async () => {
        try {
            if (!date) {
                ValidationPopup('Seleccione la fecha por favor');
            }
            if (!time) {
                ValidationPopup('Seleccione hora por favor');
            }
            if (!business) {
                ValidationPopup('Esperar información comercial');
            }
            if (!service) {
                ValidationPopup('Ningún servicio seleccionado');
            }
            if (!user) {
                ValidationPopup('Información de usuario no encontrada')
            }
            setLoading(true);
            const all = {
                booked_by_id: user?._id,
                serviceId: service?._id,
                storeId: business?.store?._id,
                date: date,
                time: time,
                total_amount:`${Number(totalAmount) + 10}` 
            }
            
            const apiCall = await axios.post(`${customer_api_urls.book_service}`, {
                booked_by_id: user?._id,
                serviceId: service?._id,
                storeId: business?.store?._id,
                date: date,
                time: time,
                total_amount:totalAmount ,
                chargeId:stripeEssentials?.intentId,
                besseri_comission
            });
         
            setLoading(false);
            if (apiCall.status == api_statuses.success) {
                showToaster('Reserva creada');
                setBookingPlaced(true)
            } else {
                showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
            }
        } catch (e) {
            setLoading(false)
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
            refundPayment()
            console.log(e?.response?.data)
        }
    }


    const fetchPaymentSheetParams = async (walletId) => {
        try {
         const customerData = await getUser();
         console.log({
            customerId:customerData?.customerId,
            walletId:walletId,
            serviceId:service?._id
         })
         const response = await axios.post(customer_api_urls?.create_payment_sheet_services,{
             customerId:customerData?.customerId,
             walletId:walletId,
             serviceId:service?._id
         });    
         setStripeEssentials({
            paymentIntent:response?.data?.paymentIntent,
            ephemeralKey:response?.data?.ephemeralKey,
            customer:response?.data?.customer,
            publishableKey:response?.data?.publishableKey,
            intentId:response?.data?.intentId
         })
         return {
           paymentIntent:response?.data?.paymentIntent,
           ephemeralKey:response?.data?.ephemeralKey,
           customer:response?.data?.customer,
           publishableKey:response?.data?.publishableKey
         };
        } catch(e) {
            console.log('line 192',e?.response?.data)
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo')
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
           if(!time) {
               showToaster('Por favor seleccione la hora');
               return;
           }
           if(!date) {
               showToaster('Por favor seleccione la fecha');
               return;
           }
         const { error } = await presentPaymentSheet();
           
         if (error) {
           Alert.alert(`Error code: ${error.code}`, error.message);
         } else {
           bookAppointment()
         }
       };
     
    //    console.log({totalServiceBook:totalAmount});

        if (isBookingPlaced) {
        return (
            <View style={{ ...CommonStyles.flexOneCenter, backgroundColor: Colors.terciarySolid }}>
                <Ionicons
                    name='checkmark-circle'
                    color={Colors.white}
                    size={160}
                />
                <Text style={{ fontSize: 30, ...CommonStyles.fontFamily, color: Colors.white }}>Cita reservada</Text>
                <Text style={{ fontSize: 15, fontWeight: '300', width: '75%', alignSelf: 'center', textAlign: 'center', color: Colors.white }}>
                    Your appointment has been booked , soon you will recieve update from store.
                </Text>

                <ButtonComponent
                    handlePress={() => {
                        setBookingPlaced(false)
                        props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)
                    }}
                    borderRadius={10}
                    colorT={Colors.primaryColor}
                    buttonText={'Continuar'}
                    colorB={Colors.white}
                    width={200}
                    margin={30}
                />
            </View>
        )
    }
    return (
        <>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
               
                    
                   

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
                                        handleModalize('close')
                                    }}
                                    addressLine={itemData.item.addressLine} label={itemData.item.label} />
                            )}
                        />
                    </AddressesListingModal>
                    <LoaderComponent
                        isVisible={loading}
                    />
                    <HeaderBackground/>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()}> 
                            <MaterialCommunityIcons
                            onPress={() => props?.navigation?.goBack()}
                                name='keyboard-backspace'
                                color={Colors.white}
                                size={25}
                            />
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.headerText}>Reservar servicio</Text>
                            <Text style={{ fontSize: 13, fontWeight: '300', color: Colors.white }}>{service?.name}</Text>
                        </View>
                       <View/>
                    </View>
                    <View>

                    </View>


                    <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:Colors.bgColor}}>
                        <View style={{ width: '93%', alignSelf: 'center', marginTop: '8%' }}>
                            <View style={{ ...CommonStyles.flexDirectionRow, ...CommonStyles.justifySpaceBetween }}>
                                <Text style={{ ...CommonStyles.fontFamily, fontSize: 15 }}>Fecha</Text>
                                {/* <TouchableOpacity onPress={() => handleModalize('open')}>
                                    <MaterialIcons name='edit' color={Colors.terciarySolid} size={20} />
                                </TouchableOpacity> */}
                            </View>

                            {show && (
                    <View style={{zIndex:999}} >
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    </View>

                    )}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: width, alignSelf: 'center' }}>
                                <ButtonComponent
                                    buttonText={date ? moment(date).format('DD-MM-YYYY') : 'Select Date'}
                                    colorB={Colors.primarySolid}
                                    width={width / 2.3}
                                    borderRadius={5}
                                    margin={10}
                                    padding={0}
                                    handlePress={() => {
                                        setMode('date')
                                        setShow(true)
                                    }}
                                />
                                <ButtonComponent
                                    buttonText={time ? moment(time).format('hh:mm A') : 'Seleccionar hora'}
                                    colorB={Colors.primarySolid}
                                    width={width / 2.3}
                                    borderRadius={5}
                                    margin={10}
                                    padding={0}
                                    handlePress={() => {
                                        setMode('time')
                                        setShow(true)
                                    }}
                                />
                            </View>
                        </View>
                        <ThinlineSeparator margin={10} />

                        <View style={{ width: '93%', alignSelf: 'center', marginTop: '1%' }}>
                            <Text style={{ ...CommonStyles.fontFamily, fontSize: 15 }}>Información del vendedor</Text>
                            <View style={{ width: '100%', margin: 10, paddingVertical: 14, backgroundColor: Colors.white, alignSelf: 'center', borderColor: Colors.gray, borderWidth: 1, borderRadius: 10 }}>
                                <Text style={{ fontSize: 16, ...CommonStyles.fontFamily, paddingLeft: 25, marginBottom: 10 }}>
                                    {business?.store?.storeName}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Entypo
                                        name='location-pin'
                                        color={Colors.darkPink}
                                        size={30}
                                    />
                                    <Text style={{ fontSize: 13, width: '92%' }}>{business?.store?.address}</Text>
                                </View>
                            </View>
                        </View>
                        <ThinlineSeparator margin={10} />

                        <View style={{ width: '93%', alignSelf: 'center', marginTop: '1%' }}>
                            <Text style={{ ...CommonStyles.fontFamily, fontSize: 15 }}>Información del cliente</Text>
                            <View style={{ width: '100%', margin: 10, paddingVertical: 14, backgroundColor: Colors.white, alignSelf: 'center', borderColor: Colors.gray, borderWidth: 1, borderRadius: 10 }}>
                                <Text style={{ fontSize: 16, ...CommonStyles.fontFamily, paddingLeft: 25, marginBottom: 10 }}>{user?.name}</Text>
                                <Text style={{ fontSize: 16, fontStyle: 'italic', fontWeight: '300', paddingLeft: 25, marginBottom: 10 }}>{user?.email}</Text>
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

                        <ThinlineSeparator margin={10} />


                        <View style={{ width: '93%', alignSelf: 'center' }}>
                            <Text style={{ ...CommonStyles.fontFamily, fontSize: 15 }}>Resumen del servicio</Text>
                            <View style={{ paddingVertical:14,flexDirection: 'row', marginTop: 10,backgroundColor:Colors.white,borderColor: Colors.gray, borderWidth: 1, borderRadius: 10 }}>
                                <Image
                                    source={{ uri: `${base_url}/${service?.coverImg}` }}
                                    style={{ width: 60, height: 60, borderRadius: 10 }}
                                />
                                <Text style={{ paddingHorizontal: 10, width: '80%', fontWeight: '300' }}>{service?.description}</Text>
                            </View>
                        </View>
                        <ThinlineSeparator margin={10} />


                        <View style={styles.detailCard}>
                            {/* <DetailItem label={'Subtotal'} value={`${subTotal} MXN`} />
                            <DetailItem label={'Besseri Comission'} value={`${Math.round((Number(besseri_charges) * Number(service?.price)) / 100)} MXN`} /> */}
                            <DetailItem label={'Total'} value={`${totalAmount} MXN`} />
                        </View>
                    </ScrollView>
                    <ButtonComponent
                        handlePress={openPaymentSheet}
                        borderRadius={0}
                        buttonText={'Checkout'}
                        colorB={Colors.terciarySolid}
                    />
                </View>

              

            </View>
        </>
    );
};
const styles = StyleSheet.create({
    header: {
        height: Platform.OS == 'ios' ? deviceHeight * 0.13  : deviceHeight * 0.10,
          width: deviceWidth,
       
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    headerText: { ...CommonStyles.fontFamily, color: Colors.white, fontSize: 20 },
    detailCard: {
        width: '100%',
        backgroundColor: 'white',
        elevation: 5,
        alignSelf: 'center',
        padding: 20,
    }
})

export default CustomerServiceBook;
