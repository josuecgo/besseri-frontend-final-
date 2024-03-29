import React, {useLayoutEffect, useState,useEffect, useContext,useRef} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  
} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import {ORDER_STATUSES, SCREEN_HORIZONTAL_MARGIN, showToaster, STATUSES_COLORS, STATUS_LABELS, VENDOR_DETAILS_ROUTES} from '../../util/constants';
import DropDownPicker from 'react-native-dropdown-picker';
import ButtonComponent from '../../components/button/button.component';
import OrderProductItemComponent from '../../components/vendor-shared/order-product-item.component';
import { api_statuses, api_urls, base_url, vendor_api_urls } from '../../util/api/api_essentials';
import axios from 'axios';
import LoaderComponent from '../../components/Loader/Loader.component';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import TopCircleComponent from '../../components/top-circle/top-circle.component';
import { moneda } from '../../util/Moneda';
import { adjust } from '../../util/Dimentions';
import { TranslateStatus } from '../../util/helpers/StatusText';
import { NotificationContext } from '../../util/context/NotificationContext';
import { RiderSecurityCodeModal } from '../../components/CommonComponents';
import { getUserId } from '../../util/local-storage/auth_service';


export const CustomText = ({text, isData = false, numberOfLines = null}) => {
  const stylesInner = isData ? {fontSize: adjust(12), opacity: 0.5} : {fontSize: 13};
  
  
  return (
    <Text
      ellipsizeMode="tail"
      numberOfLines={numberOfLines}
      style={[
        styles.flex1,
        CommonStyles.fontFamily,
        stylesInner,
        {paddingLeft: 5},
      ]}>
      {text}
    </Text>
  );
};

