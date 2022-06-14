import { StyleSheet, Text, View ,Image} from 'react-native'
import React from 'react'
import Colors from '../util/styles/colors'

export const NotificationEmpty = () => {
  return (
    <View style={styles.content} >
      <Image
      source={require('../assets/images/noti.png')}
      style={{
        height:110,
        width:110,
        resizeMode:'stretch'
      }}
      />
      <Text style={styles.texto} >Sin notificaciones</Text>
    </View>
  )
}



const styles = StyleSheet.create({
    content:{
        justifyContent:'center',
        alignItems:'center',
        paddingTop:50
    },
    texto:{
        color:Colors.textSecundary,
        // opacity:0.5
    }
})