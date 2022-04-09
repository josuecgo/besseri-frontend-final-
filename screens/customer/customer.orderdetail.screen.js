import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet , Alert, Image, useWindowDimensions,TouchableOpacity, ScrollView, Linking } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ButtonComponent from '../../components/button/button.component';
import OrderCard from '../../components/customer-components/ordercard.component';
import LoaderComponent from '../../components/Loader/Loader.component';
import { api_statuses, base_url, customer_api_urls } from '../../util/api/api_essentials';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import { getUserId } from '../../util/local-storage/auth_service';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AddressComponent from '../../components/customer-components/customer.addresscard.component';
import { ThinlineSeparator } from '../../components/CommonComponents';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import Entypo from 'react-native-vector-icons/Entypo'
import moment from 'moment';
const CustomerOrderDetail = (props) => {
    const {width,height} = useWindowDimensions()
  const [loading,setLoading] = useState(false);
  const {params} = useRoute();
  const [order,setOrder] = useState(params?.order);
  const address = params.order.delivery_address;
  const store = params.order.store;
  const totalAmount = parseInt(params.order.total_amount);

   
  const cancelOrder = async() => {
      try {
        setLoading(true);
       const apiCall = await axios.post(customer_api_urls?.cancel_order,{
           orderId:order?._id
       });
       setLoading(false);
       if(apiCall?.status == 200) {
         setOrder(apiCall?.data?.data);
         showToaster('Your order has been cancelled and amount has been refunded');
       }
      } catch(e) {
          setLoading(false);
         showToaster('Something went wrong, please try again');

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
        <View style={styles.header}>
            <TouchableOpacity 
            onPress={() => props?.navigation?.goBack()}
            style={{alignSelf:'flex-start'}}>
                <MaterialCommunityIcons
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
                <Text style={{...CommonStyles.fontFamily,fontSize:13,paddingLeft:12,color:Colors.white}}>{moment(params.order.ordered_on).format('DD-MM-YYYY hh:mm A')}</Text>
                </View>
            </View>
        </View>
        <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'white',paddingBottom:'20%'}}>
         <DetailItem
         label={'Order Status'}
         value={order?.order_status}
         orderStatus={true}
         />
        <Text style={{...CommonStyles.fontFamily,padding:10,marginTop:10,fontSize:13}}>Products Your Ordered</Text>
       <View>
       <View style={{width:'95%',minHeight:70,padding:5,padding:15,backgroundColor:Colors.lightPrimary,alignSelf:'center',marginVertical:20}}>
       <Text style={{...CommonStyles.fontFamily,color:'black',fontSize:30}}>{order?.delivery_security_code}</Text>
             <Text style={{color:'black',fontWeight:'300',fontSize:12,
            marginTop:10}}>You have to tell this code to rider when he delivers you an order, without telling this code to the rider you might not recieve parcel</Text>
      </View>
       <FlatList
        data={params.order.products}
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
     </View>    
     <ThinlineSeparator margin={20}/>    
       </View>
        <Text style={{...CommonStyles.fontFamily,padding:10,marginTop:10,fontSize:16}}>Delivery Address</Text>
        <AddressComponent
        label={address?.label}
        addressLine={address?.addressLine}
        info={address?.info}
        phone={address?.phone}
        />
        <ThinlineSeparator margin={20}/>
        <View>
        <View style={{flexDirection:'row',padding:19}}>
            <MaterialCommunityIcons name='cancel' color={Colors.red} size={20}/>
            <View>
            <Text style={{...CommonStyles.fontFamily,fontSize:15,paddingLeft:10}}>Order cancellation</Text>
            <Text style={{fontWeight:'300',padding:10}}>You can cancel any order when its in processing mode, once the order is packed or assigned to rider the order can not be cancelled and the amount can not be refunded then.</Text>
            {
                order?.order_status_code == 'PROCESSING' ?
                <TouchableOpacity
                onPress={() => {
                    Alert.alert('Order Cancellation','Do you really want to cancel this order?',
                    [
                        {
                            text:'No',
                        },
                        {
                            text:'Yes',
                            onPress:async() => {
                                await cancelOrder()
                            }
                        }
                    ]
                    )
                }}
                >
                <Text style={{color:Colors.red,paddingLeft:10}}>I want to cancel this order?</Text>
            </TouchableOpacity>
            :
            null
            }
            </View>

       </View>
        </View>
      <LoaderComponent isVisible={loading}/>
      
        </ScrollView>
        <View style={{...CommonStyles.flexDirectionRow,justifyContent:'space-around',backgroundColor:'transparent',position:'absolute',bottom:15}}>
            <ButtonComponent
            buttonText={'Invoice'}
            width={width / 2.2}
            colorB={Colors.primaryColor}
            borderRadius={10}
            margin={10}
            />
             <ButtonComponent
            buttonText={'Need Help?'}
            width={width / 2.2}
            colorB={Colors.primaryColor}
            borderRadius={10}
            margin={10}
            handlePress={() => {
                Linking.openURL(`mailto:${store?.email}`)
            }}
            />
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
export default CustomerOrderDetail;
