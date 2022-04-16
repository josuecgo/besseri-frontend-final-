import { Image, Platform } from 'react-native'
import React from 'react'
import { deviceHeight, deviceWidth } from '../../util/Dimentions'

export const HeaderBackground = ({hios=0.13,handroid=0.10}) => {

  return (
    <>
      <Image
        source={require('../../assets/images/header2.png')}
        style={{
          position: 'absolute',
          height: Platform.OS == 'ios' ? deviceHeight *hios  : deviceHeight * handroid,
          width: deviceWidth,
          // resizeMode:'cover'
          resizeMode:'stretch'
        }}
      />
    </>
  )
}