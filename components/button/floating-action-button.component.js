import React from 'react';
import {StyleSheet, View} from 'react-native';
import ButtonComponent from './button.component';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../util/styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FloatingActionButtonComponent = ({handler}) => {
  const {bottom}  = useSafeAreaInsets()
  return (
    <View style={[styles.floatingButtonContainer,{bottom: Platform.OS == 'ios' ? 150  + bottom * 1.2 : 110  + bottom * 1.2 }]}>
      <ButtonComponent
        icon={<AntDesign size={18} color={Colors.white} name="plus" />}
        colorB={Colors.terciarySolid}
        width={50}
        height={50}
        handlePress={handler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    right: 15,
    
    zIndex: 999,
  },
});

export default FloatingActionButtonComponent;
