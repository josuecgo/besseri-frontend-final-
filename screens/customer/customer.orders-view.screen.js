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
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { deviceHeight } from '../../util/Dimentions';
import { Orders } from '../../components/Customer/Orders';
const CustomerOrdersViewScreen = (props) => {
  const { width, height } = useWindowDimensions()
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comision, setComision] = useState(0);
  const [delivery, setDelivery] = useState(0)

  const isFocused = useIsFocused();
  const getMyOrders = async (id) => {
    const userId = await getUserId();
    if (userId) {
      try {
        setLoading(true);
        
        const apiCall = await axios.get(`${customer_api_urls.get_my_orders}/${userId}`);
        const getFee = await axios.get(customer_api_urls?.get_fees);
        
        setComision(getFee.data.data[0]?.besseri_comission);
        setDelivery(getFee.data.data[0]?.delivery_fee);
        setLoading(false);
        if (apiCall.status == api_statuses.success) {
          setOrders(apiCall.data.data)
        } else {
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
        }
      } catch (e) {
        // console.log(e)
        setLoading(false);
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo')
      }
    } 
  }
  // useEffect(() => {
  //   getMyOrders()
  // }, [isFocused]);
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>
      <HeaderBackground/>
        <View style={styles.header}>
            <TouchableOpacity style={{alignSelf:'flex-start'}}>
                <MaterialCommunityIcons
                onPress={() => props?.navigation?.goBack()}
                name='keyboard-backspace'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>Mis pedidos</Text>
        </View>
      <LoaderComponent isVisible={loading}/>
    
      <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:'5%'}}> 
      {/* {
        !loading && orders.length == 0 ?
          <View style={{ ...CommonStyles.flexOneCenter }}>
          <Image
            source={require('../../assets/images/orderss.png')}
            style={{ width: 200, height: 200, resizeMode: 'contain', bottom: 40 }}
          />
          <View style={[styles.placeOrderWrapper, { width }]}>
          <Text style={styles.placeOrderText}>Realizar pedido</Text>
          <Text style={styles.placeOrderTextDetail}>Agregue artículos al carrito y haga su pedido ahora!</Text>
          <ButtonComponent
            buttonText={'Explore'}
            colorB={Colors.primarySolid}
            width={width / 1.5}
            margin={10}
            handlePress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)}
          />
        </View>
          </View>
        :
       
        } */}
         <View style={{flex:1}} >
          <Orders
          
          navigation={props.navigation}
          />
          {/* {
            orders.map((item) => (
              <View key={item._id} >
                 <OrderCard onPress={() => {
                props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_DETAIL,{
                  order:item,
                  comision,
                  delivery
                })
              }} data={item}/>
              </View>
               
            ))
          } */}
          </View>
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
    height:Platform.OS == 'ios' ? deviceHeight *0.15 : deviceHeight * 0.10, 
    
    paddingHorizontal:20,
    alignItems:'center',
    justifyContent:'center'
},
headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20,position:'absolute'},
})
export default CustomerOrdersViewScreen;
