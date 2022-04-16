import React from 'react';
import CommonStyles from '../../util/styles/styles';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../../util/styles/colors';
import { adjust, deviceWidth } from '../../util/Dimentions';

const RoleTypeComponent = ({roleName, isSelected, handlePress,text,bgColor}) => {
  const selectedStyles = {
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    borderRadius:10
  };

  const unSelectedStyles = {
    borderWidth: 0,
    // backgroundColor: Colors.white,
  };

  return (
    <TouchableOpacity
      onPress={() => handlePress(roleName)}
      style={[styles.roleContainer, CommonStyles.flexCenter,{backgroundColor:bgColor}]}>
      <View style={{flex:2}} >
        <View style={[styles.outer, CommonStyles.flexCenter]}>
          <View
            style={[
              styles.inner,
              isSelected ? selectedStyles : unSelectedStyles,
            ]}
          />
        </View>
      </View>
      <View style={{flex:4}}>
        <Text style={[CommonStyles.fontFamily, styles.roleType]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  roleContainer: {
    flexDirection: 'row',
    // borderWidth: 1,
    padding: 20,
    borderRadius: 15,
    // borderColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 20,
    width: deviceWidth * 0.90,
    
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
    // backgroundColor: Colors.primarySolid,
    // borderColor: Colors.primarySolid,
  },
  roleType: {
    fontSize: adjust(14),
    color:Colors.white,

  },
});

export default RoleTypeComponent;
