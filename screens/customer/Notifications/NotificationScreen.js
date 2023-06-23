import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Text, Pressable, Icon, HStack, Avatar, VStack, Spacer, ScrollView, Divider } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonStyles from '../../../util/styles/styles';
import Colors from '../../../util/styles/colors';
import { useInfoUser } from '../../../hooks/useInfoUsers';
import axios from 'axios';
import { api_urls } from '../../../util/api/api_essentials';
import { BOTTOM_TAB_CUSTOMER_ROUTES, CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants';


export const NotificationScreen = (props) => {
  const { notificaciones } = useSelector(state => state.user);
  const {getNotificaciones,getPedidosUser} = useInfoUser();
  
  const orderDetail = async(data,item) => {
    
    // props.navigation.navigate(BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT,{screen:CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_PEDIDOS})
   getPedidosUser()
    props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.DETALLE,data)
   
    if (!item?.isView)  {
        viewItem(item._id);
        
    }
  }

  const viewItem = async(id) => {
      try {
        
        await axios.post(`${api_urls.viewNotification}/${id}`,{user:'customer'});
        getNotificaciones();
          
      
      } catch(e) {
        console.log(e,'viewItem');
      }
  }

 

  const renderItem = ({
    item,
    index
  }) => {
    return (
      <Box py={'2'}  >
      <TouchableOpacity onPress={() => orderDetail(item?.body,item)}>
        <Box flexDirection={'row'} alignItems={'center'}  pl="4" pr="5" py="2">
          {/* <MaterialCommunityIcons name='bell' color={Colors.white} size={20} /> */}
          <Text style={CommonStyles.h2} bold>
          {item.titulo}
          </Text>
        </Box>
      </TouchableOpacity>
      <Divider/>
    </Box>
    )
  };


  return (
    <View style={CommonStyles.screenY} >

      <Box>
       

        <FlatList
        data={notificaciones}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        />
      </Box>

    </View>
  )
}



const styles = StyleSheet.create({})