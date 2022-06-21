import axios from "axios";
import React,{ createContext, useEffect, useReducer,useState } from "react";
import {

  Platform,

} from 'react-native';
import { api_urls } from "../api/api_essentials";
import { showToaster } from "../constants";
import { getUserId } from "../local-storage/auth_service";

import { notificationReducer } from "./notificationReducer";

import firebaseApp from "@react-native-firebase/app";
import messaging, { firebase } from '@react-native-firebase/messaging';

import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';





const authInicialState = {
    view: false, 
    notification: '',
    
}





export const NotificationContext = createContext({});

export const NotificationProvider = ({children}) => {
    const [state, dispatch] = useReducer(notificationReducer, authInicialState);
    const [count, setCount] = useState(0);
    const [countRider, setCountRider] = useState(0);
    const [countCustomer, setCountCustomer] = useState(0);
    const [notificaciones, setNotificaciones] = useState([])
   
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
       
        getNotificaciones();
       // notificationListener();
      
       
        
        try {
          
          
          PushNotification.createChannel(
            {
              channelId: "channel-id", // (required)
              channelName: "My channel", // (required)
              channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
              playSound: false, // (optional) default: true
              soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
              vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
          );
          PushNotification.localNotification({
             title:msg?.data?.title,
             message:msg?.data?.message,
             channelId:'channel-id'
          });

         
          
        } catch(e) {
          alert('errr');
          console.log(e)
        }


       
    }



    const getNotificaciones = async() => {
        try {
            const id = await getUserId();
            if (id) {
              const url = `${api_urls.getNotification}/${id}`;

              const apiCall = await axios.get(url);
              const data = apiCall?.data?.data;
              
              setNotificaciones(data)
              setCount(apiCall?.data?.count)
              setCountRider(apiCall?.data?.countRider)
              setCountCustomer(apiCall?.data?.countCustomer)
            }else{
              setNotificaciones([])
              setCount(0)
              setCountRider(0)
              setCountCustomer(0)
            }
            
           
        } catch (e) {
            console.log({ getNot: e })
            setNotificaciones([])
            setCount(0)
            setCountRider(0)
            setCountCustomer(0)
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
          console.log({fcmToken,device:Platform.OS});
          if(fcmToken && userId) {
            const r = await axios.post(api_urls?.save_fcm_token,{
              token:fcmToken,
              userId:userId
            })
            
    
          }
        } else {
          alert('Active permiso para recibir notificaciones')
        }
      }
     
      async function pushIos(msg){
        
        const unsubscribe = await messaging().onMessage(async (remoteMsg) => {
        ;
          PushNotificationIOS.presentLocalNotification({
            alertTitle:remoteMsg.data.title,
            alertBody:remoteMsg.data.message
          })
        })

        return unsubscribe
      }

    useEffect(() => {
        getToken();
       
    }, [])

    
    

    return (
        <NotificationContext.Provider
        value={{
            ...state,
            getNotificaciones,
            notificaciones,
            setNotificaciones,
            count,
            countRider,
            countCustomer,
            getToken,
            showNotification,
            pushIos
        }}
        >
            {children}
        </NotificationContext.Provider>
    )
}