import React, { useRef, useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  LogBox
} from 'react-native';
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import CommonStyles from '../../util/styles/styles';
import ButtonComponent from '../../components/button/button.component';
import {
  
  ThinlineSeparator,
} from '../../components/CommonComponents';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../util/local-storage/auth_service';
import axios from 'axios';
import {
  api_statuses,
  customer_api_urls,
  paymentApis
} from '../../util/api/api_essentials';
import { showToaster } from '../../util/constants';
import LoaderComponent from '../../components/Loader/Loader.component';
import { useStripe } from '@stripe/stripe-react-native';
import { useRoute } from '@react-navigation/native';
import {
  deleteItemFromCart,
} from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';
import SpinKit from 'react-native-spinkit';
import { useCostos } from '../../hooks/useCostos';


LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const CustomerOrderSummaryFree = React.memo((props) => {
 
  const {params} = useRoute();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const cartProductIds = useSelector(state => state.cart.cart_items_ids);
  const dispatch = useDispatch();
  const products = params?.products;
  const business = params?.business;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [stripeEssentials, setStripeEssentials] = useState(null);
 
  const { CalcularDistancia, distancia} = useCostos();
  const costoK = params.delivery_fee;

  const [allCharges, setallCharges] = useState({
    delivery_charges: params.delivery_fee,
    besseri_commission: params?.comission,
    totalAmount: params?.totalAmount,
    subtotal: params?.subtotal,
  });
  const [isVisible, setIsVisible] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState(true);
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const totalAmount =allCharges?.subtotal + allCharges?.besseri_commission ;
  const totalSinEnvio = allCharges?.subtotal + allCharges?.besseri_commission ;
  const [tienda, setTienda] = useState(false);

 



  const getUserDetails = async () => {
    setLoading(true);
    const userData = await getUser();
    setUser(userData);
    setLoading(false);
  };

  useEffect(() => {
    getUserDetails();
  }, []);




  const getAddresses = async () => {
    setTienda(false);
    try {
      setLoading(true);
      const apiCall = await axios.get(
        `${customer_api_urls.get_addresses}/${user?._id}`,
      );
      setLoading(false);
      if (apiCall.status == api_statuses.success) {
        setAddresses(apiCall.data.data);
      } else {
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 1');
      }
      setIsVisible(false);
    } catch (e) {
      console.log(e.response);
      setIsVisible(false);
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 2');
    }
  };

  

  const placeOrder = async () => {
    if (!stripeEssentials?.intentId) {
      await initializePaymentSheet();
    }  
    try {
      setLoading(true);
      const body = {
        ordered_by_id: user?._id,
        products: products,
        storeId: business?._id,
        total_amount: tienda ? totalSinEnvio : totalAmount,
        delivery_address: deliveryAddress,
        ordered_on: new Date(),
        delivery_fee: tienda ? 0 : allCharges?.delivery_charges,
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
      console.log({code4: e});
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
  
  const fetchPaymentSheetParams = async walletId => {
    try {
      const customerData = await getUser();

      const data = {
        customerId: customerData?.customerId,
        walletId: business?.wallet_id,
        amount: allCharges.totalAmount,
        deliveryDistance:  0 ,
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
  };

  const initializePaymentSheet = async walletId => {
    try {
      const {paymentIntent, ephemeralKey, customer, publishableKey} =
        await fetchPaymentSheetParams(walletId);
      const {error} = await initPaymentSheet({
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
      console.log({init: error});
    }
  };

  const openPaymentSheet = async () => {
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
    if (!stripeEssentials) {
      showToaster('Intente de otra vez');
      setIsVisible(false);
      return;
    }

    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      placeOrder();
    }
  };


  useEffect(() => {
    CalcularDistancia(
      business?.location?.longitude,
      business?.location?.latitude,
      deliveryAddress?.longitude,
      deliveryAddress?.latitude,
      costoK,
    );
    setDeliveryDistance(distancia);
  }, [deliveryAddress]);



  useEffect(() => {
    getAddresses();
  }, []);

  useEffect(async () => {
    if (deliveryAddress) {
      await initializePaymentSheet();
    }
  }, [deliveryDistance]);


  const DetailItem = ({label, value}) => {
    return (
      <View
        style={{
          width: '100%',
          height: 60,
          borderBottomWidth: label == 'Total Charges' ? 0 : 0.3,
          borderColor: Colors.dark,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text style={{...CommonStyles.fontFamily, fontSize: 16}}>{label}</Text>
        <Text style={{fontSize: 16}}>{value}</Text>
      </View>
    );
  };



  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <LoaderComponent isVisible={loading} />
      <HeaderBackground />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            color={Colors.white}
            size={25}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Resumen del pedido</Text>
        <View />
      </View>
      <View></View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

        <View style={{ width: '93%', alignSelf: 'center', marginTop: '1%' }}>
          <Text style={{ ...CommonStyles.fontFamily, fontSize: 15 }}>
            Información del vendedor
          </Text>
          <View
            style={{
              width: '100%',
              margin: 10,
              paddingVertical: 14,
              backgroundColor: Colors.white,
              alignSelf: 'center',
              borderColor: Colors.gray,
              borderWidth: 1,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                ...CommonStyles.fontFamily,
                paddingLeft: 25,
                marginBottom: 10,
              }}>
              {business?.storeName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Entypo name="location-pin" color={Colors.darkPink} size={30} />
              <Text style={{ fontSize: 13, width: '92%' }}>
                {business?.address}
              </Text>
            </View>
          </View>
        </View>
        <ThinlineSeparator margin={10} />

        <View style={{ width: '93%', alignSelf: 'center', marginTop: '1%' }}>
          <Text style={{ ...CommonStyles.fontFamily, fontSize: 15 }}>
            Información del cliente
          </Text>
          <View style={{
            width: '100%',
            margin: 10,
            paddingVertical: 14,
            backgroundColor: Colors.white,
            alignSelf: 'center',
            borderColor: Colors.gray,
            borderWidth: 1,
            borderRadius: 10,
          }}>
            <Text
              style={{
                fontSize: 16,
                ...CommonStyles.fontFamily,
                paddingLeft: 25,
                marginBottom: 10,
              }}>
              {user?.name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontStyle: 'italic',
                fontWeight: '300',
                paddingLeft: 25,
                marginBottom: 10,
              }}>
              {user?.email}
            </Text>
          </View>
        </View>

        <ThinlineSeparator margin={10} />

        <View style={{ width: '93%', alignSelf: 'center' }}>
          <Text style={{ ...CommonStyles.fontFamily, fontSize: 15 }}>
            Resumen de productos
          </Text>

          {products.map(item => (
            <View
              key={item._id}
              style={{
                flexDirection: 'row',
                width: '100%',
                alignSelf: 'center',
                marginTop: '3%',
                borderBottomWidth: 0.3,
                height: 50,
              }}>
              <View style={{ width: '65%' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {item.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '35%',
                }}>
                <View>
                  <Text style={{ fontSize: adjust(12), fontWeight: 'bold' }}>
                    {item.quantity}x
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: adjust(12), fontWeight: 'bold' }}>
                    {moneda(
                      item.quantity * item.price +
                      allCharges?.besseri_commission,
                    )}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <ThinlineSeparator margin={10} />

        <View style={styles.detailCard}>
          <DetailItem
            label={'Total Charges'}
            value={`${moneda(totalSinEnvio.toFixed(2))} MXN`}
          />


        </View>
      </ScrollView>
      {isVisible ? (
        <View
          style={{
            width: deviceWidth,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <SpinKit
            type="Circle"
            isVisible={isVisible}
            color={Colors.terciarySolid}
            size={30}
          />
        </View>
      ) : (
        <ButtonComponent
          handlePress={openPaymentSheet}
          borderRadius={0}
          buttonText={'Verificar'}
          colorB={Colors.terciarySolid}
          disabled={isVisible}
          padding={5}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    height: Platform.OS == 'ios' ? deviceHeight * 0.13 : deviceHeight * 0.1,
    width: deviceWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: { ...CommonStyles.fontFamily, color: Colors.white, fontSize: 20 },
  detailCard: {
    width: '100%',
    backgroundColor: 'white',
    elevation: 5,
    alignSelf: 'center',
    padding: 20,
  },
});

export default CustomerOrderSummaryFree;
