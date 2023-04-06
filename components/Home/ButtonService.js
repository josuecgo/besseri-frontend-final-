import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { deviceWidth } from '../../util/Dimentions'
import { Image } from 'native-base'

export const ButtonService = ({label,icono,onPress}) => {
  return (
    <View 
    style={styles.btnService}
    >
      <TouchableOpacity
      onPress={onPress}
      style={styles.btn}
      >
        <Image
         source={icono}
         style={styles.icono}alt={label}
        />
      </TouchableOpacity>
      <Text>{label}</Text>
    </View>
    
  )
}

 

const styles = StyleSheet.create({
  btnService:{
    alignItems:'center',
    justifyContent:'center',
   
  },
  btn:{
    borderWidth:1,
    borderRadius:15,
    width:deviceWidth * 0.2,
    height:70,
    alignItems:'center',
    justifyContent:'center',
    marginHorizontal:5
  },
  icono:{
    height:40,
    width: deviceWidth * 0.2,
    resizeMode:'contain'
  }
})