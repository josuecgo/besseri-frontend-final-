import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, FlatList, ScrollView, Alert, Pressable } from 'react-native';
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
import { base_url, customer_api_urls, vendor_api_urls } from '../../util/api/api_essentials';
import { Modalize } from 'react-native-modalize';
const CustomerCartScreen = (props) => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.cart.cart_items);
  const totalAmount = useSelector(state => state.cart.total_amount);
  const businessId = useSelector(state => state?.cart?.businessId);
  const [location, setLocation] = useState({
    latitude: 25.3960,
    longitude: 68.3578
  });
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [comission, setComission] = useState();
  const [delivery_fee, setDeliveryFee] = useState();
  const [totalDeliveryFee, setTotalDeliveryFee] = useState(null);
  const [billComission, setBillComission] = useState()
  const [deliveryDistance,setDeliveryDistance] = useState(null);
  let businessIds = [];
  const fetchBusinessDetails = async () => {
    try {
      console.log(businessIds)
      const getBusinessDetails = await axios.post(vendor_api_urls?.get_multiple_stores, {
        businessIds: [businessId]
      });
      setBusinessProfiles(getBusinessDetails.data.data);
      calculateDelivery()
    } catch (e) {
      console.log(e?.response);
      showToaster('something went wrong');
    }
  }
  const calculateDelivery = () => {
    const distance = Math.sqrt(
      Math.pow(69.1 * (Number(businessProfiles[0]?.location?.latitude) - [location?.latitude]), 2) +
      Math.pow(69.1 * ([location?.longitude] - Number(businessProfiles[0]?.location?.longitude)) * Math.cos(Number(businessProfiles[0]?.location?.latitude) / 57.3), 2));
    setTotalDeliveryFee(Math.round(distance) * delivery_fee);
    setDeliveryDistance(Math.round(distance));
  }
  useEffect(() => {
    if(businessProfiles && delivery_fee) {
      calculateDelivery()
    }
  },[businessProfiles,delivery_fee])

  const fetchFees = async () => {
    try {
      console.log(businessIds)
      const getFee = await axios.get(customer_api_urls?.get_fees);
      console.log(getFee.data)
      setComission(getFee.data.data[0]?.besseri_comission);
      setDeliveryFee(getFee.data.data[0]?.delivery_fee);
    } catch (e) {
      console.log(e?.response);
      showToaster('something went wrong');
    }
  }
  useEffect(() => {
    fetchFees();
  }, []);
  useEffect(() => {
    for (var a = 0; a < products?.length; a++) {
      if (businessIds?.includes(products[a]?.business_id)) {
        return;
      } else {
        businessIds?.push(products[a]?.business_id);
      }
    }

  }, [products])
  useEffect(() => {
    fetchBusinessDetails()
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
  const businessSelectRef = useRef();
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Modalize adjustToContentHeight ref={businessSelectRef}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 20, ...CommonStyles.fontFamily }}>Which store do you want to order from?</Text>
          <Text style={{ fontSize: 13, marginVertical: 5, fontWeight: '300', color: 'black' }}>You have selected products from these stores, select the one which you want to go on with at first.</Text>

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
                    showToaster('This store hasnt setup their account properly, so it will not be possible to order from here.')
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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              width: 200,
              height: 200,
              borderWidth: 1,
              borderColor: Colors.lightPrimary,
              backgroundColor: Colors.lightPrimary,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 200 / 2
            }}>
              <FontAwesome5 name='shopping-cart' color={Colors.primaryColor} size={70} />
            </View>
            <Text style={{ ...CommonStyles.fontFamily, fontSize: 25, color: Colors.primaryColor }}>There is nothing in :/</Text>
            <Text style={{ ...CommonStyles.fontFamily, color: 'grey', marginVertical: 5 }}>Explore products and add them in cart</Text>
            <ButtonComponent
              buttonText={'Explore'}
              colorB={Colors.primaryColor}
              borderRadius={10}
              width={200}
              margin={20}
              handlePress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)}
            />
          </View>
          :
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <MaterialCommunityIcons
                  name='keyboard-backspace'
                  color={Colors.white}
                  size={25}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Shopping Cart</Text>
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

            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>



              <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                <View>
                  <FlatList
                    horizontal
                    contentContainerStyle={{ marginTop: '6%', marginLeft: '2%' }}
                    data={products}
                    renderItem={itemData => (
                      <ProductCardComponent
                        onRemoveFromCart={() => removeItemFromCart(itemData?.item?._id)}
                        cartProduct={true}
                        data={itemData.item}
                        increaseQuantity={() => increaseQuantity(itemData.item._id, itemData.item.price)}
                        decreaseQuantity={() => decreaseQuantity(itemData.item?._id, itemData.item.price)}
                      />
                    )}
                  />
                </View>

                <View style={styles.detailCard}>
                  <DetailItem label={'Commission'} value={`${(Number(comission) * Number(totalAmount)) / 100} MXN`} />
                  {/* <DetailItem label={'Delivery Charges'} distance={true} distanceLabel={`${deliveryDistance} km away`} value={`${Math.round(totalDeliveryFee)} MXN`} /> */}
                  <DetailItem label={'Products Charges'} value={`${totalAmount} MXN`} />
                  {/* <DetailItem label={'Total Charges'} value={`${Math.round(totalAmount + totalDeliveryFee + (Number(comission) * Number(totalAmount)) / 100)} MXN`} /> */}
                  <Text style={{margin:5}}>Delivery charges will be applied depending on the number of kilometers</Text>
                </View>
              </ScrollView>

            </ScrollView>
          </>

      }
     {
       products?.length > 0 ?
       <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
       <ButtonComponent
         buttonText={'Order Now'}
         colorB={Colors.brightBlue}
         borderRadius={0}
         handlePress={() => {
          if(businessProfiles[0]?.wallet_id && !businessProfiles[0]?.isBlocked) {
           let allProducts = products?.filter(prod => prod?.business_id == businessProfiles[0]?._id);
           let totalProductsPrice = 0;
           for (var a = 0; a < allProducts?.length; a++) {
             totalProductsPrice += allProducts[a]?.price * allProducts[a]?.quantity
           }
           props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_SUMMARY, {
             deliveryDistance:deliveryDistance,
             storeId: businessProfiles[0]?._id,
             products: allProducts,
             business: businessProfiles[0],
             totalAmount: Math.round(totalProductsPrice + Math.round((Number(comission) * Number(totalAmount)) / 100)),
             comission:Math.round((Number(comission) * Number(totalAmount)) / 100),
             delivery_fee:delivery_fee,
             subtotal:totalAmount,
           })
          } else {
            showToaster('You cant order from this store at the moment.')
          }
         }}
       />
     </View>
     :
     null
     }
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 80,
    backgroundColor: Colors.primaryColor,
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
    marginTop: '10%',
    padding: 20,
    marginBottom: 10
  }
})

export default CustomerCartScreen;
