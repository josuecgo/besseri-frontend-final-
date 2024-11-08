import axios from "axios";
import React,{ createContext, useEffect, useReducer,useState } from "react";
import {
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { api_urls } from "../api/api_essentials";
import { showToaster } from "../constants";
import { getTokenFcm, getUser, getUserId, saveTokenFcm } from "../local-storage/auth_service";

import { notificationReducer } from "./notificationReducer";

import firebaseApp from "@react-native-firebase/app";
import messaging, { firebase } from '@react-native-firebase/messaging';


import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { useInfoUser } from "../../hooks/useInfoUsers";
import DeviceInfo from 'react-native-device-info';
import notifee, { AuthorizationStatus, EventType } from '@notifee/react-native';



const authInicialState = {
    view: false, 
    notification: '',
    notificaciones:[],
    countRider:0,
    count:0,
    countCustomer:0,
    
}


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


export const NotificationContext = createContext({});

export const NotificationProvider = ({children}) => {
    const [state, dispatch] = useReducer(notificationReducer, authInicialState);
    const [received, setReceived] = useState("")

    
    const {getNotificaciones} = useInfoUser()



   
    const showNotification = async(msg) => {
       
        onMessageReceived(msg)

        // try {
         
        //   // 

        //   await getNotificaciones();
        //   PushNotification.createChannel(
        //     {
        //       channelId: "channel-id", // (required)
        //       channelName: "My channel", // (required)
        //       channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        //       playSound: false, // (optional) default: true
        //       soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        //       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        //     },
        //     (created) => {} // (optional) callback returns whether the channel was created, false means it already existed.
        //   );
          
         

   
        //   await PushNotification.localNotification({
        //       title:msg?.data?.title,
        //       message:msg?.data?.message,
        //       channelId:'channel-id'
        //    });
           
           
          
          
        // } catch(e) {
        //   console.log(e,'show notification');
        //   // alert('No se pudo recibir notificacion');
        //   //console.log({e})
        // }


       
    }


    const onMessageReceived = async (message) => {
      try {
  
  
        // if (appStateVisible !== 'active') {
        //   await getNotificaciones();
        //   return
        // }
  
        if (Platform.OS === 'ios') {
          await notifee.requestPermission()
        }
  
  
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'channel-id-besser',
          name: 'My Channel',
  
        });
  
   
        const notifeeData = JSON.parse(message.data.notifee);
        const messageId = message.messageId;
  
  
      
       
        if (received.includes(messageId) )  return;
        
  
  
  
        if (messageId) {
          setReceived([... received,messageId]);
        }
  
        await notifee.displayNotification(notifeeData);
  
        // await getNotificaciones()
  
      } catch (error) {
        console.error('Error al mostrar la notificación:', error);
      }
    };


    const onForegroundMessageRecived = async (message, navigation) => {

      if (received === message?.messageId)  return;
      
  
  
      setReceived(message?.messageId)
  
   
  

  
  
  
      Alert.alert(
        message?.notification.title ?? '',
        message?.notification.body ?? 'Nueva notificación',
       
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Ir a notificaciones',
            onPress: () => { navigation.navigate(BOTTOM_TAB_VENDOR_ROUTES.NOTIFICATION_STACK) }, 
          },
        ]
      );
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
        const notifeePermission =  await notifee.requestPermission()
        const authStatus = await messaging().requestPermission();
 

          // Obtener la configuración de notificaciones
          const settings = await notifee.getNotificationSettings();
         

          // Verificar si el permiso ha sido autorizado
          if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
           
            return true;
          } 
          
          // Verificar si el permiso ha sido denegado y pedir permiso si es necesario
          else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
            console.log('Notification permission was denied');
            
            const newSettings = await notifee.requestPermission();
            
            // Comprobar si se concedió el permiso después de la solicitud
            if (newSettings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
           
              return true;
            } else {
             
              return false;
            }
          }

          // Si está en un estado provisional (por ejemplo, en iOS)
          else {
            console.log('Notification permissions are in a provisional state, requesting permission...');
            await notifee.requestPermission();
            return false;
          }
        
        } catch(e) {
          alert('error')
        }

      }
    
      const getToken = async() => {
        const permission =  
        Platform.OS === 'android' 
          ? await  requestUserPermission() 
          : PushNotificationIOS.requestPermissions()
         
        
          
        if(permission) {
          const fcmToken =  await firebase.messaging().getToken();
          const savedToken =  await  getTokenFcm()

          const userId = await getUserId();
          let version = DeviceInfo.getDeviceId();
          if(fcmToken && userId) {
           
         
            
            if(fcmToken !== savedToken) {
              const r = await axios.post(api_urls?.save_fcm_token,{
                token:fcmToken,
                userId:userId,
                deviceId:version
              })
              // console.log(r.data,'response save fcm token');
              
              saveTokenFcm(fcmToken)
            }
           
            
    
          }
        } else {
          Alert.alert(
            "Permiso de Notificación Denegado",
            "Para recibir notificaciones, habilita los permisos en los ajustes de tu dispositivo.",
            [
              {
                text: "Cancelar",
                style: "cancel"
              },
              {
                text: "Abrir Ajustes",
                onPress: () => Linking.openSettings() // Abre la pantalla de ajustes
              }
            ]
          );
        }
      }
     
      async function pushIos(){
       
 
        
        getNotificaciones();

        return unsubscribe
      }

   


      const iosPermisoss = () => {
        PushNotificationIOS.requestPermissions()
       
       
      }

   

    
  
    const onRemoteNotification = (notification) => {
        // //console.log({notification});
       
      const isClicked = notification.getData().userInteraction === 1;
      
      if (isClicked) {
        getNotificaciones();
      } else {
        getNotificaciones();
      }
    };

    const listenerBack = async (navigation) => {



      notifee.onBackgroundEvent(async ({ type, detail }) => {
        const { notification, pressAction } = detail;
  
      
        if (type === EventType.PRESS) {
  
         
          // navigation.navigate(BOTTOM_TAB_VENDOR_ROUTES.NOTIFICATION_STACK)
          await notifee.cancelNotification(notification.id);
          
        }
      });
  

    }


    useEffect(() => {
      const notificationType = 'notification';
    
      PushNotificationIOS.addEventListener(notificationType, onRemoteNotification);

    
      return () => {
        PushNotificationIOS.removeEventListener(notificationType);
      };
    }, []);


    return (
        <NotificationContext.Provider
        value={{
            ...state,
            getNotificaciones,
            deleteNotificaciones,
            getToken,
            showNotification,
            pushIos,
            iosPermisoss,
            onForegroundMessageRecived,
            listenerBack
        }}
        >
            {children}
        </NotificationContext.Provider>
    )
}