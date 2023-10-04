import { StyleSheet, View } from 'react-native'
import React from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import { ItemServiceDetail } from '../../../components/Services/ItemServiceDetail';
import { Text } from 'native-base';
import { BookingDetails } from '../../../components/Booking/BookingDetails';

export const BookingDetailsScreen = ({navigation,route}) => {
 
  const booking = route.params;
  
  return (
    <View>
      <HeaderTitle
      iconName='keyboard-backspace'
      nav={() => navigation.goBack()}
      titulo={'Detalles'}
      />
      <BookingDetails booking={booking} />
    </View>
  )
}


const styles = StyleSheet.create({})