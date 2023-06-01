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

const data = [{
  id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
  fullName: 'Afreen Khan',
  timeStamp: '12:47 PM',
  recentText: 'Good Day!',
  avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
}, {
  id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
  fullName: 'Sujita Mathur',
  timeStamp: '11:11 PM',
  recentText: 'Cheer up, there!',
  avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU'
}, {
  id: '58694a0f-3da1-471f-bd96-145571e29d72',
  fullName: 'Anci Barroco',
  timeStamp: '6:22 PM',
  recentText: 'Good Day!',
  avatarUrl: 'https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg'
}, {
  id: '68694a0f-3da1-431f-bd56-142371e29d72',
  fullName: 'Aniket Kumar',
  timeStamp: '8:56 PM',
  recentText: 'All the best',
  avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr01zI37DYuR8bMV5exWQBSw28C1v_71CAh8d7GP1mplcmTgQA6Q66Oo--QedAN1B4E1k&usqp=CAU'
}, {
  id: '28694a0f-3da1-471f-bd96-142456e29d72',
  fullName: 'Kiara',
  timeStamp: '12:47 PM',
  recentText: 'I will call today.',
  avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU'
}];
export const NotificationScreen = (props) => {
  const { notificaciones } = useSelector(state => state.user);
  const {getNotificaciones} = useInfoUser();
  
  const orderDetail = (data,item) => {
  
    props.navigation.navigate(BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT,{screen:CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_PEDIDOS})
    
    if (!item?.isView)  {
        viewItem(item._id);
        
    }
  }

  const viewItem = async(id) => {
      try {
        
          await axios.post(`${api_urls.viewNotification}/${id}`,{user:'customer'});
          getNotificaciones();
          
      
      } catch(e) {
      console.log({detail:e});
      }
  }

 

  const renderItem = ({
    item,
    index
  }) => {
    return (
      <Box py={'2'} >
      <Pressable onPress={() => orderDetail(item?.body,item)}>
        <Box pl="4" pr="5" py="2">
          <Text style={CommonStyles.h2} bold>
          {item.titulo}
          </Text>
        </Box>
      </Pressable>
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