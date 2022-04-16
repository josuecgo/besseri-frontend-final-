import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View,Platform} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import {
  INCREMENT_CONSTANT,
  SCREEN_HORIZONTAL_MARGIN,
} from '../../util/constants';
import { adjust, deviceHeight } from '../../util/Dimentions';
import { HeaderBackground } from '../Background/HeaderBackground';

const TopCircleComponent = ({textHeading, subText}) => {
  const {width} = useWindowDimensions();
  

  return (
    <> 
    <HeaderBackground/>
      <View
      style={[
      styles.topColor,
      ]}>
          <Text style={[CommonStyles.fontFamily, styles.brandNameTitle]}>
            {textHeading}
          </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topColor: {
    marginBottom:0,
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
    justifyContent:'center',
    alignItems:'center'

  },
  brandNameTitle: {
    color: Colors.white,
    fontSize: adjust(16),
    
    // transform: [{translateY: 120}],
  },
  greetingsContainer: {
    
  },
  welcome: {
    fontSize: 22,
    textAlign: 'center',
  },
  signIn: {
    fontSize: 18,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default TopCircleComponent;
