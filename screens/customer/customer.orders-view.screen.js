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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const CustomerOrdersViewScreen = (props) => {
  const { width, height } = useWindowDimensions()
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const getMyOrders = async (id) => {
    try {
      setLoading(true);
      const userId = await getUserId();
      const apiCall = await axios.get(`${customer_api_urls.get_my_orders}/${userId}`);
      setLoading(false);
      if (apiCall.status == api_statuses.success) {
        setOrders(apiCall.data.data)
      } else {
        showToaster('Something went wrong please try again');
      }
    } catch (e) {
      console.log(e)
      setLoading(false);
      showToaster('Something went wrong please try again later')
    }
  }
  useEffect(() => {
    getMyOrders()
  }, [isFocused]);
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.header}>
            <TouchableOpacity style={{alignSelf:'flex-start'}}>
                <MaterialCommunityIcons
                onPress={() => props?.navigation?.goBack()}
                name='keyboard-backspace'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>My Orders</Text>
        </View>
      <LoaderComponent isVisible={loading}/>
    
      <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:'5%'}}> 
      {
          !loading && orders.length == 0 ?
          <View style={{ ...CommonStyles.flexOneCenter }}>
          <Image
            source={require('../../assets/images/orderss.png')}
            style={{ width: 200, height: 200, resizeMode: 'contain', bottom: 40 }}
          />
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
          data={orders}
          keyExtractor={item => item?._id}
          renderItem={itemData => (
            <OrderCard onPress={() => {
              props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_DETAIL,{
                order:itemData.item
              })
            }} data={itemData.item}/>
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
})
export default CustomerOrdersViewScreen;
