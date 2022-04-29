import React, {forwardRef, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import { deviceWidth } from '../../util/Dimentions';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';

const InputFieldComponent = forwardRef(
  (
    {
      icon,
      placeholderText,
      keyboardType,
      onChangeText,
      value,
      secureTextEntry,
      returnType = 'default',
      nextFieldRef,
      validator,
      hintText,
      width,
      isFocusedColor = Colors.primarySolid,
      color,
      borderRadius,
      height,
      multiline,
      onFocus
    },
    ref,
  ) => {
    const [isFocused, setFocused] = useState();
    const [isValidated, setIsValidated] = useState(true);
    
    const onBlur = () => {
      if (!validator) {
        return;
      }
      setIsValidated(validator(value));
      setFocused(false);
    };

    return (
      <View style={{alignItems:'center'}} >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            
          }}>
          <View style={{
              marginRight: 7,
              marginBottom:9,
              justifyContent:'center',
              alignItems:'center',
          }}
              >{icon}
          </View>

          <View
            style={[
              styles.iconView,
              // CommonStyles.flexCenter,
              {
                borderWidth: isFocused ? 1.5 : 1,
                borderColor: isFocusedColor,
                width: width ? width : deviceWidth * 0.78,
                height: height ? height : 35,
                borderRadius: borderRadius ? borderRadius : 2,
                backgroundColor: isFocused ? '#e6e6ff' : Colors.white,
              },
            ]}>
            <TextInput
              placeholderTextColor={Colors.darker}
              style={[
                styles.textInput,
                {
                  width: width ? width : '90%',
                  color: color ? color : Colors.dark,
                },
              ]}
              keyboardType={keyboardType}
              onChangeText={onChangeText}
              value={value}
              placeholder={placeholderText}
              secureTextEntry={secureTextEntry}
              multiline={multiline}
              onFocus={() => {
                setFocused(true);
                onFocus ? onFocus() : {};
              }}
              onBlur={onBlur}
              returnKeyType={returnType}
              ref={ref}
              onSubmitEditing={() => {
                if (nextFieldRef) {
                  nextFieldRef.current.focus();
                }
              }}
            />
          </View>
        </View>

        {!isValidated ? (
          <Text style={[CommonStyles.fontFamily, styles.hintText]}>
            {hintText}
          </Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  textInput: {
    padding: 0,
  },
  iconView: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: Colors.gray,
  },
  hintText: {
    color: 'red',
    opacity: 0.5,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 12,
  },
});

export default InputFieldComponent;
