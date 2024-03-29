import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, useWindowDimensions,TouchableOpacity, ScrollView,Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ButtonComponent from '../../components/button/button.component';
import OrderCard from '../../components/customer-components/ordercard.component';
import LoaderComponent from '../../components/Loader/Loader.component';
import { api_statuses, customer_api_urls, rider_api_urls } from '../../util/api/api_essentials';
import { BOTTOM_TAB_RIDER_ROUTES, CUSTOMER_HOME_SCREEN_ROUTES, RIDER_STACK_ROUTES, showToaster } from '../../util/constants';
import { getRiderId, getUserId } from '../../util/local-storage/auth_service';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { deviceHeight, deviceWidth } from '../../util/Dimentions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackground } from '../../components/Background/HeaderBackground';


const RidersOrdersViewScreen = (props) => {
  const { width } = useWindowDimensions()
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const { top } = useSafeAreaInsets();


  const getMyOrders = async (id) => {
    try {
      setLoading(true);
      const riderId = await getRiderId();
      const apiCall = await axios.get(`${rider_api_urls.get_myorders}/${riderId}`);
      setLoading(false);
      if (apiCall.status == api_statuses.success) {
        setOrders(apiCall.data.data)
        
      } else {
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
      }
    } catch (e) {
      // console.log(e?.response?.data)
      setLoading(false);
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo')
    }
  }


  useEffect(() => {
    getMyOrders()
  }, [isFocused]);

  // console.log(orders[0]);
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
        {/* <ImageBackground  source={require('../../assets/images/header2.png')} resizeMode='stretch'> */}
          <HeaderBackground/>
          <View style={styles.header}  >
            <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={{alignSelf:'flex-start'}}>
                <MaterialCommunityIcons
                name='keyboard-backspace'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>Mis Pedidos</Text>
          </View>
            
        {/* </ImageBackground> */}
      <LoaderComponent isVisible={loading}/>
    
      <View style={{flexGrow:1,paddingBottom:'5%'}}> 
      {
          !loading && orders.length == 0 ?
          <View style={{ ...CommonStyles.flexOneCenter }}>
          <Image
            source={require('../../assets/images/orderss.png')}
            style={{ width: 200, height: 200, resizeMode: 'contain', bottom: 40 }}
          />
          <View style={[styles.placeOrderWrapper, { width }]}>
          <Text style={styles.placeOrderText}>Solicitar pedidos</Text>
          <Text style={styles.placeOrderTextDetail}>Explore los pedidos cercanos y solicítelos :)</Text>
          <ButtonComponent
            buttonText={'Explore'}
            colorB={Colors.primarySolid}
            width={width / 1.5}
            margin={10}
            handlePress={() => props.navigation.navigate(BOTTOM_TAB_RIDER_ROUTES?.RIDER_EXPLORE)}
          />
        </View>
        </View>
        :
        <View>
          <FlatList
          data={orders}
          keyExtractor={item => item?._id}
          renderItem={itemData => (
            <OrderCard 
            isRider={true}
            onPress={() => {
              props.navigation.navigate(RIDER_STACK_ROUTES.RIDER_ORDER_DETAIL,{
                order:itemData.item
              })
            }} data={itemData.item}/>
          )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{marginBottom: deviceHeight * 0.07 + top}} />}
          />
          </View>
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
    width:deviceWidth,
    height: Platform.OS == 'ios' ? deviceHeight * 0.15  : deviceHeight * 0.10,
  
    paddingHorizontal:20,
    alignItems:'center',
    justifyContent:'center',
    
},
headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20,position:'absolute'},
})
export default RidersOrdersViewScreen;
