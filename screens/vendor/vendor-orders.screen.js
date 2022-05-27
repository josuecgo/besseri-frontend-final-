import React, { useEffect, useState } from 'react';
import VendorScreenContainerComponent from '../../components/vendor-shared/vendor-screen-container-component';
import {StyleSheet, FlatList, View,Text, useWindowDimensions} from 'react-native';
import OrderComponent from '../../components/vendor-shared/order.component';
import {CUSTOMER_HOME_SCREEN_ROUTES, ORDER_STATUSES, showToaster, STATUSES_COLORS, VENDOR_DETAILS_ROUTES} from '../../util/constants';
import { getBusinessId } from '../../util/local-storage/auth_service';
import axios from 'axios';
import { api_statuses, vendor_api_urls } from '../../util/api/api_essentials';
import LoaderComponent from '../../components/Loader/Loader.component';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import ButtonComponent from '../../components/button/button.component';
import { useIsFocused } from '@react-navigation/native';
import { moneda } from '../../util/Moneda';
import TopCircleComponent from '../../components/top-circle/top-circle.component';
import { deviceHeight } from '../../util/Dimentions';
import { TranslateStatus } from '../../util/helpers/StatusText';

const VendorOrdersScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {width,height} = useWindowDimensions()
  const [orders,setOrders] = useState([]);
  const [bookings,setBookings] = useState([]);
  const [services,setServices] = useState(false);
  const [loading,setLoading] = useState(false);
  const [selectedTab,setSelectedTab] = useState('Orders');
  const floatButtonHandler = () => {};

  const openOrderDetails = ({orderId}) => {
    navigation.navigate(VENDOR_DETAILS_ROUTES.ORDER_DETAILS, {orderId:orderId});
  };
  const getStoreOrders = async() => {
    try {
     const businessId = await getBusinessId();
     const apiCall = await axios.get(`${vendor_api_urls.get_orders}/${businessId}`);
     setLoading(false);
     if(apiCall.status == api_statuses.success) {
        setOrders(apiCall.data.data);
     } else {
       showToaster('Something went wrong please try again');
     }
    } catch(e) {
      console.log(e.response.data)
      setLoading(false);
      showToaster('Something went wrong please try again');
    }
  }
  const getBookings = async() => {
    try {
     const businessId = await getBusinessId();
     const apiCall = await axios.get(`${vendor_api_urls.get_store_bookings}/${businessId}`);
     setLoading(false);
     if(apiCall.status == api_statuses.success) {
        setBookings(apiCall.data.data);
     } else {
       showToaster('Something went wrong please try again');
     }
    } catch(e) {
      console.log(e.response.data)
      setLoading(false);
      showToaster('Something went wrong please try again');
    }
  }
  useEffect(() => {
    getStoreOrders();
  },[isFocused]);
  useEffect(() => {
    getBookings();
  },[isFocused]);
  // const STATUSES_COLORS = {
    // [ORDER_STATUSES.PENDING]: '#0bda51',
  //   [ORDER_STATUSES.PROCESSING]: '#007bff',
  //   [ORDER_STATUSES.PACKED]: '#6c757d',
  //   [ORDER_STATUSES.CANCELLED]: '#dc3545',
  // };

  
  return (
    <View style={{flex:1,backgroundColor:Colors.bgColor}}> 
    <TopCircleComponent  />
    <View style={{flexDirection:'row',alignItems:'center',width:width}}>
      <TouchableOpacity onPress={() => setSelectedTab('Orders')} style={{width:width/2,backgroundColor:selectedTab == 'Orders' ? Colors.primarySolid : '#dcdcdc',height:60,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:19,...CommonStyles.fontFamily,color:selectedTab == 'Orders' ? Colors.white : Colors.primarySolid}}>Pedidos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedTab('Bookings')} style={{width:width/2,backgroundColor:selectedTab == 'Bookings' ? Colors.primarySolid : '#dcdcdc',height:60,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:19,...CommonStyles.fontFamily,color:selectedTab == 'Bookings' ? Colors.white : Colors.primarySolid}}>Reservaciones</Text>
      </TouchableOpacity>
    </View>


    <LoaderComponent isVisible={loading}/>
    <FlatList
     data={selectedTab == 'Orders' ? orders : bookings}
     keyExtractor={item => item?._id}
     contentContainerStyle={{flexGrow:1,marginTop:'10%'}}
     renderItem={({item}) => {
       if(selectedTab == 'Orders') {
      return (
        <OrderComponent
        orderId={item?.orderId}
        orderPlacedBy={item?.user?.name}
        orderPrice={item?.total_amount}
        orderDate={moment(item?.ordered_on).format('DD-MM-YY hh:ss A')}
        openOrderDetails={() => {
          navigation.navigate(VENDOR_DETAILS_ROUTES.ORDER_DETAILS,{
            orderId:item._id,
            orderNumber:item.orderId
          })
        }}
        orderStatus={ORDER_STATUSES[item?.order_status_code]}
      />
      )
      } else {
         return (
          <View style={styles.cardContainer}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{...CommonStyles.fontFamily,fontSize:15}}>#{item?.bookingId}</Text>
                <Text style={{...CommonStyles.fontFamily}}>{moment(item?.booked_on).format('DD-MM-YYYY hh:mm A')}</Text>
            </View>
            <View>
              <Text style={{...CommonStyles.fontFamily,fontSize:15,paddingVertical:5,color:STATUSES_COLORS[item?.booking_status_code]}}>{TranslateStatus(item?.booking_status_code)}</Text>
                  <Text style={{...CommonStyles.fontFamily,fontSize:15,paddingVertical:5}}>Timing - {moment(item?.date).format('DD-MM-YY')}-{moment(item?.time).format('hh:mm A')}</Text>
                  <View style={{...CommonStyles.flexDirectionRow,...CommonStyles.justifySpaceBetween,...CommonStyles.horizontalCenter}}>
                      <Text style={{fontSize:15,...CommonStyles.fontFamily}}>service: {item?.service?.name}</Text>
                      
                  </View>
                  <Text style={{...CommonStyles.fontFamily}}>Total Amount: {moneda(item?.total_amount)} MXN</Text>
                  <View style={{marginTop:10,...CommonStyles.flexDirectionRow,...CommonStyles.justifySpaceBetween,...CommonStyles.horizontalCenter}}>
                    <ButtonComponent
                    handlePress={() => navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.BOOKING_DETAIL,{booking:item})}
                    buttonText={'Detalles'}
                    width={'80%'}
                    colorB={Colors.primarySolid}
                    borderRadius={100}
                    />
                    <Text style={{color:Colors.brightBlue,...CommonStyles.fontFamily,fontSize:17}}>{item?.order_status}</Text>
                  </View>
              </View>
          </View>
        )
      }
    }}
    ListFooterComponent={()=>(
      <View style={{height: deviceHeight * 0.05}} />
    )}
    />
  </View>
  
);
};
const styles = StyleSheet.create({
cardContainer:{
  // width:'95%',
  minHeight:100,
  borderWidth:1,
  borderColor:Colors.white,
  backgroundColor:'white',
  elevation:2,
  margin:15,
  alignSelf:'center',
  paddingHorizontal:15,
  paddingVertical:15,
  borderRadius:10
},
})

export default VendorOrdersScreen;
