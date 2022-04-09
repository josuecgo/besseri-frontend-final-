import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, useWindowDimensions,TouchableOpacity, ScrollView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ButtonComponent from '../../components/button/button.component';
import OrderCard from '../../components/customer-components/ordercard.component';
import LoaderComponent from '../../components/Loader/Loader.component';
import { api_statuses, customer_api_urls } from '../../util/api/api_essentials';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import { getUserId } from '../../util/local-storage/auth_service';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment'
const CustomerBookingsView = (props) => {
  const { width, height } = useWindowDimensions()
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const getMyBookings = async (id) => {
    try {
      setLoading(true);
      const userId = await getUserId();
      const apiCall = await axios.get(`${customer_api_urls.get_my_bookings}/${userId}`);
      console.log(userId)
      setLoading(false);
      if (apiCall.status == api_statuses.success) {
          console.log(apiCall.data)
        setBookings(apiCall.data.data)
      } else {
        showToaster('Something went wrong please try again');
      }
    } catch (e) {
      console.log(e.response.data)
      setLoading(false);
      showToaster('Something went wrong please try again later')
    }
  }
  useEffect(() => {
    getMyBookings()
  }, [isFocused]);
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
            <Text style={styles.headerText}>My bookings</Text>
        </View>
      <LoaderComponent isVisible={loading}/>
    
      <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:'5%'}}> 
      {
          !loading && bookings.length == 0 ?
          <View style={{ ...CommonStyles.flexOneCenter }}>
          {/* <Image
            source={require('../../assets/images/bookingss.png')}
            style={{ width: 200, height: 200, resizeMode: 'contain', bottom: 40 }}
          /> */}
          <View style={[styles.placeOrderWrapper, { width }]}>
          <Text style={styles.placeOrderText}>Place Order</Text>
          <Text style={styles.placeOrderTextDetail}>Add items to cart and place order now!</Text>
          <ButtonComponent
            buttonText={'Explore'}
            colorB={Colors.primaryColor}
            width={width / 1.5}
            margin={10}
            handlePress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)}
          />
        </View>
        </View>
        :
        <View>
          <FlatList
          data={bookings}
          keyExtractor={item => item?._id}
          renderItem={itemData => (
            <View style={styles.cardContainer}>
    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{...CommonStyles.fontFamily,fontSize:15}}>#{itemData.item?.bookingId}</Text>
        <Text style={{...CommonStyles.fontFamily}}>{moment(itemData.item?.booked_on).format('DD-MM-YYYY hh:mm A')}</Text>
    </View>
    <View>
        <Text style={{...CommonStyles.fontFamily,fontSize:15,paddingVertical:5}}>{itemData.item?.store?.storeName}</Text>
        <View style={{...CommonStyles.flexDirectionRow,...CommonStyles.justifySpaceBetween,...CommonStyles.horizontalCenter}}>
            <Text style={{fontSize:15,...CommonStyles.fontFamily}}>service: {itemData.item?.service?.name}</Text>
            
        </View>
        <Text style={{...CommonStyles.fontFamily}}>Total Amount: {itemData.item?.total_amount} MXN</Text>
        <View style={{marginTop:10,...CommonStyles.flexDirectionRow,...CommonStyles.justifySpaceBetween,...CommonStyles.horizontalCenter}}>
          <ButtonComponent
          handlePress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.BOOKING_DETAIL,{booking:itemData.item})}
          buttonText={'Details'}
          width={'80%'}
          colorB={Colors.primaryColor}
          borderRadius={100}
          />
          <Text style={{color:Colors.brightBlue,...CommonStyles.fontFamily,fontSize:17}}>{itemData.item?.order_status}</Text>
        </View>
    </View>
    </View>
          )}
          />
          </View>
        }
      </ScrollView>
     
    </View>
  );
};
const styles = StyleSheet.create({
  placeOrderText: { ...CommonStyles.fontFamily, fontSize: 20 },
  placeOrderTextDetail: { fontSize: 13, fontWeight: '300', width: '90%', alignSelf: 'center', textAlign: 'center', color: Colors.dark },
  placeOrderWrapper: { justifyContent: 'center', alignItems: 'center', bottom: 40 },
  header:{
    width:'100%',
    height:80,
    backgroundColor:Colors.primaryColor,
    paddingHorizontal:20,
    alignItems:'center',
    justifyContent:'center'
},
headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20,position:'absolute'},
cardContainer:{
    width:'95%',
    minHeight:100,
    borderWidth:2,
    borderColor:Colors.white,
    backgroundColor:'white',
    elevation:3,
    margin:15,
    alignSelf:'center',
    paddingHorizontal:15,
    paddingVertical:15,
    borderRadius:10
},
 labelCircle:{
     width:40,
     height:40,
     borderWidth:1,
     borderColor:Colors.darkPink,
     backgroundColor:Colors.lightPink,
     ...CommonStyles.flexCenter,
     borderRadius:40/2
 },
 flexWrapper:{...CommonStyles.flexDirectionRow,...CommonStyles.horizontalCenter,paddingLeft:5,paddingTop:5}
})
export default CustomerBookingsView;
