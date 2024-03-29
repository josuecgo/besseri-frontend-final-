/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from 'react-native-push-notification'
import moment from 'moment'
import 'moment/locale/es'  
moment.locale('es')



PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEn:", token);
    
  },
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
  

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
  
    // process the action
  },
  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    // console.error(err.message, err);
  },
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



AppRegistry.registerComponent(appName, () => App);
