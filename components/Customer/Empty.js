import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonStyles from '../../util/styles/styles'
import { deviceWidth } from '../../util/Dimentions'

export const Empty = () => {
  return (
    <View style={styles.body} >
      <Text style={CommonStyles.h2} >Búsqueda sin resultados.</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    body:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:deviceWidth / 2
    }
})