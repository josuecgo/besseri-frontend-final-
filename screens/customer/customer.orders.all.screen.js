import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import { useIsFocused } from '@react-navigation/native';
import { getUserId } from '../../util/local-storage/auth_service';
import { api_statuses, customer_api_urls } from '../../util/api/api_essentials';
import axios from 'axios';
import { ListStatusOrder } from '../../components/ListStatusOrder';
import CommonStyles from '../../util/styles/styles';
import { EmptyOrders } from '../../components/Customer/EmptyOrders';
import Colors from '../../util/styles/colors';
import LoaderComponent from '../../components/Loader/Loader.component';
import OrderCard from '../../components/customer-components/ordercard.component';
import TopHeader from '../../components/Background/TopHeader';
import { HeaderTitle } from '../../components/Customer/HeaderTitle';
import { useOrder } from '../../hooks/useOrder';
import Loading from '../../components/Loader/Loading';



export const CustomerOrdersAllScreen = (props) => {
  
  const {loading,orders,getMyOrders} = useOrder()

  
  // if(loading) return  <Loading  />

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }} >
      <HeaderTitle
      nav={()=> props.navigation.goBack}
      titulo={'Todos'}
      />
      {
        loading ? ( <Loading  /> ) 
        : !loading && orders.length == 0 ?
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