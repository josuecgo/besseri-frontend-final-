import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../util/styles/colors'
import { adjust } from '../../util/Dimentions'
import { useSelector } from 'react-redux'

export const Compatible = ({autopart}) => {
  const {carActive} = useSelector(state => state.user);
  

 
  if(!carActive || autopart === carActive.model?._id) return null;
  return (
    <View style={styles.container} >
      <Text style={styles.txt} >Compatible con {carActive?.model?.name} {carActive.year} </Text>
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