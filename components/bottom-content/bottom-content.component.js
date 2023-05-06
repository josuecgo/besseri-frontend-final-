import React from 'react';
import {View} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import {SCREEN_HORIZONTAL_MARGIN} from '../../util/constants';

const BottomContentComponent = ({children}) => {
  return (
    <View
      style={[CommonStyles.flexCenter, {marginVertical: SCREEN_HORIZONTAL_MARGIN}]}>
      {children}
    </View>
  );
};

export default BottomContentComponent;
