import { FlatList } from 'react-native'
import React,{ useContext }  from 'react'
import { ChatContext } from '../../util/context/Chat/ChatContext';

import { SendMessage } from '../../components/Chat/SendMessage';
import { IncomingMessage } from '../../components/Chat/IncomingMessage';

import { useEffect } from 'react';
import { OutgoingMessage } from '../../components/Chat/OutgoingMessage';
import { HeaderChat } from '../../components/Chat/HeaderChat';
import Colors from '../../util/styles/colors';
import { NotificationContext } from '../../util/context/NotificationContext';




export const PrivateScreen = (props) => {
    const {notificaciones  } = useContext(NotificationContext);
    const { mensajes, getMensajes, chatActivo,uid,updateIsViewRoom} = useContext(ChatContext);
    const data = props?.route?.params?.data
    const {product,para} = data;
   
   
    useEffect(() => {
        getMensajes(chatActivo)
   
    }, [notificaciones])

    useEffect(() => {
        if (data.isView) {
            updateIsViewRoom(data._id)
        }
    }, [data,notificaciones])
    
    
    return (
        <>
            <HeaderChat 
            titulo={product?.name} 
            subtitulo={para?.name}
           
            />
          
            <FlatList
                data={mensajes}
                renderItem={({ item }) => item.para === uid  ? <IncomingMessage key={ item._id } msg={ item } />
                : <OutgoingMessage key={ item._id } msg={ item } />
            }
                inverted
                style={{backgroundColor:Colors.bgColor}}
            />
            <SendMessage para={chatActivo.para} room={chatActivo.room} de={chatActivo.de} />

        </>
     
    )
}


