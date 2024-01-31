import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { HStack, Image } from 'native-base'
import { deviceHeight, deviceWidth } from '../../util/Dimentions'
import ChecksHome from '../Customer/ChecksHome'

export const BackgroundCar = ({home = false,bottom = 20}) => {
  return (
    <View style={{alignItems:'center'}} >
      <Image
       alt='car'
       source={require('../../assets/images/car_home.png')}
       resizeMode='contain'
       style={styles.img}
       />
      
        
    </View>
  )
}



const styles = StyleSheet.create({
  img:{
    width:deviceWidth ,
    height:deviceHeight * 0.30
  }
})