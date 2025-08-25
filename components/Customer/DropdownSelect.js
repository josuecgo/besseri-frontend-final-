import { View, Text, Platform, ActivityIndicator } from 'react-native'
import React from 'react'

import { CheckIcon, Select } from 'native-base';
import Colors from '../../util/styles/colors';
import { deviceWidth } from '../../util/Dimentions';

export const DropdownSelect = ({
    items,
    value,
    onChange,
    inp,
    label,
    placeholder,
    showLoader=false,
    w=deviceWidth,
    sizeIos = '2xl', 
    sizeAndroid = 'lg'
}) => {
  const size = Platform.OS === 'ios' ? sizeIos : sizeAndroid
 
  const handleChange = (e) => {
    
   
    
    onChange(e,inp)
  }
  
  
  
  return (
    <View style={{
      marginVertical:5,
      width:w
    }} >
      <Select 

        selectedValue={value} 
       
        placeholder={placeholder}
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />
        }} 
      
        onValueChange={itemValue => handleChange(itemValue)}
        backgroundColor={Colors.bgInput}
        borderColor={Colors.darker}
        borderWidth={'1px'}
        borderRadius={'10px'}
        size={size}
        >
          {
            showLoader ? <ActivityIndicator/> :items.map((el) => {
              
              
              return (
                <Select.Item 
              shadow={2} 
              label={el[label]} 
              value={el._id} 
              key={el._id} 
              />
              )
            } )
          }
        
        
      </Select>
    </View>
  )
}
