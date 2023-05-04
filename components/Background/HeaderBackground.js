import { Image, Platform, View } from 'react-native'
import React from 'react'
import { deviceHeight, deviceWidth } from '../../util/Dimentions'
import Colors from '../../util/styles/colors'

export const HeaderBackground = ({hios=0.12,handroid=0.10}) => {

  return (
    <>
      {/* <Image
        source={require('../../assets/images/header2.png')}
        style={{
          position: 'absolute',
          height: Platform.OS == 'ios' ? deviceHeight * hios  : deviceHeight * handroid,
          width: deviceWidth,
          // resizeMode:'cover'
          resizeMode:'stretch'
        }}
      /> */}
      <View
      style={{
        backgroundColor:Colors.bgColor,
        width:deviceWidth,
        height:Platform.OS == 'ios' ? deviceHeight * hios  : deviceHeight * handroid,
        position: 'absolute',
      }}
      />
    </>
  )
}