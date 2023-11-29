import axios from "axios";
import React,{ createContext, useEffect, useReducer,useState } from "react";
import {
  Platform,
} from 'react-native';
import { api_urls } from "../api/api_essentials";
import { showToaster } from "../constants";
import { getUser, getUserId } from "../local-storage/auth_service";

import { notificationReducer } from "./notificationReducer";

import firebaseApp from "@react-native-firebase/app";
import messaging, { firebase } from '@react-native-firebase/messaging';

import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { useInfoUser } from "../../hooks/useInfoUsers";
import DeviceInfo from 'react-native-device-info';




const authInicialState = {
    view: false, 
    notification: '',
    notificaciones:[],
    countRider:0,
    count:0,
    countCustomer:0
}





export const NotificationContext = createContext({});

export const NotificationProvider = ({children}) => {
    const [state, dispatch] = useReducer(notificationReducer, authInicialState);
   
    const [notificaciones, setNotificaciones] = useState([])
    const {getNotificaciones} = useInfoUser()
    const firebaseConfig = {
        apiKey: "AIzaSyAjyGdmeJ8fyRP7eKPJ2ODtF0JEbqEbw8o",
        authDomain: "besseri-334619.firebaseapp.com",
        databaseURL: "https://besseri-334619-default-rtdb.firebaseio.com",
        projectId: "besseri-334619",
        storageBucket: "besseri-334619.appspot.com",
        messagingSenderId: "817083462769",
        appId: "1:817083462769:web:30999b0452552f992297d0",
        measurementId: "G-7BSM717KQ4"
    };
    
      // Initialize Firebase
      if (!firebaseApp.apps.length) {
        firebaseApp.initializeApp(firebaseConfig);
      } else {
        firebaseApp.app();
      }


   
    const showNotification = async(msg) => {
       
        

        try {
         
          getNotificaciones();
          PushNotification.createChannel(
            {
              channelId: "channel-id", // (required)
              channelName: "My channel", // (required)
              channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
              playSound: false, // (optional) default: true
              soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
              vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            (created) => {} // (optional) callback returns whether the channel was created, false means it already existed.
          );
          
         

   
          await PushNotification.localNotification({
              title:msg?.data?.title,
              message:msg?.data?.message,
              channelId:'channel-id'
           });
           
           
       
          
        } catch(e) {
          alert('No se pudo recibir notificacion');
          //console.log({e})
        }


       
    }



    

    const deleteNotificaciones = async() => {
      
      await dispatch({
        type:'getNotification',
        payload: {
          notificaciones:[],
          countRider:0,
          count:0,
          countCustomer:0,
        }
      });

      const userId = await getUserId();
      let version = DeviceInfo.getDeviceId();
      if(userId) {
        const r =  axios.post(api_urls?.delete_fcm_token,{
          userId:userId,
          deviceId:version
        })
        

      }

    }

    
    
      async function requestUserPermission() {
        try {
          
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        

        if (enabled) {
         
          return true
        } else {
          return false
        }
        } catch(e) {
          alert('error')
        }

      }
    
      const getToken = async() => {
        const permission =  Platform.OS === 'android' ? await  requestUserPermission() : PushNotificationIOS.requestPermissions()
       
        if(permission) {
          const fcmToken =  await firebase.messaging().getToken();
          const userId = await getUserId();
          let version = DeviceInfo.getDeviceId();
          if(fcmToken && userId) {
            const r = await axios.post(api_urls?.save_fcm_token,{
              token:fcmToken,
              userId:userId,
              deviceId:version
            })
            
    
          }
        } else {
          alert('Active permiso para recibir notificaciones')
        }
      }
     
      async function pushIos(){
       
        // const unsubscribe = await messaging().onMessage(async (remoteMsg) => {
        //   //console.log('remote push ios');
        //   // await PushNotificationIOS.addNotificationRequest({
        //   //   alertTitle:remoteMsg?.data?.title,
        //   //   alertBody:remoteMsg?.data?.message
        //   // })

        // })
        
        getNotificaciones();

        return unsubscribe
      }

   


      const iosPermisoss = () => {
        PushNotificationIOS.requestPermissions()
       
       
      }

   

    useEffect(async() => {
      const type = 'notification';
      PushNotificationIOS.addEventListener(type, onRemoteNotification);
      // await getNotificaciones();
      return () => {
        PushNotificationIOS.removeEventListener(type);
      };
    });
  
    const onRemoteNotification = (notification) => {
        // //console.log({notification});
       
      const isClicked = notification.getData().userInteraction === 1;
      
      if (isClicked) {
        getNotificaciones();
      } else {
        getNotificaciones();
      }
    };


    return (
        <NotificationContext.Provider
        value={{
            ...state,
            setNotificaciones,
            deleteNotificaciones,
            getToken,
            showNotification,
            pushIos,
            iosPermisoss
        }}
        >
            {children}
        </NotificationContext.Provider>
    )
}