const VendorOrderDetailsScreen = ({navigation, route}) => {
  const {getNotificaciones} = useContext(NotificationContext);
  const {orderNumber} = route.params
  
  const [loading,setLoading] = useState(false);
  const [order,setOrder] = useState(null);
  const [orderStatus,setOrderStatus] = useState(ORDER_STATUSES[order?.status_code]);
  const [orderStatusCode,setorderStatusCode] = useState('')
  const [rideRequets,setRideRequests] = useState([]);
  const isProcessing = order?.order_status_code == 'PROCESSING';
  const isParcel = order?.order_status_code == 'PARCEL_DELIVERED';
 
  const securityCodeModalRef = useRef(null);
  const [delivery_security_code, setDelivery_security_code] = useState('');
  const {height,width} = useWindowDimensions();
  
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Order ID: #${route.params?.orderNumber}`,
    });
  }, [route.params?.orderNumber, navigation]);

  const getRideRequets = async() => {
    try {
      setLoading(true)
     const apiCall = await axios.get(`${vendor_api_urls.get_ride_requests}/${route.params.orderId}`);
     setLoading(false);
     if(apiCall.status == api_statuses.success) {
        setRideRequests(apiCall.data.data);
     } else {
       showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
     }
    } catch(e) {
      setLoading(false);
      // console.log(e?.response?.data)
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
    }
  } 
  const AcceptRide = async(riderId,requestId) => {
    try {
      setLoading(true)
     const apiCall = await axios.patch(`${vendor_api_urls.accept_ride}`,{
      requestId:requestId,
      riderId:riderId
     });
     setLoading(false);
     
     if(apiCall.status == api_statuses.success) {
      
        await getOrderDetails();
        navigation.goBack()
     } else {
       showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
       navigation.goBack()
     }
    } catch(e) {
      // console.log(e?.response?.data)
      setLoading(false);
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
      navigation.goBack()
    }
  }

  const getOrderDetails = async() => {
    try {
      setLoading(true)
     const apiCall = await axios.get(`${api_urls.get_order_details}/${route.params.orderId}`);
     setLoading(false);
     if(apiCall.status == api_statuses.success) {
        setOrder(apiCall.data.data[0]);
        setOrderStatus(apiCall.data.data[0]?.order_status_code)
     } else {
       showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
       navigation.goBack()
     }
    } catch(e) {
      setLoading(false);
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
      navigation.goBack()
    }
  }


  useEffect(() => {
    getOrderDetails();
  },[]);
  useEffect(() => {
    getRideRequets();
  },[])

  const updateOrderStatus = async() => {
    try {
      setLoading(true);
     const apiCall = await axios.post(`${vendor_api_urls.update_order}`,{
       status:'Packed',
       status_code:'PACKED',
       orderId:route.params.orderId
     });
     setLoading(false);
     if(apiCall.status == api_statuses.success) {
      //  console.log(apiCall.data)
        await getOrderDetails()
        
     } else {
       showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
       navigation.goBack()
     }
    } catch(e) {
      // console.log(e.response.data)
      setLoading(false);
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
      navigation.goBack()
    }
  }

  const updateOrderStatusPickup = async() => {
    try {
      setLoading(true);
     const apiCall = await axios.post(`${vendor_api_urls.update_order_pickup}`,{
      status:'Out for delivery',
      status_code:'OUT_FOR_DELIVERY',
       orderId:route.params.orderId
     });
     setLoading(false);
     if(apiCall.status == api_statuses.success) {
      //  console.log(apiCall.data)
        await getOrderDetails()
     } else {
       showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
       navigation.goBack()
     }
    } catch(e) {
      // console.log(e.response.data)
      setLoading(false);
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
      navigation.goBack()
    }
  }
  const changeOrderStatus = async(status,statusCode) => {
    try {
      setLoading(true);
     const apiCall = await axios.post(`${vendor_api_urls.update_order_pickup}`,{
      status:status,
      status_code:statusCode,
      orderId:route.params.orderId,
      
     });
     setLoading(false);
     if(apiCall.status == api_statuses.success) {
      //  console.log(apiCall.data)
        await getOrderDetails()
     } else {
       showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
       navigation.goBack()
     }
    } catch(e) {
      // console.log(e.response.data)
      setLoading(false);
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
      navigation.goBack()
    }
  }

 
  
  
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <LoaderComponent isVisible={loading} />
      <TopCircleComponent textHeading={'Pedido #'+orderNumber} />
      <RiderSecurityCodeModal
        RiderSecurityCodeModalRef={securityCodeModalRef}
        securityCode={delivery_security_code}
        onChangeSecurityCode={dc => setDelivery_security_code(dc)}
        
        onProceed={() => {
          if (!delivery_security_code) {
            showToaster('Por favor ingrese el código de seguridad de entrega');
            return;
          }
          if (delivery_security_code == order?.delivery_security_code) {
            Alert.alert(
              '¿Paquete entregado?',
              '¿Has entregado el paquete? si continúa, cambiará el estado del pedido a pedido entregado.',
              [
                {
                  text: 'No',
                },
                {
                  text: 'Sí',
                  onPress: () => {
                    changeOrderStatus('Parcel Delivered', 'PARCEL_DELIVERED');
                    securityCodeModalRef?.current?.close();
                  },
                },
              ],
            );
          } else {
            showToaster('Ha introducido un código de seguridad no válido');
            securityCodeModalRef?.current?.close();
          }
        }}
      />
      <View
        style={[
          styles.orderDetailsContainer,
          CommonStyles.horizontalCenter,
          {minHeight: height,backgroundColor:Colors.bgColor},
        ]}>
        <View
          style={styles.estado}>
          <Text style={{...CommonStyles.fontFamily, fontSize: 16}}>
            Estado del pedido
          </Text>
          <Text
            style={{
              fontSize: 14,
              ...CommonStyles.fontFamily,
              color: STATUSES_COLORS[order?.order_status_code],
            }}>
            {TranslateStatus(order?.order_status_code)}
          </Text>
          
        </View>

        <View
          style={{flex: 1, width: '90%', alignSelf: 'center', marginTop: 30}}>
          <View style={CommonStyles.flexDirectionRow}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
                }}
                style={styles.imageStyles}
              />
            </View>
            <View
              style={[
                styles.customerDataContainer,
                CommonStyles.horizontalCenter,
              ]}>
              <Text style={[styles.customerHeading, CommonStyles.fontFamily]}>
              Nombre del cliente
              </Text>
              <Text
                style={[
                  styles.customerSubText,
                  CommonStyles.fontFamily,
                  styles.customerHeading,
                ]}>
                {order?.user?.name}
              </Text>
              <Text style={[styles.customerHeading, CommonStyles.fontFamily]}>
              Teléfono
              </Text>
              <Text
                style={[
                  styles.customerSubText,
                  CommonStyles.fontFamily,
                  styles.customerHeading,
                ]}>
                {order?.delivery_address?.phone ? order?.delivery_address?.phone : order?.user.phone}
              </Text>
              <Text style={[styles.customerHeading, CommonStyles.fontFamily]}>
                Costo
              </Text>
              <Text
                style={[
                  styles.customerSubText,
                  CommonStyles.fontFamily,
                  styles.customerHeading,
                ]}>
                MXN {moneda(order?.total_amount)}
              </Text>
            </View>
          </View>


          <View>
            <TouchableOpacity onPress={() => navigation.navigate(VENDOR_DETAILS_ROUTES.DESCRIPTION,{order})} >
              <Text
                style={[
                  CommonStyles.fontFamily,
                  styles.customerHeading,
                  {marginVertical: 10,textDecorationLine:'underline'},
                ]}>
                Detalles del pedido
              </Text>
            </TouchableOpacity>
            

            <View style={[CommonStyles.flexDirectionRow, styles.mbTen]}>
              <CustomText text="Imagen" />
              <CustomText text="Nombre" />
              <CustomText text="Precio" />
              <CustomText text="Cant." />
            </View>
            <View>

              {
                order?.products.map((item) => (
                  <View key={item._id} >
                    <OrderProductItemComponent
                      productName={item?.name}
                      productPrice={item?.price}
                      qtyOrdered={item?.quantity}
                      img={item?.productImg}
                    />
                  </View>
                  
                ))
              }
            </View>

            <View style={[styles.grandTotal]}>
              <Text style={[CommonStyles.fontFamily, styles.customerHeading]}>
                Total: MXN {moneda(order?.total_amount)}
              </Text>
            </View>
            {
              order?.storePickup ? (

                <View>

                  {isProcessing ? (
                    <ButtonComponent
                      margin={20}
                      colorB={Colors.terciarySolid}
                      buttonText={isProcessing ? '¿Paquete empacado?' : ''}
                      handlePress={updateOrderStatusPickup}
                      width={width - 60}
                    />
                  ) : !isParcel ? (
                    <ButtonComponent
                    buttonText={'¿Paquete entregado?'}
                    // width={width - 20}
                    colorB={Colors.brightBlue}
                    borderRadius={10}
                    margin={10}
                    handlePress={()=>securityCodeModalRef?.current?.open()}
                    padding={10}
                  />
                  ):(
                    <View></View>
                  )
                }
                </View>


              ):(
              <View>
                {isProcessing ? (
                  <ButtonComponent
                    margin={20}
                    colorB={Colors.terciarySolid}
                    buttonText={isProcessing ? '¿Paquete empacado?' : ''}
                    handlePress={updateOrderStatus}
                    width={width - 60}
                  />
                ) : (
                  <View
                    style={{
                      width: '90%',
                    }}>
                    {rideRequets?.length > 0 || orderStatus != 'PACKED' ? null : (
                      <Text>
                        Los riders están viendo sus pedidos, le enviarán un viaje
                        peticiones.
                      </Text>
                    )}
                  </View>
                )}
              </View>
              )
            }

            {rideRequets?.length > 0 && orderStatus == 'PACKED' ? (
              <Text style={{...CommonStyles.fontFamily, paddingVertical: 10}}>
                Rider Requests
              </Text>
            ) : null}
                        {
              rideRequets.map((item) => (
                <View key={item._id} > 
                  <View
                  style={{
                    width: '95%',
                    minHeight: 100,
                    backgroundColor: 'white',
                    elevation: 5,
                    alignSelf: 'center',
                    margin: 5,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={{
                        uri: `https://t4.ftcdn.net/jpg/03/36/59/07/360_F_336590777_ndbGZFO887CzLwlikwnPFybD3acfz17d.jpg`,
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 40 / 2,
                        paddingLeft: 5,
                        left: 10,
                      }}
                    />
                    <View style={{paddingLeft: 10, margin: 10}}>
                      <Text>{item?.rider?.riderName}</Text>
                      <Text>{item?.rider?.email}</Text>
                      <Text>{item?.rider?.phone_number}</Text>
                    </View>
                    <View></View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'flex-end',
                      margin: 10,
                    }}>
                    {/* <TouchableOpacity style={{width:25,marginHorizontal:5,height:25,borderWidth:1,borderColor:'red',backgroundColor:'red',borderRadius:25/2,justifyContent:'center',alignItems:'center'}}>
                     <AntDesign name='delete' color='white' size={15}/>
                   </TouchableOpacity> */}
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Asignación de repartidor',
                          '¿Quieres asignar este repartidor a la orden?',
                          [
                            {
                              text: 'No',
                            },
                            {
                              text: 'Si',
                              onPress: () =>
                                AcceptRide(item?.rider?._id, item?._id),
                            },
                          ],
                        );
                      }}
                      style={{
                        width: 25,
                        marginHorizontal: 5,
                        height: 25,
                        borderWidth: 1,
                        borderColor: '#0bda51',
                        backgroundColor: '#0bda51',
                        borderRadius: 25 / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Entypo name="check" color="white" size={15} />
                    </TouchableOpacity>
                  </View>
                </View>
              
                </View>
              ))
            }
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  orderDetailsContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    margin: SCREEN_HORIZONTAL_MARGIN,
  },
  estado:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    width: '100%',
    paddingTop: 10,
  
  },
  imageContainer: {
    flex: 1,
  },
  imageStyles: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  customerDataContainer: {
    flex: 3,
    marginBottom: 10,
  },
  customerHeading: {
    fontSize: adjust(15),
    
  },
  customerSubText: {
    opacity: 0.5,
    marginBottom: 10,
  },
  flex1: {
    flex: 1,
    fontSize:adjust(10)
  },
  mbTen: {marginBottom: 15},
  grandTotal: {
    alignItems: 'flex-end',
  },
});


export default VendorOrderDetailsScreen;
