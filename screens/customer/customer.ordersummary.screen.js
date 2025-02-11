import React, { useEffect, useRef, useState } from 'react';
import { View, LogBox, ScrollView, Alert } from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../util/local-storage/auth_service';
import axios from 'axios';
import { api_statuses, customer_api_urls, paymentApis } from '../../util/api/api_essentials';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import LoaderComponent from '../../components/Loader/Loader.component';
import { useStripe } from '@stripe/stripe-react-native';
import { useRoute } from '@react-navigation/native';
import { useCostos } from '../../hooks/useCostos';
import { deviceWidth } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';
import SpinKit from 'react-native-spinkit';
import { Text, Box, HStack, VStack, Checkbox, Radio } from 'native-base';
import AddressFormatted from '../../components/AddressFormatted';
import { ProductosPago } from '../../components/Customer/ProductosPago';
import { BtnPrincipal } from '../../components/Customer/BtnPrincipal';
import { deleteItemFromCart, resetCart } from '../../util/ReduxStore/Actions/CustomerActions/CartActions';

import { BOTTOM_TAB_CUSTOMER_ROUTES } from '../../util/constants';
import { useInfoUser } from '../../hooks/useInfoUsers';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const CustomerOrderSummary = (props) => {
    const { params } = useRoute();

    const desc = useSelector(state => state.cart.descuento);
    const order = props?.route?.params;
    const user = order?.user;
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const addressListingRef = useRef(null);
    const cartProduct = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const products = params?.products;
    const business = params?.business;
    const [loading, setLoading] = useState(false);
    const [stripeEssentials, setStripeEssentials] = useState(null);
    const { CalcularDistancia, distancia } = useCostos()

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
    const [value, setValue] = React.useState("tarjeta");




    const handleModalize = async (flag) => {
        if (flag == 'open') {
            addressListingRef?.current?.open()
        } else {


            await CalcularDistancia(business, deliveryAddress)
            setDeliveryDistance(distancia)
            addressListingRef?.current?.close();

        }
    }
    const { getPedidosUser } = useInfoUser()





    const placeOrder = async () => {

        if (!stripeEssentials?.intentId) {
            await initializePaymentSheet()
            setIsVisible(false);
        }
        const userData = await getUser();
        try {
            setLoading(true);


            const apiCalls = await Promise.all(
                order?.vendors.map(async (vendor) => {
                    const body = {
                        ordered_by_id: userData?._id,
                        products: vendor?.cart_items,
                        storeId: vendor?.businessId,
                        total_amount: Number(vendor?.total_amount),
                        delivery_address: order.address,
                        ordered_on: new Date(),
                        delivery_fee: allCharges?.delivery_charges,
                        besseri_comission: allCharges?.besseri_commission,
                        intentId: stripeEssentials?.intentId,
                        cupon: order?.cupon,
                        storePickup: !order.pickup,
                    };


                    return axios.post(`${customer_api_urls.place_order}`, body);
                })
            );

            // console.log(apiCalls.data, 'apiCalls');


            if (apiCalls.every((response) => response.status === api_statuses.success)) {
                // Elimina productos del carrito
                await dispatch(resetCart());

                // Actualiza pedidos y redirige
                await getPedidosUser();
                props.navigation.replace(CUSTOMER_HOME_SCREEN_ROUTES.PAGO_COMPLETED);
                setLoading(false);
                setIsVisible(false);
            } else {
                setLoading(false);
                throw new Error("Una o más órdenes no se pudieron procesar.");
            }



            // if (apiCall.status == api_statuses.success) {
            //     // setOrderPlaced(true)
            //     for (var a = 0; a < products?.length; a++) {
            //         dispatch(deleteItemFromCart(products[a]?._id, products[a]?.price))
            //     }
            //     getPedidosUser()

            //     props.navigation.replace(CUSTOMER_HOME_SCREEN_ROUTES.PAGO_COMPLETED)
            //     // setshowModal(true)
            //     setIsVisible(false)
            // } else {
            //     showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 3')
            //     setIsVisible(false);
            // }
        } catch (e) {


            console.log(e, 'placeOrder');

            setLoading(false);


            showToaster('Algo salió mal. Por favor, vuelva a intentarlo 2 code: 4')
            // refundPayment()
            setIsVisible(false)
        }


    }

    const placeOrderMechanic = async () => {

        setIsVisible(true);
        const userData = await getUser();
        try {
            setLoading(true);




            const apiCalls = await Promise.all(
                order?.vendors.map(async (vendor) => {
                    const body = {
                        ordered_by_id: userData?._id,
                        products: vendor?.cart_items,
                        storeId: vendor?.businessId,
                        total_amount: Number(vendor?.total_amount),
                        delivery_address: order.address,
                        ordered_on: new Date(),
                        delivery_fee: allCharges?.delivery_charges,
                        besseri_comission: allCharges?.besseri_commission,
                        intentId: 'cash',
                        cupon: order?.cupon,
                        storePickup: !order.pickup,
                    };


                    return axios.post(`${customer_api_urls.place_order}`, body);
                })
            );


            if (apiCalls.every((response) => response.status === api_statuses.success)) {
                // Elimina productos del carrito
                // products?.forEach((product) => {
                //     dispatch(deleteItemFromCart(product?._id, product?.price));
                // });
                await dispatch(resetCart());
                // Actualiza pedidos y redirige
                await getPedidosUser();
                props.navigation.replace(CUSTOMER_HOME_SCREEN_ROUTES.PAGO_COMPLETED);
                setLoading(false);
                setIsVisible(false);
            } else {
                setLoading(false);
                throw new Error("Una o más órdenes no se pudieron procesar.");
            }


        } catch (e) {




            setLoading(false);


            showToaster('Algo salió mal. Por favor, vuelva a intentarlo  code: 55')
            // refundPayment()
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
            console.log(e)
        }
    }



    const fetchPaymentSheetParams = async () => {
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

            // if (!business?.wallet_id) {
            //     showToaster('La tienda aún no ha configurado la billetera, por lo que no es posible realizar un pedido desde esta tienda');
            //     props.navigation.goBack()
            //     return;
            // }

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

            showToaster('Algo salió mal, intenta de nuevo code: 6')
            setIsVisible(false);
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


        } catch (error) {
            //    console.log(error,'initializePaymentSheet');

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
        // if (!business) {
        //     showToaster('Aún no se ha obtenido el negocio, espere, por favor...');
        //     setIsVisible(false);
        //     return;
        // }
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
        let abortController = new AbortController();
        if (deliveryAddress) {
            initializePaymentSheet()
        }
        return () => {
            abortController.abort();
        }
    }, []);







    const completedPurchase = () => {
        setshowModal(false);
        props.navigation.navigate('CustomerHomeStack', { screen: BOTTOM_TAB_CUSTOMER_ROUTES.HOME_SCREEN });
    }




    return (
        <View style={[CommonStyles.screenY, { justifyContent: 'space-between' }]}>

            <LoaderComponent isVisible={loading} />



            <ScrollView contentContainerStyle={[CommonStyles.screenY, { justifyContent:'space-between' }]} >
                <Box
                    borderWidth={'1px'}
                    borderColor={Colors.white}
                    borderRadius={'5px'}
                    paddingX={'10px'}
                    paddingY={'10px'}
                // overflow={'hidden'}  
                >
                    <Text>Tu envío sería a esta dirección:</Text>
                    <AddressFormatted address={order?.address?.formatted_address} />



                    {
                        order.pickup && (
                            <HStack justifyContent={'space-between'} mt={'15px'} >
                                <Text style={CommonStyles.h2} >Valet</Text>
                                <Text style={CommonStyles.h2} >{moneda(allCharges?.delivery_charges)}</Text>
                            </HStack>
                        )
                    }

                    <ProductosPago productos={order?.totalProductsPrice} />


                </Box>

                    {
                         user?.role == 'mechanic' && (
                        <Box
                        borderWidth={'1px'}
                        borderColor={Colors.white}
                        borderRadius={'5px'}
                        paddingX={'10px'}
                        paddingY={'10px'}
                        // overflow={'hidden'}  
                        >
                        <Text>Elegir método de pago</Text>

                        <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={value} onChange={nextValue => {
                            setValue(nextValue);
                        }}>
                            <Radio value="efectivo" my={1}>
                            Pagar al recibir el producto
                            </Radio>
                            <Radio value="tarjeta" my={1}>
                            Pagar ahora
                            </Radio>
                            </Radio.Group>
                        </Box>
                         )
                    }
                



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

                                <BtnPrincipal text={'Pagar'} onPress={() => {
                                    if (value === 'efectivo') {
                                        openPaymentSheet()
                                        return
                                    }
                                    if (value === 'tarjeta') {
                                        openPaymentSheet()
                                        return
                                    }

                                    showToaster('Elije método de pago')
                                    }} 
                                    marginHorizontal={0} 
                                    />
                               
                            </VStack>
                        )

                }
            </ScrollView>






        </View>
    );
};


export default CustomerOrderSummary;