import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet,  ScrollView, Platform } from 'react-native';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import CommonStyles from '../../../util/styles/styles';
import ProductCardComponent from '../../../components/customer-components/product-card.component';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants';
import * as CartActions from '../../../util/ReduxStore/Actions/CustomerActions/CartActions';
import {  customer_api_urls, vendor_api_urls } from '../../../util/api/api_essentials';

import {  deviceHeight, deviceWidth } from '../../../util/Dimentions';
import { getUserId } from '../../../util/local-storage/auth_service';

import { ExploreScreen } from '.././Cart/ExploreScreen';
import Colors from '../../../util/styles/colors';
import { Box, Checkbox, HStack, VStack } from 'native-base';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import AddressFormatted from '../../../components/AddressFormatted';


export const CartScreen = (props) => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.cart.cart_items);
  const totalAmount = useSelector(state => state.cart.total_amount);
  const descuento = useSelector(state => state.cart.descuento);
  const idDesc = useSelector(state => state.cart.idDesc);
  const businessId = useSelector(state => state?.cart?.businessId);
  const [direccion, setDireccion] = useState({
    long: 0,
    lat: 0,
    label: ''
  })
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [comission, setComission] = useState();
  const [delivery_fee, setDeliveryFee] = useState(null);
  const [totalDeliveryFee, setTotalDeliveryFee] = useState(0);
  const [tempTotalDeliveryFee, setTempTotalDeliveryFee] = useState(null)
  const [billComission, setBillComission] = useState()
  const [deliveryDistance, setDeliveryDistance] = useState(null);
  const [tempDeliveryDistance, setTempDeliveryDistance] = useState(null)
  const [isLogin, setIsLogin] = useState(false)
  let businessIds = [];
  const address = useSelector( state => state.user.address );
  const [pickup, setPickup] = useState(false)

 

  const goDirecctions = () => {
    props.navigation.navigate('Mi dirección')
  }
  useEffect(() => {
    
    fetchBusinessDetails()
  
  }, [])

  useEffect(async () => {
    let abortController = new AbortController();
    const user = await getUserId();
    setIsLogin(user)
    getComision();
    if (user) {
      getAddresses(user);
    }

    return () => {
      abortController.abort();
    }

  }, [isLogin])


  const getComision = async () => {
    try {


      const getFee = await axios.get(customer_api_urls?.get_fees);

      setBillComission(getFee.data.data[0]?.besseri_comission);

    } catch (e) {
      // //console.log({error:e})

      showToaster('Error')
    }
  }

  const getAddresses = async (userID) => {

    // try {

    //   const apiCall = await axios.get(`${customer_api_urls.get_addresses}/${userID}`);

    //   if (apiCall.status == api_statuses.success) {
    //     setDireccion({
    //       long: apiCall.data.data[0].longitude,
    //       lat: apiCall.data.data[0].latitude,
    //       label: apiCall.data.data[0].label
    //     });
    //   } else {
    //     showToaster('Error para obtener su direccion :/');
    //     setDireccion(false);
    //   }
    // } catch (e) {
    //   // //console.log({error:e})
    //   setDireccion(false);
    //   showToaster('Crea una direccion para poder realizar tu compra')
    // }
  }



  const fetchBusinessDetails = async () => {
    try {
     
      const getBusinessDetails = await axios.post(vendor_api_urls?.get_multiple_stores, {
        businessIds: [businessId]
      });
      setBusinessProfiles(getBusinessDetails.data.data);

      return getBusinessDetails.data.data
      
    } catch (e) {
      props.navigation.goBack()
      showToaster('Algo salió mal,intentalo mas tarde.');
    }
  }

  const calculateDelivery = async() => {
    let vendor = businessProfiles;
    if (businessProfiles.length <= 0) {
      vendor = await fetchBusinessDetails()
      
    }

    const distance = Math.sqrt(
      Math.pow(69.1 * (Number(vendor[0]?.location?.latitude) - [address.latitude]), 2) +
      Math.pow(69.1 * ([address?.longitude] - Number(vendor[0]?.location?.longitude)) * Math.cos(Number(vendor[0]?.location?.latitude) / 57.3), 2));
      
      
    
      let dis = Math.round(distance)
      let del = Math.round(distance) * delivery_fee
    
      setTotalDeliveryFee(del);
    
      setDeliveryDistance(dis);
      return {
        distancia: dis,
        delivery: del
      }
    
     
    

     
  }




  const goPurchase = () => {
    // console.log(pickup);

    if (isLogin) {
      if (!direccion) {
        showToaster('Crea una direccion para poder realizar tu compra')
        return
      }
     

      if (businessProfiles[0]?.wallet_id && !businessProfiles[0]?.isBlocked) {
        let allProducts = products?.filter(prod => prod?.business_id == businessProfiles[0]?._id);
        let totalProductsPrice = [];

      
        for (var a = 0; a < allProducts?.length; a++) {
          let precio =((totalDeliveryFee + Number(allProducts[a]?.price) + comission * Number(allProducts[a]?.price) / 100 - descuento ) * allProducts[a]?.quantity).toFixed(2) 
          
          
          totalProductsPrice.push(
            {
              precio:((totalDeliveryFee + Number(allProducts[a]?.price) + comission * Number(allProducts[a]?.price) / 100 - descuento ) * allProducts[a]?.quantity).toFixed(2) ,
              ...allProducts[a]
            }
          )
        }
        let subtotal = totalAmount;
        props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.PAGO, {
          deliveryDistance: deliveryDistance,
          storeId: businessProfiles[0]?._id,
          products: allProducts,
          business: businessProfiles[0],
          totalAmount: (totalDeliveryFee + totalAmount + comission * totalAmount / 100 - descuento ).toFixed(2),
          comission: Math.round((comission * subtotal) / 100),
          delivery_fee: delivery_fee,
          subtotal: Math.round(totalAmount),
          comision: comission,
          cupon: idDesc,
          descuento,
          envio:totalDeliveryFee,
          pickup:pickup,
          address,
          totalProductsPrice
        })
      } else {
        showToaster('No puedes hacer pedidos en esta tienda en este momento.')

      }
    } else {

      // props.navigation.navigate('AuthStack',{customer:true})
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR)
    }
  }
  
  const servicioValet = async(value) => {
    setPickup(value)
   
   
    if (value ) {
      calculateDelivery()
      
    }else{
      setTotalDeliveryFee(0);
    }
  }




  const fetchFees = async () => {
    try {

      const getFee = await axios.get(customer_api_urls?.get_fees);
      // //console.log(getFee.data)
      setComission(getFee.data.data[0]?.besseri_comission);
      setDeliveryFee(getFee.data.data[0]?.delivery_fee);
    } catch (e) {
      // //console.log(e?.response);
      showToaster('something went wrong');
    }
  }
  useEffect(() => {
    let abortController = new AbortController();
    fetchFees();
    return () => {
      abortController.abort();
    }
  }, []);

  useEffect(() => {
    let abortController = new AbortController();

    for (var a = 0; a < products?.length; a++) {
      if (businessIds?.includes(products[a]?.business_id)) {
        return;
      } else {
        businessIds?.push(products[a]?.business_id);
      }
    }
    return () => {
      abortController.abort();
    }

  }, [products])

  
  useEffect(() => {
    if (businessProfiles.length > 0 && delivery_fee) {
      // calculateDelivery()
    }
   
  }, [businessProfiles,delivery_fee,tempDeliveryDistance,tempTotalDeliveryFee])
  



  const increaseQuantity = (id, price) => {
    dispatch(CartActions.increaseQuantity(id, price));
  }
  const decreaseQuantity = (id, price) => {

    dispatch(CartActions.decreaseQuantity(id, price));
  }
  const removeItemFromCart = (id) => {
    dispatch(CartActions.deleteItemFromCart(id));

  }

  const DetailItem = ({ label, value, distance, distanceLabel }) => {
    return (
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between',marginVertical:2 }}>
        <View>
          <Text style={{ ...CommonStyles.h3, color: Colors.black, fontWeight: 'bold' }}>{label}</Text>
        
        </View>
        <Text style={{ ...CommonStyles.h3, color: Colors.black, fontWeight: 'bold' }}>{value}</Text>
      </View>
    )
  }

  
 
  
  
  return (
    <VStack alignItems={'center'} style={{ ...CommonStyles.screenWhiteY }} >
      {
        products.length == 0 ?
          (
            <ExploreScreen {...props} />
          )
          :
          <>


            <ScrollView >
              <View style={{ width: deviceWidth, marginTop: 20 }} >
                {
                  products.map((item) => (
                    <View key={item._id}  >
                      <ProductCardComponent
                        onRemoveFromCart={() => removeItemFromCart(item?._id)}
                        cartProduct={true}
                        data={item}
                        increaseQuantity={() => increaseQuantity(item._id, item.price)}
                        decreaseQuantity={() => decreaseQuantity(item?._id, item.price)}
                        comision={comission}
                      />
                    </View>
                  ))
                }
              </View>
            </ScrollView>
          </>

      }




      {
        !(totalAmount + (billComission * totalAmount / 100) - descuento) ? (
          <View />
        ) : (
          <View style={styles.detailCard}>       

            <Box>
              <DetailItem
                label={'SUBTOTAL'}
                value={`$${(totalAmount + comission * totalAmount / 100 - descuento).toFixed(2)} MXN`}
              />

            {   
              pickup ? (
                <DetailItem
                label={'COSTO VALET'}
                value={`$${totalDeliveryFee} MXN`}
              />
              ): <DetailItem label={'COSTO VALET'} value={'Recoger en tienda'} />
            }

              <DetailItem
                label={'TOTAL'}
                value={`$${(totalDeliveryFee + totalAmount + comission * totalAmount / 100 - descuento ).toFixed(2)} MXN`}
              />
            </Box>


            <HStack justifyContent={'space-between'} mt={'10px'} >
              <Checkbox
                value="test"
                accessibilityLabel="Valet"
                onChange={(value) => {
                 
                  servicioValet(value)
                }}
                backgroundColor={Colors.white}
              >


              </Checkbox>
              <Text style={{ ...CommonStyles.h2, color: Colors.black }} >
                Seleccionar servicio de VALET
              </Text>
            </HStack>

            {
              pickup ? (
                <Box backgroundColor={Colors.bgColor}  rounded={'lg'} p={'10px'} mt={'10px'} >
                  <AddressFormatted
                  address={address?.formatted_address}
                  />
                </Box>
              ):(
                <Box p={'10px'} mt={'10px'} space={2} ></Box>
              )
            }
           


          </View>
        )
      }



      {
        products?.length > 0 ?
          <View style={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 9999 }}>
            <BtnPrincipal
              text={'Pagar'}
              onPress={goPurchase}
            />
          </View>
          : null
      }

      <View style={{ height: deviceHeight * 0.10, width: deviceWidth }} />



    </VStack>
  );
};


const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
    // backgroundColor: Colors.primaryColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  headerText: { ...CommonStyles.fontFamily, color: Colors.white, fontSize: 20 },
  detailCard: {
    width: '94%',
    backgroundColor: 'white',

    alignSelf: 'center',
    // marginTop: '10%',
    // padding: 20,
    marginBottom: 30
  }
})