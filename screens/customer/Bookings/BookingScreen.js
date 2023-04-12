import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'

export const BookingScreen = ({navigation}) => {

  


  return (
    <View>
      <HeaderTitle
      iconName='keyboard-backspace'
      nav={() => navigation.goBack()}
      titulo={'Citas'}
      />
    </View>
  )
}



const styles = StyleSheet.create({})