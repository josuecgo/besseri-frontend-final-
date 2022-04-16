import { Platform, Text, View } from 'react-native'
import React from 'react'
import { HeaderBackground } from './HeaderBackground'
import { deviceHeight } from '../../util/Dimentions'
import CommonStyles from '../../util/styles/styles'

const TopHeader = ({children}) => {
  return (
    <>
     <HeaderBackground/>
     <View  style={{
          width: '100%',
          height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
          //  borderWidth:1,
          ...CommonStyles.horizontalCenter,
          justifyContent:'center'
     }} >
       {children}
    </View>
    </>
  )
}

export default TopHeader

