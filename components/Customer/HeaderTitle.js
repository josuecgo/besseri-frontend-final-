import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import CommonStyles from '../../util/styles/styles'
import Colors from '../../util/styles/colors'
import { adjust, deviceHeight } from '../../util/Dimentions'
import { HeaderBackground } from '../Background/HeaderBackground'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Divider, HStack } from 'native-base'
import { NewLogo } from '../NewLogo'


export const HeaderTitle = ({ nav, titulo, iconName = 'keyboard-backspace', tienda=false }) => {


  return (
    <>
      <HeaderBackground />
      <View style={styles.header}>
        <HStack space={4} alignItems={'center'} >
          {
            nav && (
              <TouchableOpacity
                onPress={nav}
                style={styles.btn}
              >
                <MaterialCommunityIcons
                  name={iconName}
                  color={Colors.white}
                  size={24}
                />
              </TouchableOpacity>
            )
          }

          <Text style={styles.headerText}>{titulo}</Text>
        </HStack>


        <NewLogo/>
      


      
      </View>
      <Divider
      _light={{
        bg: "#2C2A2A"
      }} _dark={{
        bg: "#2C2A2A"
      }}
      />
    </>
  )
}



const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: Platform.OS == 'ios' ? deviceHeight * 0.12 : deviceHeight * 0.10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  headerText: {
    ...CommonStyles.h2,
   
    
  },
  btn: {
    backgroundColor:Colors.darker,
    borderRadius:5,
    padding:2

  },

})