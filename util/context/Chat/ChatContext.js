import { types } from '@babel/core';
import axios from 'axios';
import React, { createContext, useReducer } from 'react';
import { api_urls, vendor_api_urls } from '../../api/api_essentials';
import { getUserId } from '../../local-storage/auth_service';
import { chatReducer } from './chatReducer';


export const ChatContext = createContext();

const initialState = {
    uid: '',
    chatActivo: null, // UID del usuario al que yo quiero enviar mensajes
    usuarios: [], // Todos los usuarios de la base datos
    mensajes: [], // El chat seleccionado
}


export const ChatProvider = ({ children }) => {

    const [ chatState, dispatch ] = useReducer(chatReducer, initialState);


    const getMensajes = async(de) => {
        // try {
            // const id = await getUserId();
        
            // const apiCall = await axios.get(`${api_urls.getMessage}/${id}`,{
            //     data:{
            //         de
            //     },
            //     params:{
            //         de
            //     }
            // }   
            // );

            
            // dispatch({
            //     type:'cargarMensajes',
            //     payload:apiCall?.data.data
            // })
            // dispatch({
            //     type:'cargarMensajes',
            //     payload:apiCall?.data.data
            // })
        // } catch (error) {
            // console.log(error?.response?.data);
        // }
    }

    const enviarMensaje = async(para) => {
        // try {
        //     const id = await getUserId();
        
        //     const apiCall = await axios.post(`${api_urls.getMessage}/${id}`,{
        //         data:{
        //             de
        //         },
        //         params:{
        //             de
        //         }
        //     }   
        //     );

        //     dispatch({
        //         type:'cargarMensajes',
        //         payload:apiCall?.data.data
        //     })

        // } catch (error) {
        //     // console.log(error?.response?.data);
        // }
    }

    return (
        <ChatContext.Provider value={{
            chatState,
            dispatch,
            getMensajes
        }}>
            { children }
        </ChatContext.Provider>
    )
}
