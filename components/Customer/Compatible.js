import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../util/styles/colors'
import { adjust } from '../../util/Dimentions'

export const Compatible = ({carDefault}) => {
  
  // console.log(carDefault);

  return (
    <View style={styles.container} >
      <Text style={styles.txt} >Compatible con {carDefault?.model?.name} {carDefault.year} </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
   backgroundColor:Colors.terciarySolid,
  //  borderRadius:10,
   paddingHorizontal:5,
   marginBottom:10,
   width:'100%'
  },
  txt:{
    color:Colors.white,
    // fontWeight: 'bold',
    fontSize:adjust(12)
  }
})