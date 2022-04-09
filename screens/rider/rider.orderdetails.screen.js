import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Image, useWindowDimensions,TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ButtonComponent from '../../components/button/button.component';
import OrderCard from '../../components/customer-components/ordercard.component';
import LoaderComponent from '../../components/Loader/Loader.component';
import { api_statuses, base_url, customer_api_urls, rider_api_urls } from '../../util/api/api_essentials';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import { getRiderId, getUserId } from '../../util/local-storage/auth_service';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AddressComponent from '../../components/customer-components/customer.addresscard.component';
import { RiderSecurityCodeModal, ThinlineSeparator } from '../../components/CommonComponents';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import Entypo from 'react-native-vector-icons/Entypo'
import moment from 'moment';
import MapView, { Marker } from 'react-native-maps';
import { reloadEarnings } from '../../util/ReduxStore/Actions/RiderActions/RiderActions';
import { useDispatch } from 'react-redux';
const RiderOrderDetail = (props) => {
    const dispatch = useDispatch();
    const {width,height} = useWindowDimensions()
  const [loading,setLoading] = useState(false);
  const [delivery_security_code,setDelivery_security_code] = useState('');
  const RiderSecurityCodeModalRef = useRef(null);
  const {params} = useRoute();
  const [order,setOrder] = useState(params?.order);
  const address = order.delivery_address;
  const user = order?.user;
  const store = order.store;
  const totalAmount = Number(order?.total_amount);

  const changeOrderStatus = async(orderStatus,orderStatusCode) => {
      try {  
          setLoading(true);
        const riderId = await getRiderId();
        const apiCall = await axios.patch(rider_api_urls.change_order_status,{
            status_code:orderStatusCode,
            status:orderStatus,
            riderId:riderId,
            orderId:order?._id,
            ...(orderStatusCode == 'PARCEL_DELIVERED' ? {delivery_security_code:delivery_security_code} : {})
        });
        setLoading(false);
        if(apiCall?.status == api_statuses.success) {
            showToaster('status changed successfully');
            setOrder(apiCall?.data?.data);
            if(apiCall?.data?.data?.order_status_code == 'PARCEL_DELIVERED') {
                dispatch(reloadEarnings());
            }
            console.log(apiCall?.data?.data)
        } else {
            showToaster('something went wrong please try again later')
        }

      } catch(e){
           setLoading(false);
           showToaster(e?.response?.data?.message ? e?.response?.data?.message : 'Something went wrong');
           console.log(e?.response?.data)
      }
  }

  const DetailItem = ({label,value,orderStatus}) => {
    return (
        <View style={{width:'100%',borderColor:Colors.dark,flexDirection:'row',justifyContent:'space-between',alignItems:'center',alignSelf:'center',padding:10}}>
            <Text style={{...CommonStyles.fontFamily,fontSize:13}}>{label}</Text>
            <Text style={{fontSize:16,...CommonStyles.fontFamily,color:orderStatus ? Colors.brightBlue : 'black'}}>{value}</Text>
        </View>
    )
}
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
        <LoaderComponent isVisible={loading}/>
        <RiderSecurityCodeModal
         RiderSecurityCodeModalRef={RiderSecurityCodeModalRef}
         securityCode={delivery_security_code}
         onChangeSecurityCode={(dc) => setDelivery_security_code(dc)}
        //  onClose={() => RiderSecurityCodeModalRef.current.close()}
         onProceed={() => {
             if(!delivery_security_code) {
                 showToaster('Please enter the delivery security code');
                 return;
             }
             if(delivery_security_code == order?.delivery_security_code) {
                Alert.alert('Parcel Delivered?','Have you delivered the parcel? going on will change the order status to order delivered.',
                [
                    {
                        text:'No'
                    },
                    {
                        text:'Yes,I have',
                        onPress:() => {
                            changeOrderStatus('Parcel Delivered','PARCEL_DELIVERED');
                            RiderSecurityCodeModalRef?.current?.close()
                        }
                    }
                ]
                )
             } else {
                 showToaster('you have entered invalid security code');
                 RiderSecurityCodeModalRef?.current?.close()
             }
            
         }}
        />
        <View style={styles.header}>
            <TouchableOpacity style={{alignSelf:'flex-start'}}>
                <MaterialCommunityIcons
                onPress={() => props.navigation.goBack()}
                name='keyboard-backspace'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            <View style={{...CommonStyles.flexDirectionRow,...CommonStyles.horizontalCenter,marginTop:10}}>
                <View style={{width:45,height:45,borderWidth:1,borderColor:Colors.white,backgroundColor:Colors.white,...CommonStyles.flexCenter,borderRadius:5}}>
               <Feather name='box' size={30} color={Colors.primaryColor}/>
                </View>
                <View>
                <Text style={styles.headerText}>Order #{order?.orderId}</Text>
                <Text style={{...CommonStyles.fontFamily,fontSize:13,paddingLeft:12,color:Colors.white}}>{moment(order.ordered_on).format('DD-MM-YYYY hh:mm A')}</Text>
                </View>
            </View>
        </View>
        <View style={{width:'95%',minHeight:70,padding:5,justifyContent:'center',alignItems:'center',backgroundColor:order?.order_status_code == 'PARCEL_DELIVERED' ? '#90ee90' : Colors.lightPink,alignSelf:'center',marginVertical:20}}>
          {
              order?.order_status_code == 'PARCEL_DELIVERED' ?
              <Text style={{...CommonStyles.fontFamily,color:'black'}}>You successfully delivered this on <Text style={{color:'green'}}>{moment(order?.delivered_on).format('dddd - MMMM - YYYY')}</Text></Text>
             :
             <Text style={{...CommonStyles.fontFamily,color:'black'}}>You have to deliver this order before or by <Text style={{color:'red'}}>{moment(order?.to_deliver_on).format('dddd - MMMM - YYYY')}</Text></Text>
          }
      </View>
        <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'white',paddingBottom:'20%'}}>
         <DetailItem
         label={'Order Status'}
         value={order?.order_status}
         orderStatus={true}
         />
         <ThinlineSeparator/>
        <Text style={{...CommonStyles.fontFamily,padding:10,marginTop:10,fontSize:13}}>Ordered Products</Text>
       <View>

    

       <FlatList
        data={order.products}
        keyExtractor={item => item?._id}
        renderItem={itemData => (
            <View style={{flexDirection:'row',width:'100%',alignSelf:'center',marginTop:'3%',borderBottomWidth:0.3,height:50,paddingHorizontal:10}}>
        <View style={{width:'65%',...CommonStyles.flexDirectionRow,...CommonStyles.horizontalCenter}}>
            <Image
            source={{uri:`${base_url}/${itemData.item.productImg}`}}
            style={{width:40,height:40,borderRadius:40/2}}
            />
            <Text style={{fontSize:14,fontWeight:'bold',paddingLeft:5}}>{itemData.item.name}</Text>
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
        <View>
           <DetailItem label={'Delivery Charges'} value={`${order?.delivery_fee} MXN`}/>
           <DetailItem label={'Besseri Charges'} value={`${order?.besseri_comission} MXN`}/>
           <DetailItem label={'Sub total'} value={`${order?.total_amount} MXN`}/>
           <DetailItem label={'Total Charges'} value={`${order?.total_amount} MXN`}/>
           <ThinlineSeparator/>
        </View>
   <View style={{width:'93%',alignSelf:'center',marginTop:'5%'}}>
         <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Seller info</Text>
         <View style={{width:'100%',margin:10,paddingVertical:14,backgroundColor:Colors.white,alignSelf:'center',borderColor:Colors.gray,borderWidth:1,borderRadius:10}}>
         <Text style={{fontSize:16,...CommonStyles.fontFamily,paddingLeft:25,marginBottom:10}}>{store?.storeName}</Text>
         <View style={{flexDirection:'row',alignItems:'center'}}>
         <Entypo
         name='location-pin'
         color={Colors.darkPink}
         size={30}
         />
         <Text style={{fontSize:13,width:'92%'}}>{store?.address}</Text>
         </View>
         </View>
         {
       store?.location?.latitude && store?.location?.longitude ? 
       <MapView
       style={{height:150,width:width - 40,alignSelf:'center'}}
       //specify our coordinates.
       initialRegion={{
         latitude: Number(store?.location?.latitude),
         longitude: Number(store?.location?.longitude),
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421,
       }}
     >
         <Marker
      coordinate={{
        latitude: Number(store?.location?.latitude),
         longitude: Number(store?.location?.longitude),
      }}
      title={`${store?.storeName}'s location`}
    />
       </MapView>
       :
       null
     }
     </View>    

        
       </View>
      {
          order?.order_status_code == 'PARCEL_DELIVERED' ?
           null:
           <View>
                <View style={{width:'93%',alignSelf:'center',marginTop:'5%'}}>
         <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Customer info</Text>
         <View style={{width:'100%',margin:10,paddingVertical:14,backgroundColor:Colors.white,alignSelf:'center',borderColor:Colors.gray,borderWidth:1,borderRadius:10}}>
         <Text style={{fontSize:16,...CommonStyles.fontFamily,paddingLeft:25,marginBottom:10}}>{user?.name}</Text>
         <View style={{flexDirection:'row',alignItems:'center'}}>
         <Entypo
         name='location-pin'
         color={Colors.darkPink}
         size={30}
         />
         <Text style={{fontSize:13,width:'92%'}}>{store?.address}</Text>
         </View>
         </View>
     </View>    
        <Text style={{...CommonStyles.fontFamily,padding:10,marginTop:10,fontSize:16}}>Delivery Address</Text>
        <AddressComponent
        label={address?.label}
        addressLine={address?.addressLine}
        info={address?.info}
        phone={address?.phone}
        />
        <ThinlineSeparator margin={20}/>
           </View>
      }
      <LoaderComponent isVisible={loading}/>
      
        </ScrollView>
        <View style={{...CommonStyles.flexDirectionRow,justifyContent:'space-around',backgroundColor:'transparent',position:'absolute',bottom:15}}>
           {
               order?.order_status_code == 'PARCEL_DELIVERED' ? 
               null :
               <ButtonComponent
               buttonText={order?.order_status_code == 'RIDER_ASSIGNED' ? 'Parcel Picked?' :order?.order_status_code == 'PARCEL_PICKED'  ? 'Out For Delivery' : order?.order_status_code == 'OUT_FOR_DELIVERY' ? 'Parcel Delivered?' : '' }
               width={width - 20}
               colorB={Colors.brightBlue}
               borderRadius={10}
               margin={10}
               handlePress={() => {
                  if(order?.order_status_code == 'RIDER_ASSIGNED') {
                   Alert.alert('Order Picked?','Have you picked the order? going on will change the order status to order picked.',
                   [
                       {
                           text:'No'
                       },
                       {
                           text:'Yes,I have picked',
                           onPress:() => {
                               changeOrderStatus('Order Picked','PARCEL_PICKED')
                           }
                       }
                   ]
                   )
                  } 
                  else if (order?.order_status_code == 'PARCEL_PICKED') {
                   Alert.alert('Out for delivery?','Are you out for delivery? going on will change the order status to order picked.',
                   [
                       {
                           text:'No'
                       },
                       {
                           text:'Yes,I am',
                           onPress:() => {
                               changeOrderStatus('Out for delivery','OUT_FOR_DELIVERY')
                           }
                       }
                   ]
                   )
                  }
                  else if(order?.order_status_code == 'OUT_FOR_DELIVERY') {
                   RiderSecurityCodeModalRef?.current?.open()
                  }
               }}
               />
           }
             {/* <ButtonComponent
            buttonText={'Need Help?'}
            width={width / 2.2}
            colorB={Colors.primaryColor}
            borderRadius={10}
            margin={10}
            handlePress={() => {
                Linking.openURL(`mailto:${store?.email}`)
            }}
            /> */}
        </View>  
    </View>
  );
};
const styles = StyleSheet.create({
  placeOrderText: { ...CommonStyles.fontFamily, fontSize: 20 },
  placeOrderTextDetail: { fontSize: 13, fontWeight: '300', width: '90%', alignSelf: 'center', textAlign: 'center', color: Colors.dark },
  placeOrderWrapper: { justifyContent: 'center', alignItems: 'center', bottom: 40 },
  header:{
    width:'100%',
    minHeight:110,
    backgroundColor:Colors.primaryColor,
    paddingHorizontal:20,
    justifyContent:'center'
},
headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20,paddingLeft:10},
})
export default RiderOrderDetail;
