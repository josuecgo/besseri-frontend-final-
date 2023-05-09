import { View, Text } from 'react-native'
import React from 'react'
import { Input } from 'native-base'
import Colors from '../../util/styles/colors'
import CommonStyles from '../../util/styles/styles'

export const InputTxt = ({onChangeText,keyboardType,value,placeholderText,secureTextEntry =false,label}) => {
  return (
    <View style={{marginVertical:10}} >
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
        secureTextEntry={secureTextEntry}
        mt={'13px'}
        // height={'42px'}
      />
    </View>
  )
}

