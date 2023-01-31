import { FlatList, StyleSheet, View } from 'react-native'
import React from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import Colors from '../../../util/styles/colors'


import { EmptyOrders } from '../../../components/Customer/EmptyOrders'
import OrderCard from '../../../components/customer-components/ordercard.component'
import { useOrder } from '../../../hooks/useOrder'
import Loading from '../../../components/Loader/Loading'
import CommonStyles from '../../../util/styles/styles'
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants'


export const CustomerOrdersSending = (props) => {
  const {sending,loading,getMyOrders} = useOrder();



  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }} >
      <HeaderTitle
      nav={()=> props.navigation.goBack}
      titulo={'En ruta'}
      />

      {
        loading ? ( <Loading  /> ) 
        : !loading && sending.length == 0 ?
            <View style={{ ...CommonStyles.flexOneCenter }}>
                <EmptyOrders navigation={props.navigation} />
            </View>     
        : (
    
              <FlatList
              data={sending}
              renderItem={({item}) => <View key={item._id} >
                <OrderCard onPress={() => {
                  props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_DETAIL,{
                    order:item,
                  
                  })
                }} data={item}/>
              </View>}
              keyExtractor={(item) => item._id}
             
              onRefresh={() => {
                    
                getMyOrders();
    
              }}
              refreshing={loading}
              />
              
            )
          
        
      }
      
    </View>
  )
}


const styles = StyleSheet.create({})