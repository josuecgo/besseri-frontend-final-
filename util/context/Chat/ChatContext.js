
import axios from 'axios';
import React, { createContext, useEffect, useReducer,useState } from 'react';

import { api_urls } from '../../api/api_essentials';
import { showToaster } from '../../constants';
import { getBusinessProfile, getUser, getUserId, getUserType } from '../../local-storage/auth_service';
import { chatReducer } from './chatReducer';


export const ChatContext = createContext();

const initialState = {
    uid: '',
    chatActivo: null, // UID del usuario al que yo quiero enviar mensajes
    usuarios: [], 
    mensajes: [], // El chat seleccionado
    sending:false,
    chats:false,
    newsChats: 0
}


export const ChatProvider = ({ children }) => {

    const [ chatState, dispatch ] = useReducer(chatReducer, initialState);
    const [mensaje, setMensaje] = useState('');
    const [loadingChats, setLoadingChats] = useState(false);

    const getMensajes = async(chat) => {
        try {
            
            const apiCall = await axios.post(`${api_urls.getMessage}/${chat.de}`,{
                chat
            }   
            );

            

            dispatch({
                type:'cargarMensajes',
                payload:apiCall?.data.data
            })

        } catch (error) {
            //console.log(error?.response?.data,'getMensajes');
        }
    }

    const enviarMensaje = async({para,room,de,mensaje}) => {
        try {
           
          
            dispatch({
                type:'enviando',
                payload:true
            })
            // //console.log({
            //     para,
            //     de:de,
            //     room:room,
            //     mensaje
            // } );
            const apiCall = await axios.post(`${api_urls.create_message}`,{
                para,
                de:de,
                room:room,
                mensaje
            }   
            );
            setMensaje('')
            
            if (apiCall?.data?.success) {
                getMensajes({para,room,de})
                setMensaje('');
                getChats(chatState.uid)
            }
            dispatch({
                type:'enviando',
                payload:false
            })

        } catch (error) {
            //console.log(error?.response);
            showToaster('No hay conexion :(');
            setMensaje('')
            dispatch({
                type:'enviando',
                payload:false
            })
        }
    }

    const getChats = async(id) =>  {
        try {
            if (!id) {
                return null;
            }
            setLoadingChats(true)
        
            const apiCall = await axios.get(`${api_urls.get_chats}/${id}`);
            
            if (apiCall.status === 200) {
                setLoadingChats(false)
                

                dispatch({
                    type:'chats',
                    payload:apiCall?.data.data
                }) 
            }
            setLoadingChats(false)
        } catch (error) {
            //console.log(error,'getChats');
            setLoadingChats(false)
        }
       
        
    }

    const activarChat = (data) => {
       
        dispatch({
            type:'activarChat',
            payload:data
        })
    }

    const typeUser = async() => {
        const userType  = await getUserType()
        const id = userType === 'customer' ? await getUserId() : await getBusinessProfile();
        // //console.log({id});
        if (userType === 'customer') {
            dispatch({
                type:'userActive',
                payload:id
            })
        }

        if (userType === 'vendor') {
            dispatch({
                type:'userActive',
                payload:id.account_id
            })
        }
        

    }

    const updateIsViewRoom = async(id) => {
        try {
            const apiCall = await axios.post(`${api_urls.update_isView_room}/${id}`);
           
          
            if (apiCall.status === 200) {
                //console.log(apiCall.data);
                getChats(chatState.chatActivo.de)
                
            }

        } catch (error) {
            //console.log(error);
        }
    }

    useEffect(() => {
        typeUser()
    }, [])
    

    
    

    return (
        <ChatContext.Provider value={{
            ...chatState,
            dispatch,
            getMensajes,
            enviarMensaje,
            mensaje, 
            setMensaje,
            getChats,
            activarChat,
            loadingChats,
            updateIsViewRoom
        }}>
            { children }
        </ChatContext.Provider>
    )
}
