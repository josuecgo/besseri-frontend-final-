import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { deviceHeight, deviceWidth } from '../../util/Dimentions'
import CommonStyles from '../../util/styles/styles'

export const ListEmpty = ({msg}) => {
  
  return (
    <View style={styles.container} >
      <Text >{msg}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    container:{
        width:deviceWidth - 40,
        justifyContent:'center',
        alignItems:'center',
        flex:1,
        height:deviceHeight / 3
    }
})