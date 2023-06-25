import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, LogBox, ScrollView, Alert, Platform } from 'react-native';
import Colors from '../../util/styles/colors';


import Entypo from 'react-native-vector-icons/Entypo'
import CommonStyles from '../../util/styles/styles';
import ButtonComponent from '../../components/button/button.component';
import { ThinlineSeparator } from '../../components/CommonComponents';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../util/local-storage/auth_service';
import axios from 'axios';
import { api_statuses, customer_api_urls, paymentApis } from '../../util/api/api_essentials';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import LoaderComponent from '../../components/Loader/Loader.component';
import AddressComponent from '../../components/customer-components/customer.addresscard.component';
import { useStripe } from '@stripe/stripe-react-native';
import { useRoute } from '@react-navigation/native';
import { useCostos } from '../../hooks/useCostos';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';
import SpinKit from 'react-native-spinkit';
import { OrderSuccessful } from './customer.order-successful';
import { Text, Box, HStack, VStack, Button, Image, Center } from 'native-base';
import AddressFormatted from '../../components/AddressFormatted';
import { ProductosPago } from '../../components/Customer/ProductosPago';
import { BtnPrincipal } from '../../components/Customer/BtnPrincipal';
import { deleteItemFromCart } from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import ModalChildren from '../../components/ModalChildren';
import { BOTTOM_TAB_CUSTOMER_ROUTES } from '../../util/constants';
import { useInfoUser } from '../../hooks/useInfoUsers';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const CustomerOrderSummary = (props) => {
    const { params } = useRoute();

    const desc = useSelector(state => state.cart.descuento);
    const order = props?.route?.params;
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const addressListingRef = useRef(null);
    const cartProduct = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const products = params?.products;
    const business = params?.business;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stripeEssentials, setStripeEssentials] = useState(null);
    const {  CalcularDistancia, distancia } = useCostos()

    const [allCharges, setallCharges] = useState({
        delivery_charges: order.envio,
        besseri_commission: order?.comission,
        totalAmount: Number(order?.totalAmount),
        subtotal: order?.subtotal,
        descuento: order?.descuento,
        comision: order?.comision,

    })
    const [isVisible, setIsVisible] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState(order.address);
    const [deliveryDistance, setDeliveryDistance] = useState(0)
    const totalAmount = allCharges?.subtotal + allCharges?.besseri_commission + allCharges.delivery_charges - allCharges.descuento;
    const [showModal, setshowModal] = useState(false)
    const handleModalize = async (flag) => {
        if (flag == 'open') {
            addressListingRef?.current?.open()
        } else {


            await CalcularDistancia(business, deliveryAddress)
            setDeliveryDistance(distancia)
            addressListingRef?.current?.close();

        }
    }
    const {getPedidosUser} = useInfoUser()


    const getUserDetails = async () => {
        setLoading(true);
        const userData = await getUser();
        setUser(userData);
        setLoading(false);
    }





    const getAddresses = async () => {
       
    }

   
    const placeOrder = async () => {

        if (!stripeEssentials?.intentId) {
            await initializePaymentSheet()
            setIsVisible(false);
        }

        try {
            setLoading(true);
           
            const body = {
                ordered_by_id: user?._id,
                products: order.products,
                storeId: order.business?._id,
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

            if (apiCall.status == api_statuses.success) {
                // setOrderPlaced(true)
                for (var a = 0; a < products?.length; a++) {
                    dispatch(deleteItemFromCart(products[a]?._id, products[a]?.price))
                }
                getPedidosUser()
               
                props.navigation.replace(CUSTOMER_HOME_SCREEN_ROUTES.PAGO_COMPLETED)
                // setshowModal(true)
                setIsVisible(false)
            } else {
                showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 3')
                setIsVisible(false);
            }
        } catch (e) {
            setLoading(false);
           
            setLoading(false);
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


    const fetchPaymentSheetParams = async (walletId) => {
        let ids = [];
        
        cartProduct?.cart_items.map((item) => {

            for (let index = 0; index < item.quantity; index++) {
                // //console.log(item._id)
                ids.push(item._id);
            }
        })
        try {
            const customerData = await getUser();

            const data = {
                customerId: customerData?.customerId,
                walletId: business?.wallet_id,
                amount: totalAmount,
                deliveryDistance: order.deliveryDistance,
                productsIds: ids,
                cupon: desc
            }

            if (!business?.wallet_id) {
                showToaster('La tienda aún no ha configurado la billetera, por lo que no es posible realizar un pedido desde esta tienda');
                props.navigation.goBack()
                return;
            }
            const response = await axios.post(customer_api_urls?.create_payment_sheet, data);

            const apiResponse = {
                paymentIntent: response?.data?.paymentIntent,
                ephemeralKey: response?.data?.ephemeralKey,
                customer: response?.data?.customer,
                publishableKey: response?.data?.publishableKey,
                intentId: response?.data?.intentId
            }
            setStripeEssentials(apiResponse)
            setIsVisible(false);
            return {
                paymentIntent: response?.data?.paymentIntent,
                ephemeralKey: response?.data?.ephemeralKey,
                customer: response?.data?.customer,
                publishableKey: response?.data?.publishableKey
            };
        } catch (e) {
               console.log('code 6',e)

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
                merchantDisplayName: 'Besseri',

            });

            if (!error) {
                //console.log({ initializePay: error })
            }
        } catch (error) {
            console.log({ init: error });
            showToaster('No hay conexion en este momento')
        }

    };

    const openPaymentSheet = async () => {
        setIsVisible(true);

        await initializePaymentSheet();
        if (!deliveryAddress) {
            showToaster('Por favor, seleccione la dirección de entrega');
            setIsVisible(false);
            return;
        }
        if (!business) {
            showToaster('Aún no se ha obtenido el negocio, espere, por favor...');
            setIsVisible(false);
            return;
        }
        if (!products) {
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
            Alert.alert(`Pago cancelado`);

        } else {
            placeOrder()
        }

    };

    useEffect(() => {
        getAddresses();
    }, []);

    useEffect(async () => {
        if (deliveryAddress) {
            await initializePaymentSheet()
        }
    }, []);

    useEffect(() => {
        getUserDetails();
    }, []);



    

    const completedPurchase = () => {
        setshowModal(false);
        props.navigation.navigate('CustomerHomeStack', { screen: BOTTOM_TAB_CUSTOMER_ROUTES.HOME_SCREEN });
    }

   


    return (
        <View style={[CommonStyles.screenY, { justifyContent: 'space-between' }]}>

            <LoaderComponent
                isVisible={loading}
            />



            <ScrollView 
            contentContainerStyle={[CommonStyles.screenY, { justifyContent: 'space-between' }]}
            >
                <Box
                    borderWidth={'1px'}
                    borderColor={Colors.white}
                    borderRadius={'5px'}
                    paddingX={'10px'}
                    paddingY={'35px'}
                // overflow={'hidden'}  
                >
                    <AddressFormatted address={order?.address?.formatted_address} />
                    <HStack justifyContent={'space-between'} mt={'20px'} >
                        <Text style={CommonStyles.h2} >Productos</Text>
                        <ProductosPago productos={order?.totalProductsPrice} />

                    </HStack>


                    {
                        order.pickup && (
                            <HStack justifyContent={'space-between'} >
                                <Text style={CommonStyles.h2} >Valet</Text>
                                <Text style={CommonStyles.h2} >{moneda(allCharges?.delivery_charges)}</Text>
                            </HStack>
                        )
                    }

                    <HStack justifyContent={'space-between'} >
                        <Text style={CommonStyles.h2}>Total</Text>
                        <Text style={CommonStyles.h2}>{moneda(allCharges?.totalAmount)}</Text>
                    </HStack>


                </Box>
                {
                    isVisible ? (
                        <View style={{ width: deviceWidth, alignItems: 'center', justifyContent: 'center' }} >
                            <SpinKit
                                type='Circle'
                                isVisible={isVisible}
                                color={Colors.primaryColor}
                                size={30}
                            />
                        </View>

                    )
                        : (
                            <VStack mt={'10px'} space={3} >
                                {/* <Text style={CommonStyles.h2} >Metodo de pago</Text> */}
                                <BtnPrincipal text={'Pagar'} onPress={openPaymentSheet} marginHorizontal={0} />
                            </VStack>
                        )

                }
            </ScrollView>




           

        </View>
    );
};
const styles = StyleSheet.create({
    header: {
        height: Platform.OS == 'ios' ? deviceHeight * 0.13 : deviceHeight * 0.10,
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
    },
    close:{
        width:30,
        height:30
      },
      btnClose:{
        position:'absolute',
        right:10,
        top:5
      }
})

export default CustomerOrderSummary;