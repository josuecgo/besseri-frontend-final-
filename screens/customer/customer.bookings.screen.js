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
import { deviceHeight, deviceWidth } from '../../util/Dimentions';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
const CustomerBookingsView = (props) => {
  const { width, height } = useWindowDimensions()
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [isLogin, setIsLogin] = useState(false);

  const getMyBookings = async (id) => {
    const userId = await getUserId();
    setIsLogin(userId);
    if (userId) {
      try {
        setLoading(true);
        
        const apiCall = await axios.get(`${customer_api_urls.get_my_bookings}/${userId}`);
        
        setLoading(false);
        if (apiCall.status == api_statuses.success) {
           
          setBookings(apiCall.data.data)
        } else {
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
        }
      } catch (e) {
        // console.log(e.response.data)
        setLoading(false);
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo')
      }
    }
    
  }

  const goExplore = () => {
    if (isLogin) {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)
    }else{
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR)
    }
   
  }



  useEffect(() => {
    getMyBookings()
  }, [isFocused]);



  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>
    <HeaderBackground/>
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
        <Text style={styles.headerText}>Reservaciones</Text>
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
      <Text style={styles.placeOrderText}>Realizar pedido</Text>
      <Text style={styles.placeOrderTextDetail}>Agregue artículos al carrito y haga su pedido ahora!</Text>
      <ButtonComponent
        buttonText={'Explore'}
        colorB={Colors.primarySolid}
        width={width / 1.5}
        margin={10}
        handlePress={goExplore}
      />
    </View>
    </View>
    :
    <View>


      {
        bookings.map((item) => (
          <View key={item._id} style={styles.cardContainer}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{...CommonStyles.fontFamily,fontSize:15}}>#{item?.bookingId}</Text>
              <Text style={{...CommonStyles.fontFamily}}>{moment(item?.booked_on).format('DD-MM-YYYY hh:mm A')}</Text>
          </View>
          <View>
              <Text style={{...CommonStyles.fontFamily,fontSize:15,paddingVertical:5}}>{
                item?.store?.storeName}
              </Text>
              <View style={{...CommonStyles.flexDirectionRow,...CommonStyles.justifySpaceBetween,...CommonStyles.horizontalCenter}}>
                  <Text style={{fontSize:15,...CommonStyles.fontFamily}}>
                  Servicio: {item?.service?.name}
                  </Text>
              </View>
              <Text style={{...CommonStyles.fontFamily}}>Total: ${item?.total_amount} MXN</Text>
              <View style={{marginTop:10,...CommonStyles.flexDirectionRow,...CommonStyles.justifySpaceBetween,...CommonStyles.horizontalCenter}}>
                <ButtonComponent
                handlePress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.BOOKING_DETAIL,{booking:item})}
                buttonText={'Details'}
                width={'80%'}
                colorB={Colors.primarySolid}
                borderRadius={100}
                />
                <Text style={{color:Colors.brightBlue,...CommonStyles.fontFamily,fontSize:17}}>{item?.order_status}</Text>
              </View>
          </View>
        </View>
        ))
      }
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
    height: Platform.OS == 'ios' ? deviceHeight * 0.15  : deviceHeight * 0.10,
    width: deviceWidth,
   
    paddingHorizontal:20,
    alignItems:'center',
    justifyContent:'center'
},
headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20,position:'absolute'},
cardContainer:{
    // width:'95%',
    minHeight:100,
    
    backgroundColor:Colors.white,
    elevation:2,
    margin:15,
    alignSelf:'center',
    paddingHorizontal:15,
    paddingVertical:15,
    borderRadius:1
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
