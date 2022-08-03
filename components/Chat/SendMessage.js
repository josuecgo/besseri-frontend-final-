import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Input } from 'native-base'
import { ButtonIconoInput } from '../button/ButtonIconoInput'
import Colors from '../../util/styles/colors'
import { useContext } from 'react'
import { ChatContext } from '../../util/context/Chat/ChatContext'

export const SendMessage = () => {
    const { chatState, getMensajes } = useContext(ChatContext);
    return (
        <View style={styles.content} >
        <Input 
        mx="3" 
        placeholder="Mensaje" 
        w="75%" 
        maxWidth="300px" 
        />

        <ButtonIconoInput name={'send'}  size={20} />
        </View>
    )
}



const styles = StyleSheet.create({
    content:{
        // marginBottom:6,
        flexDirection:'row',
        alignItems:'center',
        // backgroundColor: Colors.terciarySolid,
        paddingVertical:7,
        paddingHorizontal:5,
        marginHorizontal:10
    }
})