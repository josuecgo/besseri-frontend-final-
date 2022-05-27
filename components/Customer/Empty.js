import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export const Empty = () => {
  return (
    <View style={styles.body} >
      <Text>Búsqueda sin resultado</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    body:{
        justifyContent:'center',
        alignItems:'center'
    }
})