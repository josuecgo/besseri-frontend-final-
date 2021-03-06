import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import Colors from '../../util/styles/colors';

const CustomSafeAreaViewComponent = ({children}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {width, height} = useWindowDimensions();

  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.darker : Colors.white,
    width: width,
    minHeight: height,
    backgroundColor:Colors.bgColor,
    flex:1,
  };

  return (
    <View style={backgroundStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>{children}</ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CustomSafeAreaViewComponent;
