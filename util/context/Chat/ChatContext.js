
import axios from 'axios';
import React, { createContext, useEffect, useReducer,useState } from 'react';

import { api_urls } from '../../api/api_essentials';
import { showToaster } from '../../constants';
import { getUserId } from '../../local-storage/auth_service';
import { chatReducer } from './chatReducer';


export const ChatContext = createContext();

const initialState = {
    uid: '',
    chatActivo: null, // UID del usuario al que yo quiero enviar mensajes
    usuarios: [], // Todos los usuarios de la base datos
    mensajes: [], // El chat seleccionado
    sending:false,
    chats:false

}


export const ChatProvider = ({ children }) => {

    const [ chatState, dispatch ] = useReducer(chatReducer, initialState);
    const [mensaje, setMensaje] = useState('');

    const getMensajes = async(de,room) => {
        try {
            const id = await getUserId();
           
            const apiCall = await axios.post(`${api_urls.getMessage}/${id}`,{
                    de,
                    room
            }   
            );

            dispatch({
                type:'cargarMensajes',
                payload:apiCall?.data.data
            })

        } catch (error) {
            console.log(error?.response?.data);
        }
    }

    const enviarMensaje = async({para,idProduct}) => {
        try {
            const id = await getUserId();
            dispatch({
                type:'enviando',
                payload:true
            })
            const apiCall = await axios.post(`${api_urls.create_message}`,{
                para,
                de:id,
                room:idProduct,
                mensaje
            }   
            );
            setMensaje('')
            
            if (apiCall?.data?.success) {
                getMensajes(para,idProduct)
                setMensaje('')
            }
            dispatch({
                type:'enviando',
                payload:false
            })

        } catch (error) {
            // console.log(error?.response?.data);
            showToaster('No hay conexion :(');
            setMensaje('')
            dispatch({
                type:'enviando',
                payload:false
            })
        }
    }

    const getChats = async() =>  {
        const id = await getUserId();
        const apiCall = await axios.get(`${api_urls.get_chats}/${id}`);

        console.log(apiCall.status);
        if (apiCall.status === 200) {
            dispatch({
                type:'chats',
                payload:apiCall?.data.data
            }) 
        }

       
        
    }

    // useEffect(() => {
    //     getChats()
    // }, [])
    

    return (
        <ChatContext.Provider value={{
            ...chatState,
            dispatch,
            getMensajes,
            enviarMensaje,
            mensaje, 
            setMensaje,
            getChats
        }}>
            { children }
        </ChatContext.Provider>
    )
}
