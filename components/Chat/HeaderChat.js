import { Platform, StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import CommonStyles from '../../util/styles/styles'
import Colors from '../../util/styles/colors'
import { deviceHeight } from '../../util/Dimentions'
import { HeaderBackground } from '../Background/HeaderBackground'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export const HeaderChat = ({nav,titulo,iconName='keyboard-backspace',subtitulo}) => {


  return (
    <>
      	<HeaderBackground/>
        <View style={styles.header}>
          {
            nav && (
               <TouchableOpacity
            onPress={nav}
            style={{alignSelf:'flex-start'}}>
                <MaterialCommunityIcons
                name={iconName}
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            )
          }
           
            <Text style={styles.headerText}>{titulo}</Text>
            <Text style={styles.headerSubText}>{subtitulo}</Text>
        </View>
    </>
  )
}

 

const styles = StyleSheet.create({
    header:{
        width: '100%',
        height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
        paddingHorizontal:20,
        alignItems:'center',
        justifyContent:'center'
    },
    headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20},
    headerSubText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:12},

})