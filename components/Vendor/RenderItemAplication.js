import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CommonStyles from '../../util/styles/styles'
import { deviceWidth } from '../../util/Dimentions'

export const RenderItemAplication = ({item,handleChange,backgroundColor,selected = false}) => {

    

    return (
        <TouchableOpacity
        onPress={() => handleChange(item)}
        style={[
        styles.flatListCardBtn,
        {
            backgroundColor: backgroundColor,
        },
        ]}>
        <Text
        style={{
            ...styles.flatListCardBtnText,
            fontWeight: selected === item._id ? 'bold' : 'normal',
        }}>
        del: {item.de} al: {item.de}
        </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row'
    },
    flatListCardBtn: {
        padding: 10,
        borderBottomWidth: 0.5,
        width: deviceWidth,
        ...CommonStyles.flexCenter,
      },
    flatListCardBtnText: {fontSize: 19, fontWeight: '300'},
})