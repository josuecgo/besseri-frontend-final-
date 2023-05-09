import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'native-base'

export const NewLogo = ({ height= 50,width=40}) => {
  return (
    <>
       <Image
            source={require('../assets/images/newLogo.png')}
            alt='logo'
            style={{
              height: height,
              width: width,
             
            }}
            resizeMode='contain'
          />
    </>
  )
}



const styles = StyleSheet.create({
  logo: {
    height: 50,
    width: 40
  },
})