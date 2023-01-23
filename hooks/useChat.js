import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ChatContext } from '../util/context/Chat/ChatContext';
import { NotificationContext } from '../util/context/NotificationContext';

export const useChat = (  ) => {
  const { getChats,uid } = useContext(ChatContext);
  const {notificaciones  } = useContext(NotificationContext);

  const allChats = () => {
    
    if (uid) {
      getChats(uid)
    }
   
  }


 
  

  return {
    allChats
  }

}