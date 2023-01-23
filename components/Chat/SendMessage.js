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
            setMensaje('')
        }else{
            // console.log('vacio');
        }
        
    }

    
    const handleChange = text => setMensaje(text);

    return (
        <View style={styles.content} >
            {/* <View  style={styles.input} > */}
                <Input 
                mx="3" 
                placeholder="Mensaje" 
                // w="90%" 
                maxWidth="295px" 
                onChangeText={handleChange}
                value={mensaje}
                borderRadius={'3xl'}
                style={{backgroundColor:Colors.white,paddingLeft:15}}
                borderColor={Colors.bgColor}
                />

                
            {/* </View> */}
            <ButtonIconoInput name={'send'}  size={30} onPress={sendMessage} sending={sending} />
        </View>
        
    )
}



const styles = StyleSheet.create({
    content:{
        // marginBottom:6,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: Colors.bgColor,
        paddingVertical:7,
        // paddingHorizontal:10,
        // marginHorizontal:10
    },
    input:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: Colors.terciarySolid,
        // paddingVertical:7,
        // paddingHorizontal:5,
        // marginHorizontal:10
    }
})