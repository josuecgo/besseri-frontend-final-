import { Image, Platform, View } from 'react-native'
import React from 'react'
import { deviceHeight, deviceWidth } from '../../util/Dimentions'
import Colors from '../../util/styles/colors'

export const HeaderBackground = ({hios=0.12,handroid=0.10}) => {

  return (
    <>
     
      <View
      style={{
        backgroundColor:Colors.bgColor,
        width:deviceWidth,
        height:'100%',
        position: 'absolute',
      }}
      />
    </>
  )
}