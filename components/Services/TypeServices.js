import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HStack } from 'native-base';


export const TypeServices = ({service}) => {
  
  return (
    <HStack 
    justifyContent={'space-between'}
    alignItems={'center'}
    style={styles.type} >
      <View>
        <Text style={styles.name} >{service.name}</Text>
        <Text>{service.type}</Text>
        
      </View>
      <MaterialIcons name='chevron-right'  size={28} color={'black'} />
    </HStack>
  )
}

const styles = StyleSheet.create({
  type:{
    // backgroundColor:'red',
    marginVertical:5,
    borderWidth:1,
    padding:10,
    borderRadius:5
  },
  name:{
    fontSize:20
  }
})