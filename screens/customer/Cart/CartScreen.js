import { Text, TouchableOpacity, View, StyleSheet, Image, FlatList, ScrollView, Platform, Pressable } from 'react-native';
import React, {  useEffect, useRef, useState} from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import { useCart } from '../../../hooks/useCart'
import { useCostos } from '../../../hooks/useCostos'
import { useLocation } from '../../../hooks/useLocation'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { Modalize } from 'react-native-modalize'
import CommonStyles from '../../../util/styles/styles';
import { ExploreScreen } from './ExploreScreen';

export const CartScreen = (props) => {
    const {products,businessProfiles,businessId} = useCart();
    const {comision,deliveryFee} = useCostos();
    const {userLocation} = useLocation();
    const businessSelectRef = useRef();
    let businessIds = [];
    console.log(businessProfiles);


    const goPurchase = () => {
        if (isLogin) {
          if(businessProfiles[0]?.wallet_id && !businessProfiles[0]?.isBlocked) {
            let allProducts = products?.filter(prod => prod?.business_id == businessProfiles[0]?._id);
            let totalProductsPrice = 0;
            for (var a = 0; a < allProducts?.length; a++) {
              totalProductsPrice += allProducts[a]?.price * allProducts[a]?.quantity
            }
            let subtotal = descuento(totalAmount);
    
            props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ENVIO, {
              deliveryDistance:deliveryDistance,
              storeId: businessProfiles[0]?._id,
              products: allProducts,
              business: businessProfiles[0],
              totalAmount: Math.round(totalProductsPrice + Math.round((Number(comission) * Number(subtotal)) / 100)),
              comission:Math.round((Number(comission) * Number(subtotal)) / 100),
              delivery_fee:delivery_fee,
              subtotal:subtotal,
              comision:comission
            })
           } else {
             showToaster('No puedes hacer pedidos en esta tienda en este momento.')
             
           }
        } else {
          props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR)
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
      
    
      return () => {
        
      }
    }, [])
    
    
    return (
        <>
        <HeaderTitle 
        titulo={'Tu carrito de compras'}
        nav={()=> props.navigation.goBack()}
        iconName='keyboard-backspace' 
        />
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
          products.length == 0 ? (
            <ExploreScreen/>
          ):(
            <></>
          )

        }

        </>
    )
}


const styles = StyleSheet.create({

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