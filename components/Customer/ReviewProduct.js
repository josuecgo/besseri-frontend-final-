import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '../../util/styles/colors'
import LinearGradient from 'react-native-linear-gradient'
import { adjust, deviceWidth } from '../../util/Dimentions'


export const ReviewProduct = () => {
  return (
    <View style={styles.body} >
     
      <TouchableOpacity>
        <LinearGradient
        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
        colors={[Colors.alert, Colors.alert, '#FF3301']}
        style={styles.linearGradient}
        >
          <Text style={styles.txt}>Escribir un comentario del producto</Text>
        </LinearGradient>
      </TouchableOpacity>

    </View>
  )
}



const styles = StyleSheet.create({
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5
  },
  linearGradient: {
    justifyContent:'center',
    alignItems:'center',
    paddingLeft: 15,
    paddingRight: 15,
    // borderRadius: 5,
    width: deviceWidth * 0.8 ,
    height: deviceWidth * 0.10,
    marginVertical:5,
    borderRadius:100
  },
  txt:{
    color:Colors.white,
    fontWeight:'bold',
    fontSize:adjust(10)
  }
})