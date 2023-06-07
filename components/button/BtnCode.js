import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HStack, Input } from 'native-base';
import Colors from '../../util/styles/colors';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import { CREDENTIAL_KEYS } from '../../screens/vendor/vendor-addservice.screen';

const BtnCode = ({ onChangeText }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = Array(4).fill(0).map(() => useRef(null));

  const handleChangeInputs = (txt, index) => {
    const regex = /^[0-9]$/;
    if (regex.test(txt) || txt === '') {
      setCode(prevCode => {
        const newCode = [...prevCode];
        newCode[index] = txt;
        return newCode;
      });

      const str = [...code, txt].join('');
      onChangeText(str, CREDENTIAL_KEYS.OTP_CODE);

      // Pasar al siguiente input si hay un valor ingresado y no es el último input
      if (txt && index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  return (
    <HStack space={4} justifyContent={'center'}>
      {code.map((value, index) => (
        <Input
          key={index}
          ref={inputRefs[index]}
          style={styles.number}
          width={50}
          placeholderText={CREDENTIAL_KEYS.OTP_CODE}
          value={value}
          secureTextEntry={false}
          keyboardType={KEYBOARD_TYPES.NUMERIC}
          onChangeText={inputText => handleChangeInputs(inputText, index)}
          onSubmitEditing={() => {
            // Pasar al siguiente input cuando se presiona "Enter" en el teclado
            if (index < inputRefs.length - 1) {
              inputRefs[index + 1].current.focus();
            }
          }}
          size={'2xl'}
        />
      ))}
    </HStack>
  );
};

export default BtnCode

const styles = StyleSheet.create({
  number: {
    color: Colors.white
  }
})