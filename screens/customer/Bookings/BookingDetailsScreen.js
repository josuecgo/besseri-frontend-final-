import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'

export const BookingDetailsScreen = ({navigation}) => {
 
  return (
    <View>
      <HeaderTitle
      iconName='keyboard-backspace'
      nav={() => navigation.goBack()}
      titulo={'Detalles'}
      />
      <Text>BookingDetailsScreen</Text>
    </View>
  )
}


const styles = StyleSheet.create({})