import React, { useEffect, useState,useContext } from 'react';
import {  StatusBar,useColorScheme } from 'react-native';

import { KeysStripe, ROLES } from './util/constants';
import { NavigationContainer } from '@react-navigation/native';
import { USER_ROLE } from './util/local-storage';
import { VendorNavigation } from './screens/vendor/vendor.navigation';
import { AutoPartsAndServices } from './screens/customer/customer.navigation';
import { RiderNavigation } from './screens/rider/rider.navigation';
import { LSFS } from './screens/login.navigation';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { MainNavigation } from './util/Routes/navigation.routes';
import { combineReducers, createStore } from 'redux';
import businessProfileReducer from './util/ReduxStore/Reducers/VendorReducers/BusinessProfileReducer';
import { Provider } from 'react-redux';
import CartReducer from './util/ReduxStore/Reducers/CustomerReducers/CartReducer';
import { StripeProvider } from '@stripe/stripe-react-native';
import RiderReducer from './util/ReduxStore/Reducers/RiderReducers/RiderReducer';

import messaging from '@react-native-firebase/messaging';
import { NativeBaseProvider } from 'native-base';

import { NotificationContext, NotificationProvider } from './util/context/NotificationContext';

import { ProductProvider } from './util/context/Product/ProductContext';

import { ChatProvider } from './util/context/Chat/ChatContext';




const App = () => {


  const { getItem: getStoreRole } = useAsyncStorage(USER_ROLE);
  const store = combineReducers({
    businessActions: businessProfileReducer,
    cart: CartReducer,
    rider: RiderReducer,
    
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

      
   
  
  return(
    <StripeProvider
    publishableKey={KeysStripe.LIVE_KEY}
    >
    <Provider store={reduxStore}>
    
        <NotificationProvider>  
          
          <ProductProvider>
            <ChatProvider>
              <NativeBaseProvider>
                <App2/>
              </NativeBaseProvider>
            </ChatProvider>
          </ProductProvider>
       
        </NotificationProvider>
      
      
    
    </Provider>
  </StripeProvider>
  )
}
const App2 = () => {
 
  const {showNotification,  getNotificaciones  } = useContext(NotificationContext);


  


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

    
  },[]);



  



  
  const isDarkMode = useColorScheme() === 'dark';

  return (
  
    //<PushNotificationManager getNotificaciones={getNotificaciones} >
      <NavigationContainer>
        
        
        <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
        {/* {showSplashScreen ? <SplashScreen /> : <MainNavigation />} */}
        <MainNavigation />
   
      </NavigationContainer>
    
  
    //</PushNotificationManager>



  );
};

export default App;
