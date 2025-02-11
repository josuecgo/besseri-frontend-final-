import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../util/styles/colors'
import { adjust } from '../../util/Dimentions'
import { useSelector } from 'react-redux'
import CommonStyles from '../../util/styles/styles'

export const Compatible = ({autopart}) => {
  const {carActive,modelos} = useSelector(state => state.user);
 
  const model = carActive?.model?._id || carActive?.model

  
  
 
  if(!carActive || autopart === model || !model ) return null;
  
  const getNameModel = (id) => {
    const model = modelos.find(m => m?._id === id);
    return model?.name;
  }

  
  
  
  return (
    <View style={styles.container} >
      <Text style={styles.txt} >Compatible con:</Text>
      <Text style={styles.txt}>{getNameModel(model)} {carActive?.year} </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
   backgroundColor:Colors.black,
  //  borderRadius:10,
   paddingHorizontal:5,
   marginBottom:10,
   width:'100%',
   borderRadius:10,
   paddingHorizontal:10,
   paddingVertical:5,
   alignItems:'center'
  },
  txt:{
   ...CommonStyles.h5
  }
})