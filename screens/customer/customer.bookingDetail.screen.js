import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, useWindowDimensions,TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
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
const CustomerBookingDetail = (props) => {
    const {width,height} = useWindowDimensions()
  const [loading,setLoading] = useState(false);
  const {params} = useRoute();
  const store = params.booking.store;
  const totalAmount = Number(params.booking.total_amount);
  const [booking,setBooking] = useState(params.booking);
  const cancelAppointment = async() => {
      try {
          setLoading(true);
        const apiCall = await axios.post(customer_api_urls.cancel_booking,{
            booking_id:booking?._id
        });
        setLoading(false);
        if(apiCall.status == api_statuses.success) {
            setBooking(apiCall.data.data[0]);
            showToaster('Your booking has been cancelled and amount has been refunded')
        } else {
            showToaster('Something went wrong');
        }
      } catch(e) {
          setLoading(false);
          showToaster('Something went wrong');
          console.log(e.response)
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
                <Text style={styles.headerText}>#{booking?.bookingId}</Text>
                <Text style={{...CommonStyles.fontFamily,fontSize:13,paddingLeft:12,color:Colors.white}}>{moment(booking.booked_on).format('DD-MM-YYYY hh:mm A')}</Text>
                </View>
            </View>
        </View>
        <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'white',paddingBottom:'20%'}}>
         <DetailItem
         label={'Booking Status'}
         value={booking?.booking_status}
         orderStatus={true}
         />
         <ThinlineSeparator margin={20}/>
       <View>
           
         <View style={{width:'95%',backgroundColor:Colors.lightPink,flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:60,alignSelf:'center',paddingHorizontal:10,marginBottom:20}}>
             <Text style={{color:'black',...CommonStyles.fontFamily}}>Booked timings</Text>
         <Text style={{color:'black',...CommonStyles.fontFamily}}>{moment(booking?.date).format('DD-MMMM-YYYY')}-{moment(booking?.time).format('hh:mm A')}</Text>
             </View>  

       <View style={{ width: '93%', alignSelf: 'center' }}>
                            <Text style={{ ...CommonStyles.fontFamily, fontSize: 15 }}>Service summary</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Image
                                    source={{ uri: `${base_url}/${booking?.service?.coverImg}` }}
                                    style={{ width: 60, height: 60, borderRadius: 10 }}
                                />
                                <Text style={{ paddingHorizontal: 10, width: '80%', fontWeight: '300' }}>{booking?.service?.description}</Text>
                            </View>
                        </View>
      
        <View>
         <ThinlineSeparator margin={20}/>

           <DetailItem label={'Besseri Comission'} value={`${booking?.besseri_comission.toFixed(2)} MXN`}/>
           <DetailItem label={'Sub total'} value={`${booking?.service?.price} MXN`}/>
           <DetailItem label={'Total Charges'} value={`${(booking?.total_amount).toFixed(2)} MXN`}/>
           <ThinlineSeparator margin={20}/>
        </View>
   <View style={{width:'93%',alignSelf:'center',marginTop:'5%'}}>
         <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Seller info</Text>
         <View style={{width:'100%',margin:10,paddingVertical:14,backgroundColor:Colors.white,alignSelf:'center',borderColor:Colors.gray,borderWidth:1,borderRadius:10}}>
         <Text style={{fontSize:16,...CommonStyles.fontFamily,paddingLeft:25,marginBottom:10}}>{booking?.store?.storeName}</Text>
         <View style={{flexDirection:'row',alignItems:'center'}}>
         <Entypo
         name='location-pin'
         color={Colors.darkPink}
         size={30}
         />
         <Text style={{fontSize:13,width:'92%'}}>{booking?.store?.address}</Text>
         </View>
         </View>
     </View>    
     <ThinlineSeparator margin={20}/>    
       </View>
      
      <LoaderComponent isVisible={loading}/>
      
        </ScrollView>
        <View style={{...CommonStyles.flexDirectionRow,justifyContent:'space-around',backgroundColor:'transparent',position:'absolute',bottom:15}}>
            <ButtonComponent
            buttonText={'Invoice'}
            width={booking?.booking_status_code == 'CANCELLED' ? width / 1.1 : width / 2.2}
            colorB={Colors.primaryColor}
            borderRadius={10}
            margin={10}
            />
            {
                booking?.booking_status_code == 'CANCELLED' ? 
                null 
                :
                <ButtonComponent
                buttonText={'Cancel'}
                width={width / 2.2}
                colorB={booking?.booking_status_code == 'PENDING' ? Colors.red : Colors.primaryColor}
                borderRadius={10}
                margin={10}
                handlePress={async() => {
                    if(booking?.booking_status_code == 'PENDING') {
                        Alert.alert('BOOKING CANCELLATION','Do you really want to cancel this appointment?',
                        [{text:'No'},
                    {text:'Yes',onPress:cancelAppointment}
                    ]
                        )
                    }
                }}
                />
            }
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
export default CustomerBookingDetail;
