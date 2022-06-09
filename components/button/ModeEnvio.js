import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions'
import Colors from '../../util/styles/colors'


export const ModeEnvio = ({texto,iconName,subtitulo,nav}) => {
  return (
    <TouchableOpacity
    onPress={nav}
    style={styles.btn}
    >
      <MaterialIcons name={iconName}  size={25} color={Colors.textSecundary}/> 
      <Text style={styles.title} >{texto}</Text>
      <Text style={styles.subtitulo} >{subtitulo}</Text>
    </TouchableOpacity>
  )
}



const styles = StyleSheet.create({
    btn:{
        width:deviceWidth / 2.3,
        borderWidth:1,
        borderColor:'#D4D4D4',
        height:deviceHeight * 0.10,
        borderRadius:3,
        justifyContent:'center',
        alignItems:'center',
        margin:5
    },
    title:{
      fontSize:adjust(10),
      color:Colors.textSecundary
    },
    subtitulo:{
      fontSize:adjust(6),
      color:Colors.textSecundary
    }
})