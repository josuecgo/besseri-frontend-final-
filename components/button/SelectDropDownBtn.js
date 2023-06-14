import { Pressable, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Box, CheckIcon, Input, ScrollView, Select, Text } from 'native-base'
import Colors from '../../util/styles/colors';
import { deviceWidth } from '../../util/Dimentions';

export const SelectDropDownBtn = ({value,items,onChange,years = false}) => {
 

  const changeValue = (item) => {
    onChange(item)
   
  }
  return (
    <View style={styles.body} >
      <Box>
        {
          !years ? (
            <Select
                dropdownIcon={<MaterialCommunityIcons 
                  name='menu-down' 
                  color={Colors.white} 
                  size={35}
                />}
                rounded={'lg'}
                variant='unstyled'
                selectedValue={value}
                // minWidth={deviceWidth * 0.35}
                accessibilityLabel="Marca"
                placeholder="Selecciona"
                _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                }}
                color={Colors.white}
                onValueChange={itemValue => changeValue(itemValue)}
                
                borderColor={Colors.lightBorder}
                backgroundColor={Colors.lightBlack}
                textTransform={'uppercase'}
                size={'2xl'}
            >
                {
                    items.map((item) => <Select.Item 
                    key={item._id} 
                    label={item?.name} 
                    value={item._id} 
                    textTransform={'uppercase'}
                   
                    />)
                }

            </Select>
          ):(
            <Select
            size={'2xl'}
            dropdownIcon={<MaterialCommunityIcons 
              name='menu-down' 
              color={Colors.white} 
              size={35}
            />}
                rounded={'lg'}
                variant='unstyled'
                selectedValue={value}
                // minWidth={deviceWidth * 0.35}
                accessibilityLabel="Año"
                placeholder="Selecciona"
                _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                }}
                
                onValueChange={itemValue => changeValue(itemValue)}
                
                borderColor={Colors.lightBorder}
                backgroundColor={Colors.lightBlack}
                textTransform={'uppercase'}
                color={Colors.white}
            >
              {
                items.map((item, i) => <Select.Item 
                key={item} 
                label={item.toString()} 
                value={item} />)
              }

          </Select>
          )
        }
      
      </Box>
    
    </View>
  )
}

 

const styles = StyleSheet.create({
  body:{
    marginBottom:22
  }
})