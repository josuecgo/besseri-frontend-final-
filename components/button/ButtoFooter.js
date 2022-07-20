import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '../../util/styles/colors'
import AntDesign from 'react-native-vector-icons/AntDesign';


export const ButtonFooter = ({action,text,icon}) => {
  return (
    <View style={styles.footer} >
            <TouchableOpacity onPress={ action } style={styles.btn}>
                <View style={styles.btnText} >
                    {/* <AntDesign name={icon} color={Colors.white} size={24}/> */}
                    <Text style={{fontSize:18,color:Colors.white}} >{text}</Text>
                </View>
                
            </TouchableOpacity>
        </View>
  )
}

 

const styles = StyleSheet.create({
    footer:{
        position:'absolute',
        bottom:10,
        
        width:'100%'
    },
    btn:{
        padding:10,
        alignItems:'center',
        backgroundColor:Colors.terciarySolid,
        marginHorizontal:10,
        borderRadius:5
    },
    btnText:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        width:'100%',

        
    }
})