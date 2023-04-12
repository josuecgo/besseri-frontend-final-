import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import axios from 'axios'
import { customer_api_urls } from '../../../util/api/api_essentials'
import { getUserId } from '../../../util/local-storage/auth_service'
import { ItemAgenda } from '../../../components/Services/ItemAgenda'

export const BookingScreen = ({navigation}) => {
  const [bookings, setBookings] = useState([])

  const getBookings = async() => {
    try {
      const userId = await getUserId();

      const apiCall = await axios.get(`${customer_api_urls.get_my_bookings}/${userId}`);

     
      setBookings(apiCall.data.data)
    } catch (error) {
      console.log("🚀 error:", error)
      
    }
  }


  useEffect(() => {
    getBookings()
  }, [])
  
  console.log(bookings[0]);
  return (
    <View>
      <HeaderTitle
      iconName='keyboard-backspace'
      nav={() => navigation.goBack()}
      titulo={'Citas'}
      />

      <FlatList
      data={bookings}
      renderItem={({item}) => (
        <ItemAgenda service={item} />
      )}
      keyExtractor={(item) => item._id}
      />
    </View>
  )
}



const styles = StyleSheet.create({})