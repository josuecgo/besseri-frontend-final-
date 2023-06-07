import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  useColorScheme,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import Colors from '../../util/styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomSafeAreaViewComponent = ({children}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {width, height} = useWindowDimensions();
  const { top,bottom } = useSafeAreaInsets()
  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.darker : Colors.white,
    width: width,
    minHeight: height,
    backgroundColor:Colors.bgColor,
    flex:1,
    paddingTop:top,
    paddingBottom: bottom
  };

  return (
    <View style={backgroundStyle}>
      {/* <ImageBackground
      source={require('../../assets/images/car_fondo.png')}
      style={backgroundStyle}
      > */}
         <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false} >{children}</ScrollView>
      </KeyboardAvoidingView>
      {/* </ImageBackground> */}
     
    </View>
  );
};

export default CustomSafeAreaViewComponent;
