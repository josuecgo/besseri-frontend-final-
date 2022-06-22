import React from 'react'
import {Platform,View,DeviceEventEmitter,Alert} from 'react-native'
import messaging from '@react-native-firebase/messaging';

import PushNotificationIOS from '@react-native-community/push-notification-ios';


export default class PushNotificationManager extends React.Component {
    constructor(props) {
        super(props);
       
        const {getNotificaciones} = this.props;
        if (Platform.OS === 'ios') {
        PushNotificationIOS.requestPermissions()
        PushNotificationIOS.addEventListener('localNotification',pushIos)

 
        async function pushIos(){
            const unsubscribe = await messaging().onMessage(async (remoteMsg) => {
              console.log('remote');
              PushNotificationIOS.presentLocalNotification({
                alertTitle:remoteMsg.data.title,
                alertBody:remoteMsg.data.message
              })
               getNotificaciones();
            })
           
            
            return unsubscribe
          }
        }

    }

             
    render() {
        const {children} = this.props;

        return <View style={{flex:1}}>{children}</View>
    }
}