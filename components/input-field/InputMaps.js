import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Input } from 'native-base'
import axios from 'axios'
import { customer_api_urls } from '../../util/api/api_essentials'
import Colors from '../../util/styles/colors'

import {useDebouncedValue} from "../../hooks/useDebouncedValue";

export const InputMaps = ({onDebounce}) => {
  const [textValue, setTextValue] = useState('');
  
  const deboncedValue = useDebouncedValue( textValue );
  const debounce = async(txt) => {
    
    setTextValue(txt)
            
  }

  useEffect(() => {
    onDebounce(deboncedValue);
}, [deboncedValue])

  return (
    <View>
      <Input 
      mx="3" 
      placeholder="Calle"
      onChangeText={debounce}
      color={Colors.white}
      />
    </View>
  )
}


const styles = StyleSheet.create({})