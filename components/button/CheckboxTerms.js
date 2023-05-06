import { View, Text,StyleSheet,TouchableOpacity } from 'react-native'
import React from 'react'
import CommonStyles from '../../util/styles/styles'
import { adjust, deviceWidth } from '../../util/Dimentions'

import Colors from '../../util/styles/colors'

const CheckboxTerms = ({roleName, isSelected, handlePress,text,bgColor,txtColor}) => {
    const selectedStyles = {
        // borderWidth: 1,
        borderColor: Colors.darker,
        backgroundColor: Colors.primaryColor,
        borderRadius:1
      };
    
      const unSelectedStyles = {
        borderWidth: 0,
        backgroundColor: Colors.white,
      };

     
    return (
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}} >
        <TouchableOpacity
            onPress={() => handlePress(roleName)}
            style={[styles.roleContainer,{backgroundColor:bgColor}]}>
            
            <View style={[styles.outer, CommonStyles.flexCenter]}>
                <View
                    style={[
                    styles.inner,
                    isSelected ? selectedStyles : unSelectedStyles,
                    ]}
                />
            
             </View>
        
        </TouchableOpacity>
        <View>
            <Text style={[CommonStyles.fontFamily, styles.roleType,{color:txtColor}]}>
            {text}
            </Text>
        </View>
    </View>
    
  )
}

export default CheckboxTerms

const styles = StyleSheet.create({
    roleContainer: {
        flexDirection: 'row',
        marginVertical:adjust(5),
        borderRadius: 15,
        backgroundColor:'blue',
        justifyContent:'center',
        alignItems:'center'
      },
      outer: {
        width: 15,
        height: 15,
        borderRadius: 1,
        borderWidth: 1,
        marginRight: 10,
        borderColor: 'rgba(0, 0, 0, 0.5)',
        
      },
      inner: {
        width: 12,
        height: 12,
        borderWidth: 1,
      },
      roleType: {
        fontSize: adjust(10),
        color:Colors.white,
      },
})