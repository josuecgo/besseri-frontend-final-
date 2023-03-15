import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, HStack, Text, Input, Box, Pressable } from 'native-base'

import Colors from '../../util/styles/colors'

import {useDebouncedValue} from "../../hooks/useDebouncedValue";
import { adjust } from '../../util/Dimentions';

export const InputMaps = ({placeholder,onDebounce,addresses,onChangeDirection,textValue,setTextValue}) => {
  
  
  const deboncedValue = useDebouncedValue( textValue );
  const debounce = async(txt) => {
    
    setTextValue(txt)
            
  }

  useEffect(() => {
    onDebounce(deboncedValue);
}, [deboncedValue])
  
  return (
    <View style={styles.inpSearch} >
      <Input 
      mx="3" 
      placeholder={placeholder}
      onChangeText={debounce}
      color={Colors.dark}
      value={textValue}
      
      />
      <FlatList
      data={addresses}
      renderItem={({item}) => (
        <Box
        pl={["0", "4"]} pr={["0", "5"]} py="2"
        
        >
          <Pressable
          onPress={() => onChangeDirection(item)} rounded="8" 
          >
            <HStack
            alignItems={'center'}
            justifyContent={'center'}
            w="100%"
            >
              <Avatar size="25px" 
              source={require('../../assets/images/iconos/ubicacion.png')} 
              backgroundColor='transparent'
              />
              <Text width="100%" flexShrink={1}  > {item?.formatted_address} </Text>
            </HStack>
          </Pressable>
          
        </Box>
        
      )}
      ListFooterComponent={() => <View style={{height:90}} ></View>}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  inpSearch:{
    // backgroundColor:'red',
    paddingVertical:10,
    // flex:1
    
  }
})