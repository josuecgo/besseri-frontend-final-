import { View, Text, Platform, ActivityIndicator } from 'react-native'
import React, { memo } from 'react'

import { CheckIcon, Select } from 'native-base';
import Colors from '../../util/styles/colors';
import { deviceWidth } from '../../util/Dimentions';

export const DropdownSelect = memo(({
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
    onChange(e, inp)
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
        onValueChange={handleChange}
        backgroundColor={Colors.bgInput}
        borderColor={Colors.darker}
        borderWidth={'1px'}
        borderRadius={'10px'}
        size={size}
      >
        {
          showLoader ? <ActivityIndicator/> : items.map((el) => (
            <Select.Item 
              shadow={2} 
              label={el[label]} 
              value={el._id} 
              key={el._id} 
            />
          ))
        }
      </Select>
    </View>
  )
}, (prevProps, nextProps) => {
  // Solo re-renderiza si cambian estas props específicas
  return prevProps.value === nextProps.value && 
         prevProps.items === nextProps.items &&
         prevProps.showLoader === nextProps.showLoader
})