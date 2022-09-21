import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, FlatList, ScrollView, Platform, Pressable } from 'react-native';
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommonStyles from '../../util/styles/styles';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import ButtonComponent from '../../components/button/button.component';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import { useDispatch, useSelector } from 'react-redux';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { api_statuses, base_url, customer_api_urls, vendor_api_urls } from '../../util/api/api_essentials';
import { Modalize } from 'react-native-modalize';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { deviceHeight, deviceWidth } from '../../util/Dimentions';
import { useLocation } from '../../hooks/useLocation';
import { getUserAddress, getUserId } from '../../util/local-storage/auth_service';
import { Cupon } from '../../components/Customer/Cupon';
import { descuento } from '../../util/helpers/Descuento';
import { ExploreScreen } from './Cart/ExploreScreen';
import { useCart } from '../../hooks/useCart';


const CustomerCartScreen = (props) => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.cart.cart_items);
  const totalAmount = useSelector(state => state.cart.total_amount);
  const descuento = useSelector(state => state.cart.descuento);
  const idDesc = useSelector(state => state.cart.idDesc);
  const businessId = useSelector(state => state?.cart?.businessId);
  const [direccion, setDireccion] = useState({
    long:0,
    lat:0,
    label:''
  })
  // const {totalAmount} = useCart()
  const businessSelectRef = useRef();
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [comission, setComission] = useState();
  const [delivery_fee, setDeliveryFee] = useState();
  const [totalDeliveryFee, setTotalDeliveryFee] = useState(null);
  const [billComission, setBillComission] = useState()
  const [deliveryDistance,setDeliveryDistance] = useState(null);
  const [isLogin , setIsLogin  ] = useState(false)
  let businessIds = [];
  const {cupon} = useCart()

 
  useEffect(async() => {
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


  const getComision = async() => {
    try {
      
     
      const getFee = await axios.get(customer_api_urls?.get_fees);
      
      setBillComission(getFee.data.data[0]?.besseri_comission); 

    } catch(e) 
    { 
        console.log({error:e})
        
        showToaster('Error')
    }
  }
  
  const getAddresses = async(userID) => {
    
    try {
      
      const apiCall = await axios.get(`${customer_api_urls.get_addresses}/${userID}`);
     
      if(apiCall.status == api_statuses.success) {
          setDireccion({
            long:apiCall.data.data[0].longitude,
            lat:apiCall.data.data[0].latitude,
            label:apiCall.data.data[0].label
          });
      } else {
          showToaster('Error para obtener su direccion :/')
      }
    } catch(e) 
    { 
        console.log({error:e})
        
        showToaster('Recuerde que para comprar necesitas tener dada de alta tu direccion ')
    }
  }
  


  const fetchBusinessDetails = async () => {
    try {
      console.log(businessId);
      const getBusinessDetails = await axios.post(vendor_api_urls?.get_multiple_stores, {
        businessIds: [businessId]
      });
      setBusinessProfiles(getBusinessDetails.data.data);
      calculateDelivery()
    } catch (e) {
      console.log(e?.response);
      showToaster('Algo salió mal');
    }
  }
  
  const calculateDelivery = () => {
    
    const distance = Math.sqrt(
      Math.pow(69.1 * (Number(businessProfiles[0]?.location?.latitude) - [direccion?.lat]), 2) +
      Math.pow(69.1 * ([direccion?.long] - Number(businessProfiles[0]?.location?.longitude)) * Math.cos(Number(businessProfiles[0]?.location?.latitude) / 57.3), 2));
    
    setTotalDeliveryFee(Math.round(distance) * delivery_fee);
    setDeliveryDistance(Math.round(distance));
  }

  
  const goPurchase = () => {
    if (isLogin) {
      if(businessProfiles[0]?.wallet_id && !businessProfiles[0]?.isBlocked) {
        let allProducts = products?.filter(prod => prod?.business_id == businessProfiles[0]?._id);
        let totalProductsPrice = 0;
        for (var a = 0; a < allProducts?.length; a++) {
          totalProductsPrice += allProducts[a]?.price * allProducts[a]?.quantity
        }
        let subtotal = totalAmount ;
        props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ENVIO, {
          deliveryDistance:deliveryDistance,
          storeId: businessProfiles[0]?._id,
          products: allProducts,
          business: businessProfiles[0],
          totalAmount: Math.round(totalProductsPrice + Math.round((Number(comission) * Number(subtotal)) / 100)),
          comission:Math.round((Number(comission) * Number(subtotal)) / 100),
          delivery_fee:delivery_fee,
          subtotal:subtotal,
          comision:comission,
          cupon:idDesc,
          descuento
        })
       } else {
         showToaster('No puedes hacer pedidos en esta tienda en este momento.')
         
       }
    } else {
      props.navigation.navigate('LSFS',{customer:true})
    }
  }


   

  useEffect(() => {
    let abortController = new AbortController();
    if(businessProfiles && delivery_fee) {
      calculateDelivery()
    }
    return () => {  
      abortController.abort();  
    } 
  },[businessProfiles,delivery_fee,direccion])

  const fetchFees = async () => {
    try {
      
      const getFee = await axios.get(customer_api_urls?.get_fees);
      // console.log(getFee.data)
      setComission(getFee.data.data[0]?.besseri_comission);
      setDeliveryFee(getFee.data.data[0]?.delivery_fee);
    } catch (e) {
      console.log(e?.response);
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
    let abortController = new AbortController();
    fetchBusinessDetails()
    return () => {  
      abortController.abort();  
    } 
  }, [businessId]);

  const increaseQuantity = (id, price) => {
    dispatch(CartActions.increaseQuantity(id, price));
  }
  const decreaseQuantity = (id, price) => {
    dispatch(CartActions.decreaseQuantity(id, price));
  }
  const removeItemFromCart = (id) => {
    dispatch(CartActions.deleteItemFromCart(id));

  }
  const DetailItem = ({ label, value,distance,distanceLabel }) => {
    return (
      <View style={{ width: '100%', height: 60, borderBottomWidth: label == 'Total Charges' ? 0 : 0.3, borderColor: Colors.dark, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', padding: 12 }}>
        <View>
        <Text style={{ ...CommonStyles.fontFamily, fontSize: 16 }}>{label}</Text>
       {
         distance ? 
         <Text style={{ fontWeight:'300', fontSize: 13 }}>{distanceLabel}</Text>
         :
         null

       }
        </View>
        <Text style={{ fontSize: 16 }}>{value}</Text>
      </View>
    )
  }
 
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Modalize adjustToContentHeight ref={businessSelectRef}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 20, ...CommonStyles.fontFamily }}>¿De qué tienda quieres hacer el pedido?</Text>
          <Text style={{ fontSize: 13, marginVertical: 5, fontWeight: '300', color: 'black' }}>Ha seleccionado productos de estas tiendas, seleccione primero el que desea continuar.</Text>

          <FlatList
            data={businessProfiles}
            keyExtractor={item => item?._id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  if (item?.wallet_id) {
                    let allProducts = products?.filter(prod => prod?.business_id == item?._id);
                    let totalProductsPrice = 0;
                    for (var a = 0; a < allProducts?.length; a++) {
                      totalProductsPrice += allProducts[a]?.price * allProducts[a]?.quantity
                    }
                    businessSelectRef?.current?.close()
                    props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_SUMMARY, {
                      deliveryDistance:deliveryDistance,
                      storeId: item?._id,
                      products: allProducts,
                      business: item,
                      totalAmount: Math.round(totalProductsPrice + Math.round((Number(comission) * Number(totalAmount)) / 100) + Math.round(totalDeliveryFee)),
                      comission:Math.round((Number(comission) * Number(totalAmount)) / 100),
                      delivery_fee:Math.round(totalDeliveryFee),
                      subtotal:totalAmount,
                    })
                  } else {
                    showToaster('Esta tienda no ha configurado su cuenta correctamente, por lo que no será posible realizar pedidos desde aquí.')
                  }
                }}
                style={{ flexDirection: 'row', backgroundColor: 'white', padding: 10, elevation: 2, alignItems: 'center', width: '95%', alignSelf: 'center', marginVertical: 10 }}>
                <Image
                  source={{ uri: `${base_url}/${item?.logo}` }}
                  style={{
                    width: 35,
                    height: 35,
                    borderWidth: 1,
                    borderRadius: 35 / 2
                  }}
                />
                <View style={{ width: '90%' }}>
                  <Text style={{ ...CommonStyles.fontFamily }}>{item?.storeName}</Text>
                  <Text>{item?.email}</Text>
                  <Text>{item?.address}</Text>
                </View>
              </Pressable>
            )}
          />

        </View>
      </Modalize>
      {
        products.length == 0 ?
         (
          <ExploreScreen {...props} />
         )
          :
          <>
          <HeaderBackground/>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <MaterialCommunityIcons
                  name='keyboard-backspace'
                  color={Colors.white}
                  size={25}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Tu Carrito de compras</Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(CartActions.resetCart())
                }}
              >
                <AntDesign
                  name='delete'
                  color={Colors.white}
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <View>

            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>



              <ScrollView horizontal >
                <View style={{flexDirection:'row'}} >
                {
                    products.map((item) => (
                      <View key={item._id}  >
                        <ProductCardComponent
                        onRemoveFromCart={() => removeItemFromCart(item?._id)}
                        cartProduct={true}
                        data={item}
                        increaseQuantity={() => increaseQuantity(item._id,item.price)}
                        decreaseQuantity={() => decreaseQuantity(item?._id,item.price)}
                        comision={comission}
                        />
                      </View>
                    ))
                  }
                </View>

                
              </ScrollView>
             
             {
              !(totalAmount + (billComission * totalAmount / 100) - descuento)  ? (
                <View/>
              ):(
                <View style={styles.detailCard}>
                  
                  <Cupon  />
                 
                  
                  <DetailItem 
                  label={'Total'}  
                  value={ `${totalAmount + (billComission * totalAmount / 100) - descuento} MXN`} 
                  />
                  {/* <DetailItem label={'Total Charges'} value={`${Math.round(totalAmount + totalDeliveryFee + (Number(comission) * Number(totalAmount)) / 100)} MXN`} /> */}
                  <Text style={{margin:5}}>Se aplicarán gastos de envío en función del número de kilómetros</Text>
                </View>
              )
             }
            </ScrollView>
          </>

      }

      
     {
       products?.length > 0 ?
       <View style={{ position: 'absolute', bottom: 0, width: '100%',zIndex:9999 }}>
       <ButtonComponent
         buttonText={'Ordenar ahora'}
         colorB={Colors.terciarySolid}
         borderRadius={0}
         handlePress={goPurchase}
       />
     </View>
     :
     null
     }

    <View style={{height:deviceHeight * 0.10 ,width:deviceWidth}} />
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    width: '100%',
    height:Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
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
    elevation: 5,
    alignSelf: 'center',
    // marginTop: '10%',
    padding: 20,
    marginBottom: 10
  }
})

export default CustomerCartScreen;
