import React from 'react';
import CommonStyles from '../../util/styles/styles';
import {StyleSheet, Text} from 'react-native';
import Colors from '../../util/styles/colors';

const SideOptionComponent = ({navigation, keyToRoute, textAlign, text}) => {
  return (
    <Text
      onPress={() => {
        navigation.navigate(keyToRoute);
      }}
      style={[
        CommonStyles.fontFamily,
        styles.forgotPassword,
        {textAlign: textAlign},
      ]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    backgroundColor: Colors.white,
    color: Colors.primaryColor,
    fontSize: 14,
    position: 'relative',
    right: -80,
  },
});

export default SideOptionComponent;
