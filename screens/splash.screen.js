import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  ToastAndroid,
  useWindowDimensions,
  View,
} from 'react-native';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import Spinner from 'react-native-spinkit';
import {getUserType, getUserId, saveBusinessProfile, saveBusinessStatus, getBusinessId, getBusinessProfile} from '../util/local-storage/auth_service';
import { MAIN_ROUTES, USER_ROLES } from '../util/constants';
import { api_statuses, vendor_api_urls } from '../util/api/api_essentials';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as BusinessProfileActions from '../util/ReduxStore/Actions/VendorActions/BusinessProfleActions';
import { getStoreEarnings } from '../util/api/CommonFunctions';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const SplashScreen = ({navigation}) => {
  const {width, height} = useWindowDimensions();
  const dispatch = useDispatch();
//   async function onDisplayNotification(notification) {
//     console.log(notification)
//     // Create a channel
//     const channelId = await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//     });

//     // Display a notification
//     await notifee.displayNotification({
//       title:notification?.notification?.title,
//       body:notification?.notification?.body,
//       android: {
//         channelId,
//       },
    
//     });
//   }
 
//   const getToken = async()=>{
//     const token = await messaging().getToken();
//     console.log("Token",token)

// }
// useEffect(() => {
//     getToken();
//    const unsubscribe = messaging().onMessage(async remoteMessage => {
//      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
//      onDisplayNotification(remoteMessage)
//     //  })
//    });
//    messaging().onNotificationOpenedApp(remoteMessage=>{
//        console.log('onNotificationOpenedApp', JSON.stringify(remoteMessage));
//       //  setNotification({
//       //      title:remoteMessage.notification.title,
//       //      body:remoteMessage.notification.body
//       //  })

//    })
//    messaging().getInitialNotification().then(remoteMessage=>{
//        if(remoteMessage){
//            console.log('Notification cause app to open', JSON.stringify(remoteMessage));
//       //  setNotification({
//       //      title:remoteMessage.notification.title,
//       //      body:remoteMessage.notification.body
//       //  })

//        }
//    })

//    return unsubscribe;
//  }, []);
  const getBusinessDetails = async(userId) => {
    try {
     const url = `${vendor_api_urls.business_profile}/${userId}`;
     const apiCall = await axios.get(url);
     if(apiCall.status == api_statuses.success) {
       dispatch(BusinessProfileActions.setActionMessage(apiCall.data.data.actions));
       await saveBusinessProfile(apiCall.data.data.store[0]);
       if(apiCall.data.data.isBlocked) {
        ToastAndroid.showWithGravity('Your business is blocked.',ToastAndroid.LONG,ToastAndroid.CENTER);
        await saveBusinessStatus(true);
       }
     }
     else {
       Alert.alert('Something went wrong','Sorry for interruption this request was failed');
       return;
     }
    } 
    catch(e) {
      console.log(e);
      Alert.alert('Something went wrong','Sorry for interruption this request was failed');
    }
  }

  const check_auth = async() => {
  
    const user_id = await getUserId();
    const userType = await getUserType();
    if(user_id && userType) {
      if(userType == USER_ROLES.vendor) {
        await getBusinessDetails(user_id);
        const businessId = await getBusinessId();
        const earnings = await getStoreEarnings(businessId);
        console.log('earnings line 56',earnings)
        dispatch(BusinessProfileActions.setEarnings(earnings));
        navigation.navigate(MAIN_ROUTES.VENDOR_STACK);

      } 
      if(userType == USER_ROLES.customer) {
        navigation.replace(MAIN_ROUTES.CUSTOMER_STACK);
      }
      if(userType == USER_ROLES.rider) {
        navigation.replace(MAIN_ROUTES.RIDER_STACK)
      }
    } else {
      navigation.replace(MAIN_ROUTES.AUTH_STACK);
    }
  }
  useEffect(() => {
    check_auth()
  },[]);

  return (
    <CustomSafeAreaViewComponent>
      <View
        style={[
          styles.splashScreenHome,
          CommonStyles.flexCenter,
          {width: width, height: height},
        ]}>
        <Text style={[CommonStyles.fontFamily, styles.mainFontStyles]}>
          <Text>bess</Text>
          <Text style={{color: Colors.secondaryColorGreenShade}}>e</Text>
          <Text>r</Text>
          <Text style={{color: Colors.primaryColor}}>i</Text>
        </Text>
       <Spinner
       type='Wave'
       color={Colors.primaryColor}
       size={50}
       />
      </View>
    </CustomSafeAreaViewComponent>
  );
};

const styles = StyleSheet.create({
  splashScreenHome: {
    backgroundColor: Colors.white,
  },
  mainFontStyles: {
    fontSize: 70,
    color: Colors.secondaryColorBlueShade,
  },
  layer: {},
});

export default SplashScreen;
