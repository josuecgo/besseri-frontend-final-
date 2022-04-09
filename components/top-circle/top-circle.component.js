import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import {
  INCREMENT_CONSTANT,
  SCREEN_HORIZONTAL_MARGIN,
} from '../../util/constants';

const TopCircleComponent = ({textHeading, subText}) => {
  const {width} = useWindowDimensions();
  console.log('width', width);

  return (
    <View
      style={[
        CommonStyles.horizontalCenter,
        {
          backgroundColor: Colors.white,
          paddingHorizontal: SCREEN_HORIZONTAL_MARGIN,
        },
      ]}>
      <View style={{maxHeight: width - 100}}>
        <View
          style={[
            styles.topColor,
            CommonStyles.flexCenter,
            {
              width: width + INCREMENT_CONSTANT,
              height: width + INCREMENT_CONSTANT,
              borderRadius: (width + INCREMENT_CONSTANT) / 2,
            },
          ]}>
          <Text style={[CommonStyles.fontFamily, styles.brandNameTitle]}>
            besseri
          </Text>
        </View>
      </View>
      <View style={styles.greetingsContainer}>
        <Text style={[CommonStyles.fontFamily, styles.welcome]}>
          {textHeading}
        </Text>
        <Text style={[CommonStyles.fontFamily, styles.signIn]}>{subText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topColor: {
    backgroundColor: Colors.primaryColor,
    transform: [{translateY: -150}],
  },
  brandNameTitle: {
    color: Colors.white,
    fontSize: 40,
    transform: [{translateY: 120}],
  },
  greetingsContainer: {
    // transform: [{translateY: -120}],
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
