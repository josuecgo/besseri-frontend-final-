import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { deviceWidth } from '../../util/Dimentions'
import { Image } from 'native-base'
import CommonStyles from '../../util/styles/styles'

export const ButtonService = ({label,icono,onPress,style=100}) => {
  return (
    <View 
    style={[styles.btnService]}
    >
      <TouchableOpacity
      onPress={onPress}
      style={[styles.btn]}
      >
        <Image
         source={icono}
         style={[styles.icono,{width:style,height:style}]}alt={label}
        />
      </TouchableOpacity>
      <Text style={CommonStyles.h2} >{label}</Text>
    </View>
    
  )
}

 

const styles = StyleSheet.create({
  btnService:{
    alignItems:'center',
    // justifyContent:'center',
   
    height:100,
    width: 100,
  },
  btn:{
    
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    // marginHorizontal:5,
    // overflow:'hidden'
  },
  icono:{
    height:100,
    width: 100,
    // resizeMode:'contain',
   
  },
  label:{
    
  }
})