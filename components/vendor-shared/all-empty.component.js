import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CommonStyles from '../../util/styles/styles';

const AllEmptyComponent = ({customText = 'All Empty Here'}) => {
  return (
    <View style={CommonStyles.flexCenter}>
      <Text style={[CommonStyles.fontFamily, styles.noNotifications]}>
        {customText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noNotifications: {
    opacity: 0.5,
    fontSize: 20,
  },
});

export default AllEmptyComponent;
