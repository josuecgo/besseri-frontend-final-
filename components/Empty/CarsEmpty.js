import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { deviceHeight } from '../../util/Dimentions'
import CommonStyles from '../../util/styles/styles'

export const CarsEmpty = () => {
  return (
    <View style={styles.empty} >
      <Text style={styles.txt} >Crea tu vehiculos</Text>
      <Text style={styles.txt} >para brindarte un mejor servicio</Text>
    </View>
  )
}

 

const styles = StyleSheet.create({
  empty:{
    flex:1,
   
    justifyContent:'center',
    alignItems:'center',
    height:deviceHeight * 0.70
  },
  txt:{
    ...CommonStyles.h4
  }
})