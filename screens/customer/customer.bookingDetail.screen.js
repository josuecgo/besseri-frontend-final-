import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, useWindowDimensions,TouchableOpacity, ScrollView, Alert } from 'react-native';
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
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const CustomerBookingDetail = (props) => {
    const {top} = useSafeAreaInsets()
    const {width,height} = useWindowDimensions()
  const [loading,setLoading] = useState(false);
  const {params} = useRoute();
  const store = params.booking.store;
  const totalAmount = Number(params.booking.total_amount);
  const [booking,setBooking] = useState(params.booking);
  const cancelAppointment = async() => {
      try {
          setLoading(true);
          alert(booking?._id)
        const apiCall = await axios.post(customer_api_urls.cancel_booking,{
            booking_id:booking?._id
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
  const DetailItem = ({label,value,orderStatus}) => {
    return (
        <View style={{width:'100%',borderColor:Colors.dark,flexDirection:'row',justifyContent:'space-between',alignItems:'center',alignSelf:'center',padding:10}}>
            <Text style={{...CommonStyles.fontFamily,fontSize:13}}>{label}</Text>
            <Text style={{fontSize:16,...CommonStyles.fontFamily,color:orderStatus ? Colors.brightBlue : 'black'}}>{value}</Text>
        </View>
    )
}
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>
        <HeaderBackground/>
        
        <View style={styles.header}>
            <TouchableOpacity 
            onPress={() => props?.navigation?.goBack()}
            style={{position:'absolute',left:5}}
            >
                <MaterialCommunityIcons
                name='keyboard-backspace'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            <View style={{...CommonStyles.flexDirectionRow}}>
                <View style={{width:45,height:45,borderWidth:1,borderColor:Colors.white,backgroundColor:Colors.white,...CommonStyles.flexCenter,borderRadius:5}}>
               <Feather name='box' size={30} color={Colors.primarySolid}/>
                </View>
                <View>
                <Text style={styles.headerText}>#{params?.booking?.bookingId}</Text>
                <Text style={{...CommonStyles.fontFamily,fontSize:13,paddingLeft:12,color:Colors.white}}>{moment(params.booking.booked_on).format('DD-MM-YYYY hh:mm A')}</Text>
                </View>
            </View>
        </View>
        <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'white',paddingBottom:'30%'}}>
         <DetailItem
         label={'Estado de la reservación'}
         value={params?.booking?.booking_status}
         orderStatus={true}
         />
         <ThinlineSeparator margin={20}/>
       <View>
           
         <View style={{width:'100%',backgroundColor:Colors.lightPink,flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:60,alignSelf:'center',paddingHorizontal:10,marginBottom:20}}>
             <Text style={{color:'black',...CommonStyles.fontFamily,fontSize:adjust(12)}}>Horarios reservados</Text>
         <Text style={{color:'black',...CommonStyles.fontFamily,fontSize:adjust(12)}}>{moment(booking?.date).format('DD-MM-YYYY')}-{moment(booking?.time).format('hh:mm A')}</Text>
             </View>  

       <View style={{ width: '93%', alignSelf: 'center' }}>
                            <Text style={{ ...CommonStyles.fontFamily, fontSize: 15 }}>Resumen del servicio</Text>
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

          
           <DetailItem label={'Total'} value={`${(totalAmount ).toFixed(2)} MXN`}/>
           <ThinlineSeparator margin={20}/>
        </View>
   <View style={{width:'93%',alignSelf:'center',marginTop:'5%'}}>
         <Text style={{...CommonStyles.fontFamily,fontSize:15}}>Información del vendedor</Text>
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
        <View style={{
            ...CommonStyles.flexDirectionRow,
            justifyContent:'space-around',
            backgroundColor:'transparent',
            position:'absolute',
            bottom:15 +top
            }}>
            <ButtonComponent
            buttonText={'Factura'}
            width={width / 2.2}
            colorB={Colors.terciarySolid}
            borderRadius={2}
            margin={10}
            />
             <ButtonComponent
            buttonText={'Cancelar'}
            width={width / 2.2}
            colorB={booking?.booking_status_code == 'PENDING' ? Colors.red : Colors.primaryColor}
            borderRadius={2}
            margin={10}
            handlePress={async() => {
                if(booking?.booking_status_code == 'PENDING') {
                    Alert.alert('CANCELACIÓN DE RESERVA','¿Realmente desea cancelar esta cita?',
                    [{text:'No'},
                {text:'Si',onPress:cancelAppointment}
                ]
                    )
                }
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
    height: Platform.OS == 'ios' ? deviceHeight * 0.13  : deviceHeight * 0.10,
    width: deviceWidth,
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    marginBottom:10
},
headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20,paddingLeft:10},
})
export default CustomerBookingDetail;
