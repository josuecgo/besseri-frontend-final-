import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { InputMaps } from '../../../components/input-field/InputMaps'
import Colors from '../../../util/styles/colors'
import axios from 'axios'
import { customer_api_urls } from '../../../util/api/api_essentials'

export const SearchAddressScreen = () => {
  const [ term, setTerm ] = useState('');
  const [addresses, setAddresses] = useState([])

  const autocompleteAddress = async() => {
     const apiCall = await axios.get(`${customer_api_urls.search_addresses}/${term}`);

     console.log(apiCall.data.data.length);
  
  }

  useEffect(() => {
    if ( term.length === 0 ) {
      return setAddresses([]);
    }
    autocompleteAddress()
  }, [term])
  
  return (
    <View style={styles.search} >
      <Text>SearchAddressScreen</Text>
      <InputMaps
      onDebounce={ (value) => setTerm( value )  }
      />
    </View>
  )
}



const styles = StyleSheet.create({
  search:{
    backgroundColor:Colors.bgColor,
    flex:1
  }
})