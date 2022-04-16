import React, { useEffect, useState } from 'react';
import { Button, View, Alert, Text, StatusBar,useColorScheme } from 'react-native';
import SplashScreen from './screens/splash.screen';
import { ROLES } from './util/constants';
import { NavigationContainer } from '@react-navigation/native';
import { USER_ROLE } from './util/local-storage';
import { VendorNavigation } from './screens/vendor/vendor.navigation';
import { AutoPartsAndServices } from './screens/customer/customer.navigation';
import { RiderNavigation } from './screens/rider/rider.navigation';
import { LSFS } from './screens/login.navigation';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/login.screen';
import { MainNavigation } from './util/Routes/navigation.routes';
import { combineReducers, createStore } from 'redux';
import businessProfileReducer from './util/ReduxStore/Reducers/VendorReducers/BusinessProfileReducer';
import { Provider } from 'react-redux';
import CartReducer from './util/ReduxStore/Reducers/CustomerReducers/CartReducer';
import { StripeProvider } from '@stripe/stripe-react-native';
import RiderReducer from './util/ReduxStore/Reducers/RiderReducers/RiderReducer';
import firebaseApp from "@react-native-firebase/app";
import messaging, { firebase } from '@react-native-firebase/messaging';
import { getUserId } from './util/local-storage/auth_service';
import axios from 'axios';
import { api_urls, base_url } from './util/api/api_essentials';
import PushNotification from 'react-native-push-notification';

const getComponent = {
  [ROLES.UNSET]: <LSFS />,
  [ROLES.BUSINESS]: <VendorNavigation />,
  [ROLES.CUSTOMER]: <AutoPartsAndServices />,
  [ROLES.RIDER]: <RiderNavigation />,
};

const App = () => {


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
  const showNotification = (msg) => {
    console.log(msg)
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
       })
    } catch(e) {
      alert('errr');
      console.log(e)
    }
  }

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      showNotification(remoteMessage)
    });
  },[])

  useEffect(() => {
    // firebase.messaging().onMessage(msg => {
    //   alert('ms')
    // })
    messaging().onMessage(msg => {
      showNotification(msg)
    })
  },[])

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
    const permission = await requestUserPermission();
    if(permission) {
      const fcmToken =  await firebase.messaging().getToken();
      const userId = await getUserId();
      if(fcmToken && userId) {
        const r = await axios.post(api_urls?.save_fcm_token,{
          token:fcmToken,
          userId:userId
        })
        console.log('line 78',r?.data)

      }
    } else {
      alert('no permsio')
    }
  }
  useEffect(() => {
    getToken()
  }, []);


  const { getItem: getStoreRole } = useAsyncStorage(USER_ROLE);
  const store = combineReducers({
    businessActions: businessProfileReducer,
    cart: CartReducer,
    rider: RiderReducer
  });
  const reduxStore = createStore(store);
  const [showSplashScreen, setSplashScreen] = useState(true);
  const [userRole, setUserRole] = useState(ROLES.UNSET);

  useEffect(() => {
    (async () => {
      const data = await getStoreRole();
      if (data) {
        setUserRole(data);
      }
      setSplashScreen(false);
    })();
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  return (
  
    <StripeProvider
      publishableKey="pk_test_51K6fAwEZl12SIefHDB3dMygU6FJQ79Q81wCsNeaIbYlP3jqmOAUi7b9XdRkfOqrAK7Na8EgjEp6gJuacFtP4oMRa00lcje6la4"
    // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
      <NavigationContainer>
        <Provider store={reduxStore}>
          <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
          {/* {showSplashScreen ? <SplashScreen /> : <MainNavigation />} */}
          <MainNavigation />
        </Provider>
      </NavigationContainer>
    </StripeProvider>

  );
};

export default App;
