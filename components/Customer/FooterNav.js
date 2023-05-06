import { StyleSheet,  TouchableOpacity,  View } from 'react-native'
import React from 'react'
import {  Box,  HStack, Center, Text } from 'native-base';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOTTOM_TAB_CUSTOMER_ROUTES } from '../../util/constants';
import Colors from '../../util/styles/colors';
import { deviceWidth } from '../../util/Dimentions';



export const FooterNav = ({state,navigation}) => {
  const {bottom} = useSafeAreaInsets()
  const size = 33;

 


  const getIconName = (route) => {
   
    switch (route) {
      case  BOTTOM_TAB_CUSTOMER_ROUTES.HOME_SCREEN:
        
        return 'home'
      case  BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT:
        
        return 'steering'
      case  BOTTOM_TAB_CUSTOMER_ROUTES.NOTIFICATION_STACK:
        
        return 'bell'
      default:
        return 'home'
    }
  }

  return (
    <View style={styles.footer}>
    {state.routes.map((route, index) => {
        
        // Quita el bottom Tab
        // if (state.index == 3) {
        //     return null
        // }
        if (route.name !== BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT) {
        
            return (
              <TouchableOpacity
                onPress={()=>navigation.navigate(route?.name)}
                key={index}
                style={styles.btn}
                >
                 <Center>

                  <MaterialCommunityIcons name={getIconName(route?.name)}  size={size} />
           
                </Center>
              </TouchableOpacity>
            );
        }

      return  (
        <View
        style={styles.containerButton} 
        key={index} >
          <TouchableOpacity
          style={styles.btnAccount}
          onPress={()=>navigation.navigate(route?.name)}
          >
            <MaterialCommunityIcons name={getIconName(route?.name)}   size={50} />
          </TouchableOpacity>
        </View>
      )

    })}
  </View>


  )
}


const styles = StyleSheet.create({
  footer:{
    backgroundColor:Colors.white,
    flexDirection:'row',
    width:deviceWidth,
    alignItems:'center',
    justifyContent:'center'
    // bottom:0,
    // flex:1,
   
  },
  content:{
    backgroundColor:'#F7F7F7',
    // backgroundColor:'red',
    // borderRadius:200,
    // marginVertical:10,
    height:60
    
   
  },
  btn:{
      marginHorizontal:deviceWidth / 6
  },
  containerButton: {
    top: -20,
    backgroundColor:'white',
    borderRadius:100
  },
  btnAccount:{
    width: 50,
    height: 50,
    justifyContent:'center',
    alignItems:'center'
  }
})