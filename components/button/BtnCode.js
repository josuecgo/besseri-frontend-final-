import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { HStack, Input } from 'native-base';
import Colors from '../../util/styles/colors';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import { CREDENTIAL_KEYS } from '../../screens/vendor/vendor-addservice.screen';

const BtnCode = ({ onChangeText }) => {
  const [code, setCode] = useState(['','','',''])

  const handleChangeInputs = (txt,p) => {
   
    const regex = /^[0-9]$/;
    if (regex.test(txt) || txt === '') {
      setCode(prevCode => {
        const newCode = [...prevCode];
        newCode[p] = txt;
        return newCode;
      });

      const str = [...code,txt].join("");
     
      onChangeText(str,CREDENTIAL_KEYS.OTP_CODE)
    }
    
  }
 

  return (
    <HStack space={4} justifyContent={'center'} >
      <Input
        style={styles.number}
        width={50}
        placeholderText={CREDENTIAL_KEYS.OTP_CODE}
        value={code[0]}
        secureTextEntry={false}
        keyboardType={KEYBOARD_TYPES.NUMERIC}
        onChangeText={inputText => {
          // onChangeText(inputText, CREDENTIAL_KEYS.OTP_CODE);
          handleChangeInputs(inputText,0)
        }}
      />

      <Input
        style={styles.number}
        width={50}
        placeholderText={CREDENTIAL_KEYS.OTP_CODE}
        value={code[1]}
        secureTextEntry={false}
        keyboardType={KEYBOARD_TYPES.NUMERIC}
        onChangeText={inputText => {
          // onChangeText(inputText, CREDENTIAL_KEYS.OTP_CODE);
          handleChangeInputs(inputText,1)
        }}
      />

      <Input
        style={styles.number}
        width={50}
        placeholderText={CREDENTIAL_KEYS.OTP_CODE}
        value={code[2]}
        // value={userCredentials[CREDENTIAL_KEYS.OTP_CODE]}
        secureTextEntry={false}
        keyboardType={KEYBOARD_TYPES.NUMERIC}
        onChangeText={inputText => {
          
          // onChangeText(inputText, CREDENTIAL_KEYS.OTP_CODE);
          handleChangeInputs(inputText,2)
        }}
      />

      <Input
        style={styles.number}
        width={50}
        placeholderText={CREDENTIAL_KEYS.OTP_CODE}
        value={code[3]}
        // value={userCredentials[CREDENTIAL_KEYS.OTP_CODE]}
        secureTextEntry={false}
        keyboardType={KEYBOARD_TYPES.NUMERIC}
        onChangeText={inputText => {
          // onChangeText(inputText, CREDENTIAL_KEYS.OTP_CODE);
          handleChangeInputs(inputText,3)
        }}
      />
    </HStack>
  )
}

export default BtnCode

const styles = StyleSheet.create({
  number: {
    color: Colors.white
  }
})