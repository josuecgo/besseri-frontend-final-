import { StyleSheet,  TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image, Text } from 'native-base'


export const ButtonService = ({label,icono,onPress,style=100}) => {
  return (
    <View style={[styles.btnService]}>
    <TouchableOpacity onPress={onPress} style={[styles.btn]}>
      <Image source={icono} style={[styles.icono, { width: style, height: style }]} alt={label} />
    </TouchableOpacity>
    <Text style={styles.labelText}>{label}</Text>
  </View>
  
    
  )
}

 

const styles = StyleSheet.create({
  btnService: {
    alignItems: 'center',
    height: 100,
    width: 100,
  },
  btn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icono: {
    height: 100,
    width: 100,
  },
  labelText: {
    flexWrap: 'nowrap', // Evita saltos de línea
  },
});