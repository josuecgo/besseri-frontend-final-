import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonStyles from '../../../util/styles/styles'

export const PedidosScreen = () => {
  return (
    <View style={styles.pedidos} >
      <Text>PedidosScreen</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  pedidos:{
    ...CommonStyles.screenY
  }
})