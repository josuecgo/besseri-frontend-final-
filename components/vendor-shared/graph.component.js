import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {SCREEN_HORIZONTAL_MARGIN} from '../../util/constants';
import CommonStyles from '../../util/styles/styles';

const GraphComponent = ({
  earning,
  text,
  pathString,
  fillColor,
  cardColor,
  textColor,
  widthG = 1400,
  heightG = 10,
}) => {
  const {width} = useWindowDimensions();
  const innerContentWidth = width - SCREEN_HORIZONTAL_MARGIN * 2;

  return (
    <View
      style={[
        styles.metricsCard,
        {
          width: innerContentWidth,
          backgroundColor: cardColor,
        },
      ]}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${widthG} ${heightG}`}>
        <Path fill={fillColor} d={pathString} />
      </Svg>
      <View
        style={[
          styles.cardTextContainer,
          CommonStyles.flexDirectionRow,
          CommonStyles.justifySpaceBetween,
        ]}>
        <Text
          style={[
            CommonStyles.fontFamily,
            styles.cardText,
            {color: textColor},
          ]}>
          {text}
        </Text>
        <Text
          style={[
            CommonStyles.fontFamily,
            styles.cardText,
            {color: textColor,paddingLeft:5},
          ]}>
           MXN {earning}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metricsCard: {
    borderRadius: 12,
    height: 150,
    marginTop: SCREEN_HORIZONTAL_MARGIN,
  },
  cardTextContainer: {
    transform: [{translateY: -120}],
    paddingHorizontal: 20,
  },
  cardText: {
    fontSize: 24,
  },
});

export default GraphComponent;
