import { Image, Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonStyles from '../../util/styles/styles'
import Colors from '../../util/styles/colors'
import ButtonComponent from '../button/button.component'
import { deviceHeight, deviceWidth } from '../../util/Dimentions'
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants'

export const EmptyOrders = (props) => {
  return (
    <View style={{ ...CommonStyles.flexOneCenter }}>
      <Image
        source={require('../../assets/images/orderss.png')}
        style={{ width: 200, height: 200, resizeMode: 'contain', bottom: 40 }}
      />
      <View style={[styles.placeOrderWrapper, { deviceWidth }]}>
        <Text style={styles.placeOrderText}>Realizar pedido</Text>
        <Text style={styles.placeOrderTextDetail}>Agregue artículos al carrito y haga su pedido ahora!</Text>
        <ButtonComponent
          buttonText={'Explore'}
          colorB={Colors.primarySolid}
          width={deviceWidth / 1.5}
          margin={10}
          handlePress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)}
        />
      </View>
    </View>
  )
}


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
})