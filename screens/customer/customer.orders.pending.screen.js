import { FlatList, StyleSheet, Text, View } from 'react-native'
import React,{ useEffect,useState } from 'react'
import { HeaderTitle } from '../../components/Customer/HeaderTitle'
import Colors from '../../util/styles/colors'

import { showToaster } from '../../util/constants'
import axios from 'axios'
import { customer_api_urls } from '../../util/api/api_essentials'
import { getUserId } from '../../util/local-storage/auth_service'
import LoaderComponent from '../../components/Loader/Loader.component'
import { EmptyOrders } from '../../components/Customer/EmptyOrders'
import OrderCard from '../../components/customer-components/ordercard.component'


export const CustomerOrdersPending = (props) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comision, setComision] = useState(0);
  const [delivery, setDelivery] = useState(0)



  const getMyOrders = async () => {
    const userId = await getUserId();
    if (userId) {
      try {
        setLoading(true);
        
        const apiCall = await axios.get(`${customer_api_urls.get_my_orders}/${userId}`);

        
      
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
  useEffect(() => {
    getMyOrders()
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }} >
      <HeaderTitle
      nav={()=> props.navigation.goBack}
      titulo={'Pedidos'}
      />
      {
        loading ? (
          <LoaderComponent/>
        ): !loading && orders.length == 0 ?
        <View style={{ ...CommonStyles.flexOneCenter }}>
            <EmptyOrders navigation={props.navigation} />
        </View>     
      : (

        <FlatList 
        data={orders}
        renderItem={({item}) => <View key={item._id} >
          <OrderCard onPress={() => {
            props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_DETAIL,{
              order:item,
              comision,
              delivery
            })
          }} data={item}/>
        </View>}
        keyExtractor={(item) => item._id}
        />
        // orders.map((item) =>  )
      )
      }
      
    </View>
  )
}


const styles = StyleSheet.create({})