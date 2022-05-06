import { View, Text,StyleSheet,TouchableOpacity } from 'react-native'
import React from 'react'
import CommonStyles from '../../util/styles/styles'
import { adjust, deviceWidth } from '../../util/Dimentions'

import Colors from '../../util/styles/colors'

const CheckboxTerms = ({roleName, isSelected, handlePress,text,bgColor,txtColor}) => {
    const selectedStyles = {
        // borderWidth: 1,
        borderColor: Colors.primarySolid,
        backgroundColor: Colors.primarySolid,
        borderRadius:1
      };
    
      const unSelectedStyles = {
        borderWidth: 0,
        // backgroundColor: Colors.white,
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
        // borderWidth: 1,
        // padding: 20,
        marginVertical:15,
        borderRadius: 15,
        // borderColor: 'rgba(0, 0, 0, 0.5)',
        // marginBottom: 20,
        // width: deviceWidth * 0.90,
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
        borderRadius: 12,
        borderWidth: 1,
        // backgroundColor: Colors.primarySolid,
        // borderColor: Colors.primarySolid,
      },
      roleType: {
        fontSize: adjust(8),
        color:Colors.white,
    
      },
})