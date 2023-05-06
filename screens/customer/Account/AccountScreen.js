import { View, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../../util/styles/colors'
import { MyCarActive } from '../../../components/Customer/MyCarActive'
import { BackgroundCar } from '../../../components/Background/BackgroundCar'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants'

export const AccountScreen = (props) => {

 
  return (
    <View style={styles.account} >
      
      <MyCarActive/>
      <BackgroundCar/>

      <BtnPrincipal
      text={'Mis autos'}
      onPress={() =>  props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_CARS)}
      />

      <BtnPrincipal
      text={'Pedidos'}
      onPress={() =>  props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_PEDIDOS)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  account:{
    backgroundColor:Colors.bgColor,
    flex:1,
    paddingVertical:20,
  }
})