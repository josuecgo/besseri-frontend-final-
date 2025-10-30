import { Image, Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonStyles from '../../util/styles/styles'

import { deviceHeight, deviceWidth } from '../../util/Dimentions'

import { useSelector } from 'react-redux'
import ButtonComponent from '../button/button.component'
import Colors from '../../util/styles/colors'

export const EmptyOrders = ({navigation}) => {
  const {user} = useSelector(state => state.user)
  const title = user?.role === 'mechanic' ? 'No tienes pedido' : 'No tienes servcios'
  const subtitle = user?.role === 'mechanic' ? 'Agregue artículos al carrito y haga su pedido ahora' : ''
  return (
    <View style={{ ...CommonStyles.flexOneCenter }}>
      <Image
        source={require('../../assets/images/newLogo.png')}
        style={{ width: 200, height: 200, resizeMode: 'contain', bottom: 40 }}
      />
      <View style={[styles.placeOrderWrapper, { deviceWidth }]}>
        <Text style={styles.placeOrderText}>{title}</Text>
        <Text style={styles.placeOrderTextDetail}>{subtitle}</Text>
        <ButtonComponent
          buttonText={'Explore'}
          colorB={Colors.primarySolid}
          width={deviceWidth / 1.5}
          margin={10}
          handlePress={() => navigation.navigate('Splash')}
        />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  placeOrderText: { ...CommonStyles.h1, },
  placeOrderTextDetail: { ...CommonStyles.h3, fontWeight: '300', width: '90%', alignSelf: 'center', textAlign: 'center' },
  placeOrderWrapper: { justifyContent: 'center', alignItems: 'center', bottom: 40 },
  header:{
    width:'100%',
    height:Platform.OS == 'ios' ? deviceHeight *0.15 : deviceHeight * 0.10, 
    
    paddingHorizontal:20,
    alignItems:'center',
    justifyContent:'center'
},
})