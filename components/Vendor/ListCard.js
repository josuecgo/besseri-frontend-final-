import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import CommonStyles from '../../util/styles/styles'
import { deviceWidth } from '../../util/Dimentions'


const ListCard = ({ name, onPress,backgroundColor,selected,index }) => {
    
    return (
    <TouchableOpacity key={index} onPress={onPress} style={[styles.flatListCardBtn,{
        backgroundColor:backgroundColor
      }]}>
        <Text style={{...styles.flatListCardBtnText,fontWeight:selected ? 'bold' : 'normal'}}>{name}</Text>
    </TouchableOpacity>
  )
}

export default ListCard

const styles = StyleSheet.create({
    flatListCardBtn: { padding: 10, borderBottomWidth: 0.5, width: deviceWidth, ...CommonStyles.flexCenter },
})