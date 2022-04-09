import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
    backgroundColor:Colors.white,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>{children}</ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CustomSafeAreaViewComponent;
