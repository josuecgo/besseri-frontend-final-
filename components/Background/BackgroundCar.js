import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'native-base'
import { deviceHeight, deviceWidth } from '../../util/Dimentions'

export const BackgroundCar = () => {
  return (
    <View style={{alignItems:'center'}} >
      <Image
       alt='car'
       source={require('../../assets/images/car_home.png')}
       resizeMode='cover'
       style={styles.img}
       />
    </View>
  )
}



const styles = StyleSheet.create({
  img:{
    width:deviceWidth ,
    height:deviceHeight * 0.46
  }
})