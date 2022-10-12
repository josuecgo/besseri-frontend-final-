import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Input } from 'native-base'
import { ButtonIconoInput } from '../button/ButtonIconoInput'
import Colors from '../../util/styles/colors'
import { useContext } from 'react'
import { ChatContext } from '../../util/context/Chat/ChatContext'
import { useState } from 'react'

export const SendMessage = (props) => {
    const { enviarMensaje,mensaje,setMensaje,sending } = useContext(ChatContext);
    

    const sendMessage = () => {
        if (mensaje) {
            enviarMensaje({...props,mensaje})
           
        }else{
            // console.log('vacio');
        }
        
    }

    
    const handleChange = text => setMensaje(text);

    return (
        <View style={styles.content} >
            <Input 
            mx="3" 
            placeholder="Mensaje" 
            w="75%" 
            maxWidth="300px" 
            onChangeText={handleChange}
            />

            <ButtonIconoInput name={'send'}  size={20} onPress={sendMessage} sending={sending} />
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