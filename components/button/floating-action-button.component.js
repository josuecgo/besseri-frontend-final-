import React from 'react';
import {StyleSheet, View} from 'react-native';
import ButtonComponent from './button.component';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../util/styles/colors';

const FloatingActionButtonComponent = ({handler}) => {
  return (
    <View style={styles.floatingButtonContainer}>
      <ButtonComponent
        icon={<AntDesign size={18} color={Colors.white} name="plus" />}
        colorB={Colors.secondaryColorBlueShade}
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
    right: 20,
    bottom: 30,
    zIndex: 2,
  },
});

export default FloatingActionButtonComponent;
