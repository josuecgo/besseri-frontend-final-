import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ProductContext } from '../../util/context/Product/ProductContext';
import { adjust } from '../../util/Dimentions';
import { Button } from 'native-base';

export const MapCarDefault = ({changeCar}) => {
  const {carDefault} = useContext(ProductContext);
  
  return (
    <Pressable 
    onPress={changeCar}
    style={styles.body}
    >
      <View style={styles.left} >
        <MaterialIcons
        name="directions-car"
        color='black' 
        size={25}
        />
       
        <Text style={styles.car} >{carDefault?.model?.name} {carDefault?.maker?.name}</Text>
   
      
         </View>
     
     
    </Pressable>
  )
}



const styles = StyleSheet.create({
  body:{
    marginVertical:10,
    flexDirection:'row',
    // alignItems:'center',
    justifyContent:'space-between',
    
  },
  left:{
    flexDirection:'row',
    alignItems:'baseline',
  },
  car:{
    fontSize:adjust(14),
    marginLeft:5,
    textAlign:'right',
    textDecorationLine:'underline'
  }
})