import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { Avatar, HStack, Text, Input, Box, Pressable, Divider, ScrollView } from 'native-base'

import Colors from '../../util/styles/colors'

import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export const InputMaps = ({ placeholder, onDebounce, addresses, onChangeDirection, textValue, setTextValue }) => {

  const {top} = useSafeAreaInsets()
  const deboncedValue = useDebouncedValue(textValue);
  const debounce = async (txt) => {

    setTextValue(txt)

  }

  useEffect(() => {
    onDebounce(deboncedValue);
  }, [deboncedValue])

  return (
    <View style={[styles.inpSearch,{paddingTop:top}]} >
      <Input
        mx="3"
        placeholder={placeholder}
        onChangeText={debounce}
        color={Colors.white}
        value={textValue}

      />

      {/* {
        addresses && addresses.length > 0 && (
          <FlatList
            data={addresses}
            renderItem={({ item }) => (
              <Box
                pl={["0", "4"]} 
                pr={["0", "5"]} 
                mx={5}
              >
                <Pressable
                  onPress={() => onChangeDirection(item)} rounded="8"
                >
                  <HStack
                    alignItems={'center'}
                  
                    space={4}
                    w="90%"
                  >
                    <Avatar size="25px"
                      source={require('../../assets/images/iconos/ubicacion.png')}
                      backgroundColor={Colors.white}
                    />
                    <Text width="100%" flexShrink={1} color={Colors.white} > {item?.formatted_address} </Text>
                  </HStack>
                </Pressable>
              <Divider />
              </Box>

            )}
            ListFooterComponent={() => <View style={{ height: 80 }} ></View>}
          />
        )
      } */}
      <ScrollView>
        {
  addresses && addresses.length > 0 && addresses.map((item, index) => (
    <Box
      key={index} // Asegúrate de proporcionar una clave única para cada elemento
      pl={["0", "4"]} 
      pr={["0", "5"]} 
      mx={5}
    >
      <Pressable
        onPress={() => onChangeDirection(item)} rounded="8"
      >
        <HStack
          alignItems={'center'}
          space={4}
          w="90%"
        >
          <Avatar size="25px"
            source={require('../../assets/images/iconos/ubicacion.png')}
            backgroundColor={Colors.white}
          />
          <Text width="100%" flexShrink={1} color={Colors.white} > {item?.formatted_address} </Text>
        </HStack>
      </Pressable>
      <Divider />
    </Box>
  ))
}
      </ScrollView>




    </View>
  )
}


const styles = StyleSheet.create({
  inpSearch: {
    // backgroundColor:'transparent',

    paddingVertical: 5,
   
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:Colors.bgColor
    // flex:1

  }
})