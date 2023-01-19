import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React,{ useContext,useState }  from 'react'
import { ChatContext } from '../../util/context/Chat/ChatContext';

import { SendMessage } from '../../components/Chat/SendMessage';
import { IncomingMessage } from '../../components/Chat/IncomingMessage';
import Colors from '../../util/styles/colors';
import { useEffect } from 'react';
import { OutgoingMessage } from '../../components/Chat/OutgoingMessage';
import { HeaderChat } from '../../components/Chat/HeaderChat';




export const PrivateScreen = (props) => {
    
    const { mensajes, getMensajes, chatActivo,uid} = useContext(ChatContext);
    const {product,para} = props?.route?.params?.data
   
    useEffect(() => {
        getMensajes(chatActivo)
   
    }, [])
    
    return (
        <>
            <HeaderChat 
            titulo={product?.name} 
            subtitulo={para?.name}
            // iconName='keyboard-backspace'
            />
            <View style={styles.chatContent} >
                <SendMessage para={chatActivo.para} room={chatActivo.room} de={chatActivo.de} />
            <ScrollView contentContainerStyle={{
                flexDirection:'column-reverse'
            }} >
            {
                mensajes.map( msg => (
                    ( msg.para === uid )
                    ? <IncomingMessage key={ msg._id } msg={ msg } />
                    : <OutgoingMessage key={ msg._id } msg={ msg } />
                ))
            }
            </ScrollView>
            

               

            </View>
        </>
     
    )
}


const styles = StyleSheet.create({
    chatContent:{
        color:Colors.bgColor,
        flex:1,
        flexDirection:'column-reverse'
    }
    
})