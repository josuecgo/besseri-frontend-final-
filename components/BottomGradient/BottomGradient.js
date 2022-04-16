import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Colors from '../../util/styles/colors'
import { deviceWidth } from '../../util/Dimentions'

export const BottomGradient = ({texto,colorGradient=Colors.primaryGradient,nav,txtColor}) => {
  return (
    <>
     
            <TouchableOpacity
            onPress={nav}
            >
                <LinearGradient 
                colors={colorGradient} 
                style={styles.linearGradient} 
                >
                    <Text style={{ color:txtColor }} >{texto}</Text>
                </LinearGradient>
            </TouchableOpacity>
       
           
    </>
  )
}



const styles = StyleSheet.create({
    linearGradient: {
        justifyContent:'center',
        alignItems:'center',
        paddingLeft: 15,
        paddingRight: 15,
        // borderRadius: 5,
        width: deviceWidth / 2 ,
        height: deviceWidth * 0.12,
        marginVertical:10
      },
})