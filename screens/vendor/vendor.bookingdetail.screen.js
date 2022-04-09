import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, useWindowDimensions,TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ButtonComponent from '../../components/button/button.component';
import OrderCard from '../../components/customer-components/ordercard.component';
import LoaderComponent from '../../components/Loader/Loader.component';
import { api_statuses, base_url, customer_api_urls, vendor_api_urls } from '../../util/api/api_essentials';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster, STATUSES_COLORS } from '../../util/constants';
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
const VendorBookingDetail = (props) => {
    const {width,height} = useWindowDimensions()
  const [loading,setLoading] = useState(false);
  const {params} = useRoute();
  const totalAmount = Number(params.booking.total_amount);
  const [booking,setBooking] = useState(params.booking);
  const confirmationAlert = (head,detail,status,code) => {
      Alert.alert(head,detail,[{text:'no'},{text:'yes',onPress:() => {
          chaneStatus(status,code)}}])
  }
  const cancelAppointment = async() => {
      try {
          setLoading(true);
        const apiCall = await axios.post(customer_api_urls.cancel_booking,{
            booking_id:booking?._id,
            cancelled_by_vendor:true
        });
        setLoading(false);
        if(apiCall.status == api_statuses.success) {
            setBooking(apiCall.data.data[0]);
        } else {
            showToaster('Something went wrong');
        }
      } catch(e) {
          setLoading(false);
          showToaster('Something went wrong');
          console.log(e.response)
      }
  }
  const chaneStatus = async(status,code) => {
    try {
        setLoading(true);
      const apiCall = await axios.post(vendor_api_urls.change_booking_status,{
          booking_id:booking?._id,
          status:status,
          code:code
      });
      setLoading(false);
      if(apiCall.status == api_statuses.success) {
          setBooking(apiCall.data.data[0]);
      } else {
          showToaster('Something went wrong');
      }
    } catch(e) {
        setLoading(false);
        showToaster('Something went wrong');
        console.log(e.response.data)
    }
}
  const DetailItem = ({label,value,orderStatus}) => {
    return (
        <View style={{width:'100%',borderColor:Colors.dark,flexDirection:'row',justifyContent:'space-between',alignItems:'center',alignSelf:'center',padding:10}}>
            <Text style={{...CommonStyles.fontFamily,fontSize:13}}>{label}</Text>
            <Text style={{fontSize:16,...CommonStyles.fontFamily,color:orderStatus ? STATUSES_COLORS[booking?.booking_status_code] : 'black'}}>{value}</Text>
        </View>
    )
}
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.header}>
            <TouchableOpacity 
            onPress={() => props.navigation.goBack()}
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

           <DetailItem label={'Besseri Charges'} value={'2.00 MXN'}/>
           <DetailItem label={'Sub total'} value={`${totalAmount.toFixed(2)} MXN`}/>
           <DetailItem label={'Total Charges'} value={`${(totalAmount + 5 + 2).toFixed(2)} MXN`}/>
           <ThinlineSeparator margin={20}/>
        </View>
   <View style={{width:'93%',alignSelf:'center',marginTop:'5%'}}>
         <Text style={{...CommonStyles.fontFamily,fontSize:15}}>User info</Text>
         <View style={{width:'100%',margin:10,paddingVertical:14,backgroundColor:Colors.white,alignSelf:'center',borderColor:Colors.gray,borderWidth:1,borderRadius:10}}>
         <Text style={{fontSize:16,...CommonStyles.fontFamily,paddingLeft:25,marginBottom:10}}>{booking?.user?.name}</Text>
         <Text style={{fontSize:16,...CommonStyles.fontFamily,paddingLeft:25,marginBottom:10}}>{booking?.user?.email}</Text>

         {/* <View style={{flexDirection:'row',alignItems:'center'}}>
         <Entypo
         name='location-pin'
         color={Colors.darkPink}
         size={30}
         />
         <Text style={{fontSize:13,width:'92%'}}>{booking?.store?.address}</Text>
         </View> */}
         </View>
     </View>    
     <ThinlineSeparator margin={20}/>    
       </View>
      
      <LoaderComponent isVisible={loading}/>
      
        </ScrollView>
      {
          booking?.booking_status_code == 'CANCELLED' ? 
          null:
          <View style={{...CommonStyles.flexDirectionRow,justifyContent:'space-around',backgroundColor:'transparent',position:'absolute',bottom:15}}>
         {
             booking?.booking_status_code == 'COMPLETED' ? 
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
          <ButtonComponent
          handlePress={() => {
              if(booking?.booking_status_code == 'PENDING') {
                    confirmationAlert('Accepting booking','Do you really want to accept this service?','On Going','ON_GOING')
              } else if(booking?.booking_status_code == 'ON_GOING') {
                confirmationAlert('Completing Service','Do you really want to close this service now? are you sure this service is done?','Completed','COMPLETED')
          }
          }}
          buttonText={booking?.booking_status_code == 'PENDING' ? 'Accept' : booking?.booking_status_code == 'ON_GOING' ? 'Complete' : 'Send Invoice'}
          width={booking?.booking_status_code == 'COMPLETED' ? width -20 : width/2.2}
          colorB={booking?.booking_status_code == 'COMPLETED' ? Colors.primaryColor :'#0bda51'}
          borderRadius={10}
          margin={10}
          />
          
      </View> 
      }
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
export default VendorBookingDetail;
