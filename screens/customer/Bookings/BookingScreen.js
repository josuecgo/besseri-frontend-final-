import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import axios from 'axios'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import { customer_api_urls } from '../../../util/api/api_essentials'
import { getUserId } from '../../../util/local-storage/auth_service'
import { ItemAgenda } from '../../../components/Services/ItemAgenda'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { ServiceSkeleton } from '../../../components/Services/ServiceSkeleton';
import Loading from '../../../components/Loader/Loading';

export const BookingScreen = ({navigation}) => {
  const isFocus = useIsFocused()
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([])

  const getBookings = async() => {
    try {
      setIsLoading(true)
      const userId = await getUserId();

      const apiCall = await axios.get(`${customer_api_urls.get_my_bookings}/${userId}`);

     
      setBookings(apiCall.data.data)

      setIsLoading(false)
    } catch (error) {
      showToaster('Error con el servidor')
      setIsLoading(false)
      
    }
  }

  const goBooking = (booking) => {
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.BOOKING_DETAIL,booking)
  }


  useEffect(() => {
    if (isFocus) {
      getBookings()
    }
    
  }, [isFocus])
  

  if(isLoading) return <Loading/>
  
  return (
    <View style={styles.booking} >
      <HeaderTitle
      iconName='keyboard-backspace'
      nav={() => navigation.goBack()}
      titulo={'Reservación'}
      />

      <FlatList
      data={bookings}
      renderItem={({item}) => (
        <ItemAgenda service={item} goBooking={goBooking} />
      )}
      keyExtractor={(item) => item._id}
      />
    </View>
  )
}



const styles = StyleSheet.create({
  booking:{
    flex:1,
    // backgroundColor:'black'
  }
})