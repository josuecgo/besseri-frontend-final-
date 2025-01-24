import { StyleSheet, Image, View } from 'react-native'
import React from 'react'

export const NewLogo = ({ height= 50,width=40}) => {
  return (
    <>
       <Image
            source={require('../assets/images/newLogo.png')}
          
            style={{
              height: height,
              width: width,
             resizeMode:'contain'
            }}
            
          /> 
    </>
  )
}



const styles = StyleSheet.create({
  logo: {
    height: 50,
    width: 40,
    resizeMode:'contain'
  },
})