import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Box, HStack, Image } from 'native-base';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';


export const TypeServices = ({service}) => {
  
  return (
    <HStack 
    justifyContent={'space-between'}
    alignItems={'center'}
    style={styles.type} >

      <HStack alignItems={'center'}  space={4}  >
        <Image
        source={require('../../assets/images/odometro.png')}
        style={{
          width:50,
          height:50
        }}
        alt='odometro'
        />
        <Box>
          <Text style={styles.name} >{service.name}</Text>
          <Text style={styles.sub} >{service.type}</Text>
        </Box>
        
        
      </HStack>
      <MaterialIcons name='arrow-right-circle'  size={30} color={'#868686'} />
    </HStack>
  )
}

const styles = StyleSheet.create({
  type:{
    // backgroundColor:'red',
    marginVertical:5,
    borderWidth:1,
    padding:10,
    borderRadius:5,
    borderColor:Colors.borderColor
  },
  name:{
    ...CommonStyles.h1
  },
  sub:{
    ...CommonStyles.h2
  }
})