import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Input } from 'native-base'
import Colors from '../../util/styles/colors'
import CommonStyles from '../../util/styles/styles'
import { deviceWidth } from '../../util/Dimentions'

export const InputTxt = ({onChangeText,keyboardType,value,placeholderText,secureTextEntry = false,label,autoCapitalize='words',double= false}) => {
  
  return (
    <View style={{marginVertical:10, width:double ? deviceWidth / 2 - 20: deviceWidth - 30}}  >
      <Text style={{...CommonStyles.h2}} >{label} </Text>
      <Input
        backgroundColor={Colors.bgInput}
        borderColor={Colors.darker}
        borderWidth={'1px'}
        borderRadius={'10px'}
        onChangeText={onChangeText}
        color={Colors.white}
        placeholderTextColor={Colors.placeholder}
        keyboardType={keyboardType}    
        value={value}
        placeholder={placeholderText}
        secureTextEntry={true}
        
        mt={'13px'}
        size={Platform.OS === 'ios' ? '2xl' : 'lg'}
        autoCapitalize={autoCapitalize}
      />
    </View>
  )
}

