/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry,Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from 'react-native-push-notification'
import messaging, { firebase } from '@react-native-firebase/messaging';
import moment from 'moment'
import 'moment/locale/es'  // without this line it didn't work
moment.locale('es')


PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
      console.log("TOKEN:", token);
    },
  
    // // (required) Called when a remote or local notification is opened or received
    // onNotification: function(notification) {
    //   console.log("NOTIFICATION:", notification);
  
    //   // process the notification here
  
    //   // required on iOS only 
    // },
    // Android only
    // iOS only
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },
    popInitialNotification: true,
    // requestPermissions: Platform.OS == 'ios'
    requestPermissions: true,
  });

messaging().setBackgroundMessageHandler(async remoteMessage => {
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
         title:remoteMessage?.data?.title,
         message:remoteMessage?.data?.message,
         channelId:'channel-id'
       })
  });
AppRegistry.registerComponent(appName, () => App);
