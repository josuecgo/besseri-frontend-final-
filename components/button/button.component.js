import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import { adjust } from '../../util/Dimentions';

const ButtonComponent = ({
  icon,
  buttonText,
  handlePress,
  width = undefined,
  colorB = Colors.primarySolid ,
  disabled,
  disabledColor,
  height = 50,
  borderRadius = 5,
  isLoading = false,
  padding,
  margin,
  colorT,
  ...styleProps
  
}) => {

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={() => handlePress(buttonText)}
      style={{...styleProps, borderRadius,margin:margin ? margin : 0}}>
      <View
        style={{
          ...styles.button,
          backgroundColor: disabled ? disabledColor : colorB,
          width: width,
          height: height,
          borderRadius,
          padding:padding ? padding : 15
        }}>
        <Text style={[CommonStyles.fontFamily, styles.buttonText,{color:colorT?colorT:'white'}]}>
          {buttonText}
        </Text>
        {icon}
        {isLoading ? (
          <ActivityIndicator
            style={styles.loader}
            size={18}
            color={Colors.white}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontSize: adjust(12),
  },
  loader: {
    marginLeft: 10,
  },
});

export default ButtonComponent;
