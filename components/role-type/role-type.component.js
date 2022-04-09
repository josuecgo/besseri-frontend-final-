import React from 'react';
import CommonStyles from '../../util/styles/styles';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../../util/styles/colors';

const RoleTypeComponent = ({roleName, isSelected, handlePress}) => {
  const selectedStyles = {
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
  };

  const unSelectedStyles = {
    borderWidth: 0,
    backgroundColor: Colors.white,
  };

  return (
    <TouchableOpacity
      onPress={() => handlePress(roleName)}
      style={[styles.roleContainer, CommonStyles.flexCenter]}>
      <View style={{flex: 2}}>
        <View style={[styles.outer, CommonStyles.flexCenter]}>
          <View
            style={[
              styles.inner,
              isSelected ? selectedStyles : unSelectedStyles,
            ]}
          />
        </View>
      </View>
      <View style={{flex: 5}}>
        <Text style={[CommonStyles.fontFamily, styles.roleType]}>
          {roleName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  roleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: 20,
    borderRadius: 15,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 20,
    width: 200,
  },
  outer: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  roleType: {
    opacity: 0.5,
    fontSize: 18,
  },
});

export default RoleTypeComponent;
